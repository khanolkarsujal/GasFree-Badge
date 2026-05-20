import { BadRequestException, Injectable } from '@nestjs/common';
import { PayoutStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { FormanceService } from '../ledger/formance.service';

@Injectable()
export class PayoutsService {
  constructor(
    private prisma: PrismaService,
    private ledger: FormanceService,
  ) {}

  async create(customerId: string, amount: string, destination?: string, idempotencyKey?: string) {
    const customer = await this.prisma.customer.findUnique({ where: { id: customerId } });
    const units = this.ledger.toUnits(amount);
    const balance = await this.ledger.getWalletBalance(customer!.walletAddress);
    if (balance < units) {
      throw new BadRequestException({ code: 'insufficient_funds', message: 'Insufficient balance' });
    }

    const payout = await this.prisma.payout.create({
      data: {
        customerId,
        amount,
        destination: destination || customer!.walletAddress,
        status: PayoutStatus.pending,
        idempotencyKey,
      },
    });

    await this.ledger.transfer(
      customer!.walletAddress,
      'platform:withdrawals',
      units,
      `po_${payout.id}`,
      idempotencyKey || payout.id,
    );

    const updated = await this.prisma.payout.update({
      where: { id: payout.id },
      data: { status: PayoutStatus.paid, arrivalDate: new Date() },
    });

    return {
      id: updated.id,
      object: 'payout',
      amount: updated.amount.toString(),
      currency: updated.currency,
      status: updated.status,
      destination: updated.destination,
      arrival_date: Math.floor(updated.arrivalDate!.getTime() / 1000),
      created: Math.floor(updated.createdAt.getTime() / 1000),
    };
  }

  async list(customerId: string) {
    const rows = await this.prisma.payout.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
    });
    return { object: 'list', data: rows };
  }
}
