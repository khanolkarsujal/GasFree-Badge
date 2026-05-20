import { getDb } from '../db/index.js';
import { config } from '../config.js';
import { UserService } from './UserService.js';
import { ChainService } from './ChainService.js';
import { PassbookService } from './PassbookService.js';

/**
 * Paytm-style home screen data: balance, quick actions, recent activity.
 */
export class WalletOverviewService {
  constructor() {
    this.users = new UserService();
    this.chain = new ChainService();
    this.passbook = new PassbookService();
  }

  async getHome(address) {
    this.users.ensureUser(address);
    const profile = this.users.getProfile(address);

    const [tyiOnChain, escrowBalance, badgeStats, recent] = await Promise.all([
      this.chain.getTyiBalance(address),
      this.chain.getOnChainWalletBalance(address),
      this.chain.getBadgeStats(),
      Promise.resolve(this.passbook.getPassbook(address, { limit: 5 })),
    ]);

    const db = getDb();
    const pendingRequests = db.prepare(`
      SELECT COUNT(*) AS c FROM payment_requests
      WHERE payee_address = ? AND status = 'pending'
    `).get(address.toLowerCase()).c;

    const day = new Date().toISOString().slice(0, 10);
    const daily = db.prepare('SELECT sent_amount FROM daily_limits WHERE user_address = ? AND day = ?')
      .get(address.toLowerCase(), day);

    return {
      user: {
        address: profile.address,
        displayName: profile.display_name || `User ${profile.address.slice(2, 6).toUpperCase()}`,
        kycTier: profile.kyc_tier,
        memberSince: profile.created_at,
      },
      balances: {
        /** SaaS wallet balance (instant P2P, bill pay) */
        wallet: {
          available: profile.available_balance,
          locked: profile.locked_balance,
          currency: 'TYI',
        },
        /** On-chain TYI in user's EOA (MetaMask) */
        onChainTyi: tyiOnChain,
        /** TYI deposited in TyiWallet.sol escrow */
        onChainEscrow: escrowBalance,
      },
      limits: {
        dailySendLimit: config.limits.dailySendTyi,
        dailySent: daily ? parseFloat(daily.sent_amount) : 0,
        perTransactionMax: config.limits.perTxMaxTyi,
      },
      quickActions: [
        { id: 'send', label: 'Send Money', icon: 'send' },
        { id: 'request', label: 'Request', icon: 'request' },
        { id: 'scan', label: 'Scan & Pay', icon: 'qr' },
        { id: 'add_money', label: 'Add Money', icon: 'add' },
        { id: 'passbook', label: 'Passbook', icon: 'book' },
        { id: 'badges', label: 'Badges', icon: 'badge' },
      ],
      services: {
        pendingPaymentRequests: pendingRequests,
        badgeCollection: badgeStats,
      },
      recentActivity: recent.entries,
    };
  }
}
