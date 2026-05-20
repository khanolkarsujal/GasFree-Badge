import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { TransferStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { FormanceService } from '../ledger/formance.service';
@Injectable()
export class TransfersService {
  constructor(
    private prisma: PrismaService,
    private ledger: FormanceService,
  ) {}

  async create(
    customerId: string,
    amount: string,
    destination: string,
    description?: string,
    idempotencyKey?: string,
  ) {
    if (idempotencyKey) {
      const dup = await this.prisma.transfer.findUnique({ where: { idempotencyKey } });
      if (dup) return this.format(dup);
    }

    const sender = await this.prisma.customer.findUnique({ where: { id: customerId } });
    if (!sender) throw new NotFoundException();

    const destCustomer = await this.prisma.customer.findUnique({
      where: { walletAddress: destination.toLowerCase() },
    });
    if (!destCustomer) {
      await this.prisma.customer.create({ data: { walletAddress: destination.toLowerCase() } });
    }

    const units = this.ledger.toUnits(amount);
    const balance = await this.ledger.getWalletBalance(sender.walletAddress);
    if (balance < units) {
      throw new BadRequestException({ code: 'insufficient_funds', message: 'Insufficient balance' });
    }

    const transfer = await this.prisma.transfer.create({
      data: {
        customerId,
        amount,
        destination: destination.toLowerCase(),
        description,
        status: TransferStatus.pending,
        idempotencyKey,
      },
    });

    try {
      const txn = await this.ledger.transfer(
        sender.walletAddress,
        destination,
        units,
        `tr_${transfer.id}`,
        idempotencyKey || transfer.id,
      );
      const ledgerTxnId = String((txn as { data?: { id?: number } }).data?.id ?? '');

      const paid = await this.prisma.transfer.update({
        where: { id: transfer.id },
        data: { status: TransferStatus.paid, ledgerTxnId },
      });

      await this.recordBalanceTxn(customerId, amount, 'transfer', transfer.id, ledgerTxnId, true);
      const dest = await this.prisma.customer.findUnique({
        where: { walletAddress: destination.toLowerCase() },
      });
      if (dest) {
        await this.recordBalanceTxn(dest.id, amount, 'transfer', transfer.id, ledgerTxnId, false);
      }

      return this.format(paid);
    } catch (e) {
      await this.prisma.transfer.update({
        where: { id: transfer.id },
        data: { status: TransferStatus.failed },
      });
      throw e;
    }
  }

  private async recordBalanceTxn(
    customerId: string,
    amount: string,
    type: string,
    sourceId: string,
    ledgerTxnId: string,
    debit: boolean,
  ) {
    const dec = debit ? `-${amount}` : amount;
    await this.prisma.balanceTransaction.create({
      data: {
        customerId,
        amount: dec,
        net: dec,
        type,
        sourceId,
        sourceType: 'transfer',
        ledgerTxnId,
        description: debit ? 'Sent money' : 'Received money',
      },
    });
  }

  private format(t: {
    id: string;
    amount: { toString(): string };
    currency: string;
    destination: string;
    status: TransferStatus;
    description: string | null;
    createdAt: Date;
  }) {
    return {
      id: t.id,
      object: 'transfer',
      amount: t.amount.toString(),
      currency: t.currency,
      destination: t.destination,
      status: t.status,
      description: t.description,
      created: Math.floor(t.createdAt.getTime() / 1000),
    };
  }

  async list(customerId: string) {
    const rows = await this.prisma.transfer.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    return { object: 'list', data: rows.map((r) => this.format(r)) };
  }
}
