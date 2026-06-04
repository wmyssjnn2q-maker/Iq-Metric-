import { handleScoreIqPost } from '../lib/iqApiHandlers';
import { readJsonBody, sendJson } from '../lib/apiHttp';
import type { IqAnswerResponse } from '../lib/iqScoring';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return sendJson(res, 405, { error: 'Method not allowed' });
  }
  try {
    const body = await readJsonBody<{ ageBracketId?: string | null; responses?: IqAnswerResponse[] }>(req);
    return sendJson(res, 200, handleScoreIqPost(body));
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Błąd serwera';
    const status = message.includes('Brak') || message.includes('Nieprawid') || message.includes('Nieznane') ? 400 : 500;
    return sendJson(res, status, { error: message });
  }
}
