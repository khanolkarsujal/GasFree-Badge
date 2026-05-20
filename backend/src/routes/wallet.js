import { WalletOverviewService } from '../services/WalletOverviewService.js';
import { PassbookService } from '../services/PassbookService.js';
import { ChainService } from '../services/ChainService.js';
import { profileUpdateSchema } from '../lib/validators.js';
import { UserService } from '../services/UserService.js';

const overview = new WalletOverviewService();
const passbook = new PassbookService();
const chain = new ChainService();
const users = new UserService();

export async function walletRoutes(app) {
  app.get('/wallet/home', { preHandler: [app.authenticate] }, async (request) => {
    return overview.getHome(request.user.address);
  });

  app.get('/wallet/balance', { preHandler: [app.authenticate] }, async (request) => {
    const addr = request.user.address;
    const profile = users.getProfile(addr);
    const [tyi, escrow] = await Promise.all([
      chain.getTyiBalance(addr),
      chain.getOnChainWalletBalance(addr),
    ]);
    return {
      wallet: { available: profile.available_balance, locked: profile.locked_balance },
      onChainTyi: tyi,
      onChainEscrow: escrow,
    };
  });

  app.get('/wallet/passbook', { preHandler: [app.authenticate] }, async (request) => {
    const { limit, offset, category, from, to } = request.query;
    return passbook.getPassbook(request.user.address, {
      limit: limit ? Number(limit) : 30,
      offset: offset ? Number(offset) : 0,
      category,
      fromDate: from,
      toDate: to,
    });
  });

  app.get('/wallet/statement/:year/:month', { preHandler: [app.authenticate] }, async (request) => {
    const { year, month } = request.params;
    return passbook.getMonthlyStatement(request.user.address, Number(year), Number(month));
  });

  app.patch('/wallet/profile', { preHandler: [app.authenticate] }, async (request) => {
    const body = profileUpdateSchema.parse(request.body);
    return users.updateProfile(request.user.address, { displayName: body.displayName });
  });

  app.get('/wallet/contracts', async () => chain.getContracts());
}
