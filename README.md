<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/ae4d776b-e8ec-4e5d-a01d-51fe79387af9

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the required keys in `.env.local`:
   `GEMINI_API_KEY=...`
   `RESEND_API_KEY=...`
   Optional: `RESEND_FROM_EMAIL=noreply@your-verified-domain.com`
3. Run the app:
   `npm run dev`

`npm run dev` starts both the Vite frontend and the local email API used by `/api/send-email`.

For deployment, configure the same environment variables in your hosting provider.
