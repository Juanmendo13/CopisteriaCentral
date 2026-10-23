/**
 * Proves shop notify for Gmail:
 * - FormSubmit path returns success:true when inbox is activated (see proof-shop-notify.mjs)
 * - For Gmail before activation: Resend fallback succeeds (not 403 to Gmail)
 */
import { Resend } from 'resend';

const gmail = 'bellamorenoeugenio820@gmail.com';
const origin = 'https://copisteria-central.vercel.app';
const apiKey = process.env.RESEND_API_KEY;
const from = process.env.RESEND_FROM || 'Copisteria Central <onboarding@resend.dev>';
const fallback = process.env.PEDIDOS_FALLBACK_EMAIL || 'pizzeriaformula1@outlook.es';

if (!apiKey) {
  console.error('Set RESEND_API_KEY in the environment to run this proof.');
  process.exit(1);
}

const fs = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(gmail)}`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Origin: origin,
    Referer: `${origin}/`,
  },
  body: JSON.stringify({
    name: 'Proof',
    email: 'cliente@example.com',
    _subject: 'PROOF Gmail FormSubmit',
    message: 'Activation check',
  }),
}).then((r) => r.json());

console.log('formsubmit_gmail', fs);

if (String(fs.success) === 'true') {
  console.log('OK: FormSubmit → Gmail success (fully live).');
  process.exit(0);
}

const resendDirect = await fetch('https://api.resend.com/emails', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    from,
    to: [gmail],
    subject: 'PROOF should 403',
    text: 'Should fail testing mode',
  }),
}).then(async (r) => ({ status: r.status, body: await r.json().catch(() => ({})) }));

console.log('resend_direct_gmail', resendDirect);

const resend = new Resend(apiKey);
const backup = await resend.emails.send({
  from,
  to: [fallback],
  subject: `[Activar Gmail FormSubmit] PROOF fallback ${new Date().toISOString()}`,
  text: `Destino deseado: ${gmail}\nRespaldo OK mientras FormSubmit pide Activate Form en Gmail.`,
});

console.log('resend_fallback_outlook', backup);

if (resendDirect.status === 403 && !backup.error) {
  console.log(
    '\nOK: Resend→Gmail still 403 (expected). FormSubmit registered for Gmail; fallback Resend→Outlook works until Activate Form is clicked in Gmail.',
  );
  process.exit(0);
}

console.error('\nUnexpected proof state');
process.exit(1);
