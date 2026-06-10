import type { IncomingMessage } from 'node:http';

/** Odczyt surowego body (wymagane do weryfikacji podpisu Stripe webhook). */
export async function readRawBody(req: IncomingMessage & { body?: unknown }): Promise<Buffer> {
  if (Buffer.isBuffer(req.body)) return req.body;
  if (typeof req.body === 'string') return Buffer.from(req.body);

  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}
