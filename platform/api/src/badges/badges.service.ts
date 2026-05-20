import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ChainService } from '../chain/chain.service';

const CATALOG = [
  { id: 'explorer', type: 0, name: 'Explorer', tier: 'Common' },
  { id: 'builder', type: 1, name: 'Builder', tier: 'Rare' },
  { id: 'pioneer', type: 2, name: 'Pioneer', tier: 'Epic' },
];

@Injectable()
export class BadgesService {
  constructor(
    private prisma: PrismaService,
    private chain: ChainService,
  ) {}

  getCatalog() {
    return { badges: CATALOG };
  }

  async prepareClaim(walletAddress: string, badgeId: string) {
    const badge = CATALOG.find((b) => b.id === badgeId);
    if (!badge) throw new Error('Unknown badge');
    const ugf = await this.chain.buildClaimBadgePayload(walletAddress, badge.type);
    return { badge, ugfTransaction: ugf };
  }

  async recordClaim(customerId: string, txHash: string, badgeId: string) {
    const customer = await this.prisma.customer.findUnique({ where: { id: customerId } });
    if (!customer) throw new Error('Customer not found');

    const badge = CATALOG.find((b) => b.id === badgeId);
    const verified = await this.chain.verifyBadgeClaimTx(txHash, customer.walletAddress);

    await this.prisma.balanceTransaction.create({
      data: {
        customerId,
        amount: 0,
        net: 0,
        type: 'badge_claim',
        description: `${badge?.name || 'Badge'} #${verified.tokenId} claimed`,
        sourceId: String(verified.tokenId),
        sourceType: 'badge',
        chainTxHash: txHash,
      },
    });

    return {
      recorded: true,
      tokenId: verified.tokenId,
      badgeType: verified.badgeType,
      badgeId: CATALOG.find((b) => b.type === verified.badgeType)?.id,
      txHash,
    };
  }

  async listClaims(customerId: string) {
    const rows = await this.prisma.balanceTransaction.findMany({
      where: { customerId, type: 'badge_claim' },
      orderBy: { createdAt: 'desc' },
    });
    return {
      claimed: rows.map((r) => ({
        tokenId: r.sourceId,
        description: r.description,
        txHash: r.chainTxHash,
        claimedAt: r.createdAt,
      })),
    };
  }
}
