import { Injectable, Logger, OnModuleInit, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';

/**
 * Formance Ledger HTTP client — production double-entry ledger.
 * API: https://docs.formance.com/api-reference/ledgerv2/create-a-new-transaction-to-a-ledger
 */
@Injectable()
export class FormanceService implements OnModuleInit {
  private readonly logger = new Logger(FormanceService.name);
  private baseUrl: string;
  private ledger: string;
  private asset: string;
  private world: string;
  private ledgerReady = false;

  constructor(private config: ConfigService) {
    this.baseUrl = config.get<string>('formance.url')!;
    this.ledger = config.get<string>('formance.ledgerName')!;
    this.asset = config.get<string>('formance.asset')!;
    this.world = config.get<string>('formance.worldAccount')!;
  }

  async onModuleInit() {
    try {
      await this.ensureLedger();
      this.ledgerReady = true;
      this.logger.log(`Formance ledger "${this.ledger}" ready at ${this.baseUrl}`);
    } catch (e) {
      this.ledgerReady = false;
      this.logger.warn(`Formance unavailable — start docker compose in /platform: ${(e as Error).message}`);
    }
  }

  isReady(): boolean {
    return this.ledgerReady;
  }

  walletAccount(address: string): string {
    return `wallet:${address.toLowerCase()}`;
  }

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(init?.headers || {}),
      },
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Formance ${res.status}: ${body}`);
    }
    if (res.status === 204) return {} as T;
    return res.json() as Promise<T>;
  }

  async ensureLedger(): Promise<void> {
    try {
      await this.request(`/api/ledger/v2/${this.ledger}`, { method: 'HEAD' });
    } catch {
      await this.request(`/api/ledger/v2/${this.ledger}`, {
        method: 'POST',
        body: JSON.stringify({}),
      });
    }
  }

  /** Credit user wallet from world (add money / top-up) */
  async creditWallet(address: string, amountUnits: bigint, reference?: string, idempotencyKey?: string) {
    return this.postTransaction(
      [{ source: this.world, destination: this.walletAccount(address), amount: amountUnits, asset: this.asset }],
      reference,
      idempotencyKey,
    );
  }

  /** P2P transfer between wallets */
  async transfer(from: string, to: string, amountUnits: bigint, reference?: string, idempotencyKey?: string) {
    return this.postTransaction(
      [
        {
          source: this.walletAccount(from),
          destination: this.walletAccount(to),
          amount: amountUnits,
          asset: this.asset,
        },
      ],
      reference,
      idempotencyKey,
    );
  }

  async getWalletBalance(address: string): Promise<bigint> {
    if (!this.ledgerReady) {
      throw new ServiceUnavailableException('Ledger service unavailable');
    }
    const data = await this.request<{ data?: Record<string, Record<string, number>> }>(
      `/api/ledger/v2/${this.ledger}/accounts/${encodeURIComponent(this.walletAccount(address))}`,
    );
    const balances = (data as { balances?: Record<string, number> }).balances || {};
    const raw = balances[this.asset] ?? 0;
    return BigInt(raw);
  }

  private async postTransaction(
    postings: { source: string; destination: string; amount: bigint; asset: string }[],
    reference?: string,
    idempotencyKey?: string,
  ) {
    const headers: Record<string, string> = {};
    if (idempotencyKey) headers['Idempotency-Key'] = idempotencyKey;

    const serialized = postings.map((p) => ({
      source: p.source,
      destination: p.destination,
      amount: Number(p.amount <= BigInt(Number.MAX_SAFE_INTEGER) ? p.amount : Number.MAX_SAFE_INTEGER),
      asset: p.asset,
    }));

    return this.request<{ data?: { id: number } }>(`/api/ledger/v2/${this.ledger}/transactions`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        postings: serialized,
        reference: reference || randomUUID(),
        metadata: { platform: 'gasfree', version: '2.0.0' },
      }),
    });
  }

  toUnits(amountDecimal: string | number): bigint {
    const [whole, frac = ''] = String(amountDecimal).split('.');
    const padded = (frac + '0'.repeat(18)).slice(0, 18);
    return BigInt(whole) * 10n ** 18n + BigInt(padded);
  }

  fromUnits(units: bigint): string {
    const s = units.toString().padStart(19, '0');
    const whole = s.slice(0, -18) || '0';
    const frac = s.slice(-18).replace(/0+$/, '') || '0';
    return frac === '0' ? whole : `${whole}.${frac}`;
  }
}
