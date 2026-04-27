import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import express from 'express';
import { Resend } from 'resend';

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const resend = new Resend(process.env.RESEND_API_KEY);

app.post('/api/send-email', async (req, res) => {
  const { to, subject, html, attachment } = req.body;

  if (!to || !subject || !html) {
    return res.status(400).json({ error: 'Brak wymaganych pól: to, subject, html' });
  }

  try {
    const payload: Parameters<typeof resend.emails.send>[0] = {
      from: 'brainmediq <noreply@brainmediq.pl>',
      to: [to],
      subject,
      html,
    };

    if (attachment?.content && attachment?.filename) {
      payload.attachments = [
        {
          filename: attachment.filename,
          content: attachment.content,
        },
      ];
    }

    const { data, error } = await resend.emails.send(payload);

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({ error: error.message });
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
