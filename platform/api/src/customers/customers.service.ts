import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FormanceService } from '../ledger/formance.service';

@Injectable()
export class CustomersService {
  constructor(
    private prisma: PrismaService,
    private ledger: FormanceService,
  ) {}

  async getMe(customerId: string) {
    const customer = await this.prisma.customer.findUnique({ where: { id: customerId } });
    if (!customer) throw new NotFoundException('Customer not found');

    const balanceUnits = await this.ledger.getWalletBalance(customer.walletAddress);
    return {
      id: customer.id,
      object: 'customer',
      wallet_address: customer.walletAddress,
      email: customer.email,
      name: customer.name,
      metadata: customer.metadata,
      balance: {
        available: this.ledger.fromUnits(balanceUnits),
        currency: 'tyi',
      },
      created: Math.floor(customer.createdAt.getTime() / 1000),
    };
  }

  async updateMe(customerId: string, data: { email?: string; name?: string; metadata?: object }) {
    return this.prisma.customer.update({
      where: { id: customerId },
      data: {
        email: data.email,
        name: data.name,
        metadata: data.metadata as object,
      },
    });
  }
}
