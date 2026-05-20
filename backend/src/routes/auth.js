import { AuthService } from '../services/AuthService.js';
import { siweVerifySchema } from '../lib/validators.js';
import { AppError } from '../lib/errors.js';

const auth = new AuthService();

export async function authRoutes(app) {
  app.post('/auth/nonce', async (request) => {
    const { address } = request.body || {};
    if (!address?.match(/^0x[a-fA-F0-9]{40}$/)) {
      throw new AppError('Valid address required', 400);
    }
    const nonce = auth.createNonce(address);
    const message = auth.buildMessage(address, nonce);
    return { address: address.toLowerCase(), nonce, message };
  });

  app.post('/auth/verify', async (request) => {
    const body = siweVerifySchema.parse(request.body);
    const session = await auth.verifySiwe(body);
    return session;
  });

  app.post('/auth/logout', { preHandler: [app.authenticate] }, async (request) => {
    const token = request.headers.authorization.slice(7);
    auth.logout(token);
    return { ok: true };
  });
}
