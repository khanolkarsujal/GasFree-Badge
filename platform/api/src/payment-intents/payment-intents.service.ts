import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, PaymentIntentStatus } from '@prisma/client';
import { randomBytes } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { FormanceService } from '../ledger/formance.service';

@Injectable()
export class PaymentIntentsService {
  constructor(
    private prisma: PrismaService,
    private ledger: FormanceService,
  ) {}

  private serialize(pi: {
    id: string;
    amount: Prisma.Decimal;
    currency: string;
    status: PaymentIntentStatus;
    description: string | null;
    metadata: Prisma.JsonValue;
    clientSecret: string;
    createdAt: Date;
  }) {
    return {
      id: pi.id,
      object: 'payment_intent',
      amount: pi.amount.toString(),
      currency: pi.currency,
      status: pi.status,
      description: pi.description,
      metadata: pi.metadata,
      client_secret: pi.clientSecret,
      created: Math.floor(pi.createdAt.getTime() / 1000),
    };
  }

  async create(customerId: string, amount: string, description?: string, idempotencyKey?: string) {
    if (idempotencyKey) {
      const existing = await this.prisma.paymentIntent.findUnique({ where: { idempotencyKey } });
      if (existing) return this.serialize(existing);
    }

    const clientSecret = `pi_${randomBytes(24).toString('hex')}`;
    const pi = await this.prisma.paymentIntent.create({
      data: {
        customerId,
        amount,
        description,
        clientSecret,
        idempotencyKey,
        status: PaymentIntentStatus.requires_confirmation,
      },
    });
    return this.serialize(pi);
  }

  async confirm(customerId: string, paymentIntentId: string, idempotencyKey?: string) {
    const pi = await this.prisma.paymentIntent.findFirst({
      where: { id: paymentIntentId, customerId },
    });
    if (!pi) throw new NotFoundException('PaymentIntent not found');
    if (pi.status === PaymentIntentStatus.succeeded) return this.serialize(pi);

    const customer = await this.prisma.customer.findUnique({ where: { id: customerId } });
    if (!customer) throw new NotFoundException();

    const units = this.ledger.toUnits(pi.amount.toString());
    const balance = await this.ledger.getWalletBalance(customer.walletAddress);
    if (balance < units) {
      throw new BadRequestException({
        code: 'insufficient_funds',
        message: 'Insufficient TYI balance. Top up via POST /v1/balance/topup',
      });
    }

    const txn = await this.ledger.transfer(
      customer.walletAddress,
      'platform:treasury',
      units,
      `pi_${pi.id}`,
      idempotencyKey || pi.idempotencyKey || pi.id,
    );

    const ledgerTxnId = String((txn as { data?: { id?: number } }).data?.id ?? '');

    const updated = await this.prisma.paymentIntent.update({
      where: { id: pi.id },
      data: {
        status: PaymentIntentStatus.succeeded,
        ledgerTxnId,
      },
    });

    await this.prisma.balanceTransaction.create({
      data: {
        customerId,
        amount: pi.amount,
        net: pi.amount,
        type: 'payment',
        description: pi.description || 'Payment',
        sourceId: pi.id,
        sourceType: 'payment_intent',
        ledgerTxnId,
      },
    });

    return this.serialize(updated);
  }

  async list(customerId: string, limit = 25) {
    const rows = await this.prisma.paymentIntent.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
    return { object: 'list', data: rows.map((r) => this.serialize(r)) };
  }

  async get(customerId: string, id: string) {
    const pi = await this.prisma.paymentIntent.findFirst({ where: { id, customerId } });
    if (!pi) throw new NotFoundException();
    return this.serialize(pi);
  }
}
