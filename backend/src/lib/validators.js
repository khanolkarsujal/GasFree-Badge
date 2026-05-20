import { z } from 'zod';

const address = z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address');

export const siweVerifySchema = z.object({
  message: z.string().min(10),
  signature: z.string().regex(/^0x[a-fA-F0-9]+$/),
});

export const profileUpdateSchema = z.object({
  displayName: z.string().min(1).max(64).optional(),
});

export const sendMoneySchema = z.object({
  to: address,
  amount: z.union([z.string(), z.number()]).transform(String),
  narration: z.string().max(140).optional(),
  idempotencyKey: z.string().max(64).optional(),
});

export const requestMoneySchema = z.object({
  amount: z.union([z.string(), z.number()]).transform(String),
  note: z.string().max(140).optional(),
  ttlMinutes: z.number().int().min(5).max(43200).default(1440),
});

export const payRequestSchema = z.object({
  requestCode: z.string().min(6).max(20),
});

export const billPaySchema = z.object({
  merchantId: z.string().min(1),
  amount: z.union([z.string(), z.number()]).transform(String),
  accountRef: z.string().max(64).optional(),
  idempotencyKey: z.string().max(64).optional(),
});

export const subscriptionSchema = z.object({
  merchantId: z.string().min(1),
  planName: z.string().min(1).max(64),
  amount: z.union([z.string(), z.number()]).transform(String),
  intervalDays: z.number().int().min(1).max(365).default(30),
  agentAddress: address.optional(),
});

export const webhookSchema = z.object({
  url: z.string().url(),
  events: z.array(z.string()).min(1),
});
