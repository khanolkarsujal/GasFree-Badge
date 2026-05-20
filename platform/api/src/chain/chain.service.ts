import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';

const BADGE_ABI = [
  'event BadgeClaimed(address indexed recipient, uint256 indexed tokenId, uint8 indexed badgeType)',
];

const TYI_ABI = ['function balanceOf(address) view returns (uint256)', 'function decimals() view returns (uint8)'];

@Injectable()
export class ChainService {
  private provider: ethers.JsonRpcProvider;
  private badgeAddress: string;
  private tyiAddress: string;

  constructor(config: ConfigService) {
    const chainId = config.get<number>('chain.id')!;
    this.provider = new ethers.JsonRpcProvider(config.get<string>('chain.rpcUrl'), chainId);
    this.badgeAddress = config.get<string>('chain.badgeContract')!;
    this.tyiAddress = config.get<string>('chain.tyiToken')!;
  }

  async getTyiBalance(address: string): Promise<string> {
    const tyi = new ethers.Contract(this.tyiAddress, TYI_ABI, this.provider);
    const [raw, dec] = await Promise.all([tyi.balanceOf(address), tyi.decimals()]);
    return ethers.formatUnits(raw, dec);
  }

  buildClaimBadgePayload(recipient: string, badgeType: number) {
    const iface = new ethers.Interface([
      'function claimBadge(address recipient, uint8 badgeType) external returns (uint256)',
    ]);
    const data = iface.encodeFunctionData('claimBadge', [recipient, badgeType]);
    return {
      txObject: {
        from: recipient.toLowerCase(),
        to: this.badgeAddress.toLowerCase(),
        data,
        value: '0x0',
      },
    };
  }

  async verifyBadgeClaimTx(txHash: string, expectedRecipient: string) {
    const receipt = await this.provider.getTransactionReceipt(txHash);
    if (!receipt || receipt.status !== 1) {
      throw new BadRequestException('Transaction not found or failed');
    }

    const badge = new ethers.Contract(this.badgeAddress, BADGE_ABI, this.provider);
    for (const log of receipt.logs) {
      try {
        const parsed = badge.interface.parseLog(log);
        if (parsed?.name === 'BadgeClaimed') {
          const recipient = String(parsed.args.recipient).toLowerCase();
          if (recipient !== expectedRecipient.toLowerCase()) {
            throw new BadRequestException('Claim recipient mismatch');
          }
          return {
            tokenId: Number(parsed.args.tokenId),
            badgeType: Number(parsed.args.badgeType),
            blockNumber: receipt.blockNumber,
          };
        }
      } catch {
        /* not our event */
      }
    }
    throw new BadRequestException('BadgeClaimed event not found in transaction');
  }
}
