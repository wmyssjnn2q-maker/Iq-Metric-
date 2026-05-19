import { Resend } from 'resend';

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
    payload.attachments = [{ filename: attachment.filename, content: attachment.content }];
  }

  const { data, error } = await resend.emails.send(payload);
  if (error) {
    res.statusCode = 500;
    return res.json?.({ error: error.message }) ?? res.end(JSON.stringify({ error: error.message }));
  }

  return res.json?.({ success: true, id: data?.id }) ?? res.end(JSON.stringify({ success: true, id: data?.id }));
}
