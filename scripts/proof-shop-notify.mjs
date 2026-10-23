/**
 * Proof: Resend shop notify delivers to Outlook (PEDIDOS_EMAIL).
 */
import { Resend } from 'resend';

const to = process.argv[2] || process.env.PEDIDOS_EMAIL || 'pizzeriaformula1@outlook.es';
const apiKey = process.env.RESEND_API_KEY;
const from = process.env.RESEND_FROM || 'Copisteria Central <onboarding@resend.dev>';

if (!apiKey) {
  console.error('Set RESEND_API_KEY to run this proof.');
  process.exit(1);
}

const resend = new Resend(apiKey);
const stamp = new Date().toISOString();
const { data, error } = await resend.emails.send({
  from,
  to: [to],
  subject: `PROOF shop-notify · ${stamp}`,
  text: [
    'Prueba de entrega Resend → Outlook (buzón de tienda).',
    `TO: ${to}`,
    `Stamp: ${stamp}`,
  ].join('\n'),
});

if (error) {
  console.error('FAIL', error);
  process.exit(1);
}
console.log('OK', { to, id: data?.id });
