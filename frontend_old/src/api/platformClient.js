const API_BASE = import.meta.env.VITE_PLATFORM_API_URL || 'http://localhost:3001/v1';

const TOKEN_KEY = 'gasfree_platform_token';

export function getStoredToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStoredToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

async function request(path, { method = 'GET', body, headers = {}, idempotencyKey } = {}) {
  const token = getStoredToken();
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || data.message || `API ${res.status}`);
    err.code = data.code;
    err.status = res.status;
    err.details = data;
    throw err;
  }
  return data;
}

export const platformApi = {
  health: () => request('/health'),

  authNonce: (address) => request('/auth/nonce', { method: 'POST', body: { address } }),

  authVerify: (message, signature) =>
    request('/auth/verify', { method: 'POST', body: { message, signature } }),

  dashboard: () => request('/wallet/dashboard'),

  balance: () => request('/balance'),

  topup: (amount, topupSecret) =>
    request('/balance/topup', {
      method: 'POST',
      body: { amount },
      headers: topupSecret ? { 'X-Topup-Secret': topupSecret } : {},
    }),

  passbook: () => request('/balance/transactions'),

  transfer: (destination, amount, description, idempotencyKey) =>
    request('/transfers', {
      method: 'POST',
      body: { destination, amount, description },
      idempotencyKey,
    }),

  badgeCatalog: () => request('/badges/catalog'),

  badgePrepare: (badgeId) => request('/badges/claim/prepare', { method: 'POST', body: { badgeId } }),

  badgeRecord: (txHash, badgeId) =>
    request('/badges/claims/record', { method: 'POST', body: { txHash, badgeId } }),

  badgeMine: () => request('/badges/mine'),

  billPay: (merchantId, amount, accountRef, idempotencyKey) =>
    request('/payments/bill-pay', {
      method: 'POST',
      body: { merchantId, amount, accountRef },
      idempotencyKey,
    }),
};

/** Treasury for demo donations — never the NFT contract */
export const DEMO_DONATION_RECIPIENT =
  import.meta.env.VITE_DONATION_RECIPIENT || '0x000000000000000000000000000000000000dEaD';
