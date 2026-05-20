import { AuthService } from '../services/AuthService.js';

const auth = new AuthService();

export async function authenticate(request, reply) {
  const header = request.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return reply.code(401).send({ error: 'Unauthorized', code: 'UNAUTHORIZED' });
  }
  const token = header.slice(7);
  const address = auth.resolveSession(token);
  if (!address) {
    return reply.code(401).send({ error: 'Session expired', code: 'SESSION_EXPIRED' });
  }
  request.user = { address };
}
