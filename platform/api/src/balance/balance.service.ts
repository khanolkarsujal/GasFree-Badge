import { ForbiddenException, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { FormanceService } from '../ledger/formance.service';

@Injectable()
export class BalanceService {
  constructor(
    private prisma: PrismaService,
    private ledger: FormanceService,
    private config: ConfigService,
  ) {}

  async getBalance(customerId: string) {
    const customer = await this.prisma.customer.findUnique({ where: { id: customerId } });
    if (!this.ledger.isReady()) {
      throw new ServiceUnavailableException('Ledger service unavailable');
    }
    const units = await this.ledger.getWalletBalance(customer!.walletAddress);
    return {
      object: 'balance',
      available: [{ amount: this.ledger.fromUnits(units), currency: 'tyi' }],
      pending: [{ amount: '0', currency: 'tyi' }],
      ledger_status: 'ok',
    };
  }

  /** Add money — testnet only; requires X-Topup-Secret when TOPUP_SECRET is configured */
  async topup(customerId: string, amount: string, idempotencyKey?: string, topupSecret?: string) {
    const required = this.config.get<string>('topupSecret');
    const allowDev = this.config.get<boolean>('allowDevTopup');
    if (!allowDev && !required) {
      throw new ForbiddenException('Top-up disabled');
    }
    if (required && topupSecret !== required) {
      throw new ForbiddenException('Invalid top-up credentials');
    }

    const customer = await this.prisma.customer.findUnique({ where: { id: customerId } });
    const units = this.ledger.toUnits(amount);
    const txn = await this.ledger.creditWallet(
      customer!.walletAddress,
      units,
      `topup_${customerId}`,
      idempotencyKey,
    );
    const ledgerTxnId = String((txn as { data?: { id?: number } }).data?.id ?? '');

    await this.prisma.balanceTransaction.create({
      data: {
        customerId,
        amount,
        net: amount,
        type: 'topup',
        description: 'Add money',
        ledgerTxnId,
      },
    });

    return this.getBalance(customerId);
  }

  async listTransactions(customerId: string, limit = 25) {
    const rows = await this.prisma.balanceTransaction.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
    return {
      object: 'list',
      data: rows.map((r) => ({
        id: r.id,
        object: 'balance_transaction',
        amount: r.amount.toString(),
        net: r.net.toString(),
        fee: r.fee.toString(),
        currency: r.currency,
        type: r.type,
        status: r.status,
        description: r.description,
        created: Math.floor(r.createdAt.getTime() / 1000),
      })),
    };
  }
}
