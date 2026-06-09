import { Resend } from 'resend';

function formatResendError(message: string): string {
  const onlyTest = message.match(
    /only send testing emails to your own email address \(([^)]+)\)/i,
  );
  if (onlyTest) {
    return `W trybie testowym Resend możesz wysłać mail tylko na: ${onlyTest[1]}. Użyj tego adresu w formularzu albo zweryfikuj domenę na resend.com/domains.`;
  }
  return message;
}

type EmailPayload = {
  to?: string;
  subject?: string;
  html?: string;
  attachment?: { filename?: string; content?: string };
};

async function readBody(req: { body?: unknown }): Promise<EmailPayload> {
  if (req.body) {
    return typeof req.body === 'string' ? JSON.parse(req.body) : (req.body as EmailPayload);
  }
  return {};
}

export default async function handler(
  req: { method?: string; body?: unknown },
  res: {
    status: (code: number) => { json: (body: unknown) => void };
  },
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const resendApiKey = process.env.RESEND_API_KEY?.trim() || process.env.RESEND_KEY?.trim();
  if (!resendApiKey) {
    return res.status(500).json({
      error:
        'Brak konfiguracji RESEND_API_KEY na serwerze. Dodaj klucz w Vercel → Settings → Environment Variables (Production) i zrób redeploy.',
      code: 'resend_not_configured',
    });
  }

  try {
    const { to, subject, html, attachment } = await readBody(req);
    if (!to || !subject || !html) {
      return res.status(400).json({ error: 'Brak wymaganych pól: to, subject, html' });
    }

    const fromName = process.env.RESEND_FROM_NAME?.trim() || 'brainmediq';
    const fromEmail = process.env.RESEND_FROM_EMAIL?.trim() || 'onboarding@resend.dev';

    const resend = new Resend(resendApiKey);
    const payload: Parameters<typeof resend.emails.send>[0] = {
      from: `${fromName} <${fromEmail}>`,
      to: [to],
      subject,
      html,
    };

    if (attachment?.content && attachment?.filename) {
      payload.attachments = [
        {
          filename: attachment.filename,
          content: Buffer.from(String(attachment.content), 'base64'),
        },
      ];
    }

    const { data, error } = await resend.emails.send(payload);
    if (error) {
      return res.status(403).json({
        error: formatResendError(error.message || 'Błąd Resend'),
        code: 'resend_restricted',
      });
    }

    return res.status(200).json({ success: true, id: data?.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Błąd serwera';
    return res.status(500).json({ error: message });
  }
}
