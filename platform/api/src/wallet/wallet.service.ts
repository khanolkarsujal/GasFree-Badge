import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FormanceService } from '../ledger/formance.service';
import { ChainService } from '../chain/chain.service';

@Injectable()
export class WalletService {
  constructor(
    private prisma: PrismaService,
    private ledger: FormanceService,
    private chain: ChainService,
  ) {}

  async getDashboard(customerId: string) {
    const customer = await this.prisma.customer.findUnique({ where: { id: customerId } });
    if (!customer) throw new Error('Customer not found');

    let ledgerUnits: bigint | null = null;
    let ledgerStatus: 'ok' | 'unavailable' = 'ok';
    try {
      ledgerUnits = await this.ledger.getWalletBalance(customer.walletAddress);
    } catch {
      ledgerStatus = 'unavailable';
    }

    const [onChainTyi, recentTxns, intents] = await Promise.all([
      this.chain.getTyiBalance(customer.walletAddress),
      this.prisma.balanceTransaction.findMany({
        where: { customerId },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      this.prisma.paymentIntent.findMany({
        where: { customerId },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ]);

    return {
      customer: {
        id: customer.id,
        wallet_address: customer.walletAddress,
        name: customer.name,
        email: customer.email,
      },
      balances: {
        platform_available: ledgerUnits !== null ? this.ledger.fromUnits(ledgerUnits) : null,
        ledger_status: ledgerStatus,
        on_chain_tyi: onChainTyi,
        currency: 'tyi',
      },
      recent_activity: recentTxns.map((t) => ({
        id: t.id,
        amount: t.amount.toString(),
        type: t.type,
        description: t.description,
        created: t.createdAt,
      })),
      recent_payment_intents: intents.map((p) => ({
        id: p.id,
        amount: p.amount.toString(),
        status: p.status,
      })),
    };
  }
}
