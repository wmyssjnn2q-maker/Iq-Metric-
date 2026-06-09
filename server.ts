import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import express from 'express';
import { Resend } from 'resend';
import { handleIqQuestionsGet, handleScoreIqPost, handleVerifyIqResultPost } from './lib/iqApiHandlers';
import {
  ensureResendEnv,
  getResendApiKey,
  getResendFromEmail,
  getResendFromName,
  isResendConfigured,
} from './lib/resendServer';
import { isScoreSecretConfigured } from './lib/scoreSecret';

ensureResendEnv();

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const resendApiKey = getResendApiKey();
const resendFromEmail = getResendFromEmail();
const resendFromName = getResendFromName();

if (!resendApiKey) {
  console.warn('[Resend] Missing RESEND_API_KEY. Email requests will return 500 until it is configured.');
}

const resend = resendApiKey ? new Resend(resendApiKey) : null;

/** Resend (bez zweryfikowanej domeny) pozwala wysyłać tylko na e-mail konta w panelu. */
function formatResendError(message: string): string {
  const onlyTest = message.match(
    /only send testing emails to your own email address \(([^)]+)\)/i
  );
  if (onlyTest) {
    const allowed = onlyTest[1];
    return `W trybie testowym Resend możesz wysłać mail tylko na: ${allowed}. Użyj tego adresu w formularzu albo zweryfikuj domenę na resend.com/domains (potem ustaw RESEND_FROM_EMAIL).`;
  }
  return message;
}

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    emailConfigured: isResendConfigured(),
    scoreSigningConfigured: isScoreSecretConfigured(),
  });
});

app.get('/api/iq-questions', (_req, res) => {
  try {
    res.json(handleIqQuestionsGet());
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Błąd serwera';
    res.status(500).json({ error: message });
  }
});

app.post('/api/score-iq', (req, res) => {
  try {
    res.json(handleScoreIqPost(req.body));
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Błąd serwera';
    const status =
      message.includes('Brak') || message.includes('Nieprawid') || message.includes('Nieznane') ? 400 : 500;
    res.status(status).json({ error: message });
  }
});

app.post('/api/verify-iq-result', (req, res) => {
  try {
    res.json(handleVerifyIqResultPost(req.body));
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Błąd serwera';
    res.status(400).json({ error: message, valid: false });
  }
});

app.post('/api/send-email', async (req, res) => {
  const { to, subject, html, attachment } = req.body;

  if (!to || !subject || !html) {
    return res.status(400).json({ error: 'Brak wymaganych pól: to, subject, html' });
  }

  if (!resendApiKey) {
    return res.status(500).json({ error: 'Brak konfiguracji RESEND_API_KEY na serwerze.' });
  }

  try {
    const payload: Parameters<NonNullable<typeof resend>['emails']['send']>[0] = {
      from: `${resendFromName} <${resendFromEmail}>`,
      to: [to],
      subject,
      html,
    };

    if (attachment?.content && attachment?.filename) {
      const raw = attachment.content;
      payload.attachments = [
        {
          filename: attachment.filename,
          content: Buffer.isBuffer(raw)
            ? raw
            : Buffer.from(String(raw), 'base64'),
        },
      ];
    }

    const { data, error } = await resend.emails.send(payload);

    if (error) {
      console.error('Resend error:', error);
      const msg = formatResendError(error.message || 'Błąd Resend');
      return res.status(403).json({ error: msg, code: 'resend_restricted' });
    }

    console.log(`[Resend] Email sent to ${to} | ID: ${data?.id}`);
    return res.json({ success: true, id: data?.id });
  } catch (err) {
    console.error('Unexpected error:', err);
    return res.status(500).json({ error: 'Błąd serwera' });
  }
});

const PORT = process.env.API_PORT || 3002;
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});

export default app;
