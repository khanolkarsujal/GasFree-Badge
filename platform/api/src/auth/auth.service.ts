import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SiweMessage } from 'siwe';
import { randomBytes } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async createNonce(address: string) {
    const normalized = address.toLowerCase();
    const nonce = randomBytes(16).toString('hex');
    const expiresAt = new Date(Date.now() + 10 * 60_000);

    await this.prisma.authNonce.upsert({
      where: { address: normalized },
      create: { address: normalized, nonce, expiresAt },
      update: { nonce, expiresAt },
    });

    const message = new SiweMessage({
      domain: this.config.get('siwe.domain'),
      address: normalized,
      statement: 'Sign in to GasFree Payments.',
      uri: this.config.get('siwe.uri'),
      version: '1',
      chainId: this.config.get('chain.id'),
      nonce,
    }).prepareMessage();

    return { address: normalized, nonce, message };
  }

  async verifyLogin(message: string, signature: string) {
    const siwe = new SiweMessage(message);
    const result = await siwe.verify({ signature });
    const address = result.data.address.toLowerCase();

    const stored = await this.prisma.authNonce.findUnique({ where: { address } });
    if (!stored || stored.nonce !== result.data.nonce || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired nonce');
    }

    await this.prisma.authNonce.delete({ where: { address } }).catch(() => {});

    let customer = await this.prisma.customer.findUnique({ where: { walletAddress: address } });
    if (!customer) {
      customer = await this.prisma.customer.create({
        data: { walletAddress: address },
      });
    }

    const accessToken = this.jwt.sign({ sub: customer.id, address });
    return {
      access_token: accessToken,
      token_type: 'bearer',
      expires_in: 86400,
      customer_id: customer.id,
      wallet_address: address,
    };
  }
}
