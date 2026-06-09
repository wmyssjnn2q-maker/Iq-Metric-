import { IQ_SESSION_PUBLIC } from '../lib/iqSessionPublic.generated';

export default async function handler(
  req: { method?: string },
  res: {
    status: (code: number) => { json: (body: unknown) => void };
  },
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  return res.status(200).json(IQ_SESSION_PUBLIC);
}
