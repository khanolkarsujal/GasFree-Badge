import { PaymentService } from '../services/PaymentService.js';
import { sendMoneySchema, requestMoneySchema, payRequestSchema, billPaySchema } from '../lib/validators.js';
import { getDb } from '../db/index.js';
import { AppError } from '../lib/errors.js';

const payments = new PaymentService();

export async function paymentRoutes(app) {
  app.post('/payments/send', { preHandler: [app.authenticate] }, async (request) => {
    const body = sendMoneySchema.parse(request.body);
    return payments.sendMoney(request.user.address, body);
  });

  app.post('/payments/request', { preHandler: [app.authenticate] }, async (request) => {
    const body = requestMoneySchema.parse(request.body);
    return payments.createPaymentRequest(request.user.address, body);
  });

  app.get('/payments/request/:code', async (request) => {
    const db = getDb();
    const row = db.prepare(`
      SELECT request_code, payee_address, amount, currency, note, status, expires_at, created_at
      FROM payment_requests WHERE request_code = ?
    `).get(request.params.code);
    if (!row) throw new AppError('Payment request not found', 404);
    return {
      ...row,
      payeeMasked: `${row.payee_address.slice(0, 6)}...${row.payee_address.slice(-4)}`,
    };
  });

  app.post('/payments/request/pay', { preHandler: [app.authenticate] }, async (request) => {
    const { requestCode } = payRequestSchema.parse(request.body);
    return payments.payRequest(request.user.address, requestCode);
  });

  app.get('/payments/requests', { preHandler: [app.authenticate] }, async (request) => {
    const db = getDb();
    const { status = 'pending' } = request.query;
    return db.prepare(`
      SELECT id, request_code, amount, currency, note, status, payer_address, expires_at, paid_at, created_at
      FROM payment_requests
      WHERE payee_address = ? AND (? = 'all' OR status = ?)
      ORDER BY created_at DESC LIMIT 50
    `).all(request.user.address, status, status);
  });

  app.post('/payments/bill-pay', { preHandler: [app.authenticate] }, async (request) => {
    const body = billPaySchema.parse(request.body);
    const result = await payments.billPay(request.user.address, body);
    return { ...result, category: 'merchant_pay', merchantId: body.merchantId };
  });

  /** Paytm-style deep link landing */
  app.get('/pay/:code', async (request, reply) => {
    const db = getDb();
    const row = db.prepare(`
      SELECT request_code, amount, currency, note, status, expires_at
      FROM payment_requests WHERE request_code = ?
    `).get(request.params.code);
    if (!row) {
      return reply.code(404).send({ error: 'Invalid payment link', code: 'NOT_FOUND' });
    }
    return {
      type: 'collect_request',
      ...row,
      payEndpoint: '/api/v1/payments/request/pay',
    };
  });
}
