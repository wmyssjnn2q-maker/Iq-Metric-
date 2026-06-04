import { isResendConfigured } from '../lib/resendServer';
import { sendJson } from '../lib/apiHttp';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return sendJson(res, 405, { error: 'Method not allowed' });
  }
  return sendJson(res, 200, {
    ok: true,
    emailConfigured: isResendConfigured(),
  });
}
