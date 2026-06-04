import { Resend } from 'resend';
import {
  ensureResendEnv,
  getResendApiKey,
  getResendFromEmail,
  getResendFromName,
} from '../lib/resendServer';
import { sendJson, readJsonBody } from '../lib/apiHttp';

function formatResendError(message: string): string {
  const onlyTest = message.match(
    /only send testing emails to your own email address \(([^)]+)\)/i,
  );
  if (onlyTest) {
    const allowed = onlyTest[1];
    return `W trybie testowym Resend możesz wysłać mail tylko na: ${allowed}. Użyj tego adresu w formularzu albo zweryfikuj domenę na resend.com/domains.`;
  }
  return message;
}

type EmailPayload = {
  to?: string;
  subject?: string;
  html?: string;
  attachment?: {
    filename?: string;
    content?: string;
  };
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  ensureResendEnv();
  const resendApiKey = getResendApiKey();
  if (!resendApiKey) {
    return sendJson(res, 500, {
      error:
        'Brak konfiguracji RESEND_API_KEY na serwerze. Dodaj klucz w Vercel → Settings → Environment Variables (Production) lub w pliku .env.local przy npm run dev.',
      code: 'resend_not_configured',
    });
  }

  try {
    const { to, subject, html, attachment } = await readJsonBody<EmailPayload>(req);
    if (!to || !subject || !html) {
      return sendJson(res, 400, { error: 'Brak wymaganych pól: to, subject, html' });
    }

    const resend = new Resend(resendApiKey);
    const payload: Parameters<typeof resend.emails.send>[0] = {
      from: `${getResendFromName()} <${getResendFromEmail()}>`,
      to: [to],
      subject,
      html,
    };

    if (attachment?.content && attachment?.filename) {
      const raw = attachment.content;
      payload.attachments = [
        {
          filename: attachment.filename,
          content: Buffer.isBuffer(raw) ? raw : Buffer.from(String(raw), 'base64'),
        },
      ];
    }

    const { data, error } = await resend.emails.send(payload);
    if (error) {
      const msg = formatResendError(error.message || 'Błąd Resend');
      return sendJson(res, 403, { error: msg, code: 'resend_restricted' });
    }

    return sendJson(res, 200, { success: true, id: data?.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Błąd serwera';
    return sendJson(res, 500, { error: message });
  }
}
