import { Resend } from 'resend';

function formatResendError(message: string): string {
  const onlyTest = message.match(
    /only send testing emails to your own email address \(([^)]+)\)/i
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

const readBody = async (req: any): Promise<EmailPayload> => {
  if (req.body) {
    return typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  }

  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    return res.json?.({ error: 'Method not allowed' }) ?? res.end(JSON.stringify({ error: 'Method not allowed' }));
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    res.statusCode = 500;
    return res.json?.({ error: 'Brak konfiguracji RESEND_API_KEY na serwerze.' }) ?? res.end(JSON.stringify({ error: 'Brak konfiguracji RESEND_API_KEY na serwerze.' }));
  }

  const { to, subject, html, attachment } = await readBody(req);
  if (!to || !subject || !html) {
    res.statusCode = 400;
    return res.json?.({ error: 'Brak wymaganych pól: to, subject, html' }) ?? res.end(JSON.stringify({ error: 'Brak wymaganych pól: to, subject, html' }));
  }

  const resend = new Resend(resendApiKey);
  const payload: Parameters<typeof resend.emails.send>[0] = {
    from: `${process.env.RESEND_FROM_NAME || 'brainmediq'} <${process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'}>`,
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
    res.statusCode = 403;
    const msg = formatResendError(error.message || 'Błąd Resend');
    return res.json?.({ error: msg, code: 'resend_restricted' }) ?? res.end(JSON.stringify({ error: msg, code: 'resend_restricted' }));
  }

  return res.json?.({ success: true, id: data?.id }) ?? res.end(JSON.stringify({ success: true, id: data?.id }));
}
