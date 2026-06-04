import { handleIqQuestionsGet } from '../lib/iqApiHandlers';
import { sendJson } from '../lib/apiHttp';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return sendJson(res, 405, { error: 'Method not allowed' });
  }
  try {
    return sendJson(res, 200, handleIqQuestionsGet());
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Błąd serwera';
    return sendJson(res, 500, { error: message });
  }
}
