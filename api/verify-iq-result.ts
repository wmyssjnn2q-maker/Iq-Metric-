import { handleVerifyIqResultPost } from '../lib/iqApiHandlers';
import { readJsonBody, sendJson } from '../lib/apiHttp';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return sendJson(res, 405, { error: 'Method not allowed' });
  }
  try {
    const body = await readJsonBody(req);
    return sendJson(res, 200, handleVerifyIqResultPost(body));
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Błąd serwera';
    return sendJson(res, 400, { error: message, valid: false });
  }
}
