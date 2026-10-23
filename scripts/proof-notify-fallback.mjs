/**
 * Proof: Resend → Outlook (shop inbox) succeeds in test mode.
 */
import { Resend } from 'resend';

const outlook = process.env.PEDIDOS_EMAIL || 'pizzeriaformula1@outlook.es';
const apiKey = process.env.RESEND_API_KEY;
const from = process.env.RESEND_FROM || 'Copisteria Central <onboarding@resend.dev>';

if (!apiKey) {
  console.error('Set RESEND_API_KEY in the environment to run this proof.');
  process.exit(1);
}

const resend = new Resend(apiKey);
const stamp = new Date().toISOString();
const result = await resend.emails.send({
  from,
  to: [outlook],
  subject: `PROOF resend-outlook · ${stamp}`,
  text: `Resend primary → ${outlook}\n${stamp}`,
});

console.log('resend_outlook', result);
if (result.error) {
  console.error('FAIL');
  process.exit(1);
}
console.log('\nOK: Resend → Outlook shop inbox works.');
