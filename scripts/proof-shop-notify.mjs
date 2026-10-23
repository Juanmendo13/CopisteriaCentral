/**
 * Proof: FormSubmit shop notify returns success:true (not Resend 403).
 * Usage:
 *   node scripts/proof-shop-notify.mjs                         # Gmail (needs prior Activate Form)
 *   node scripts/proof-shop-notify.mjs you@activated.example   # already-activated inbox
 */
const to = process.argv[2] || 'bellamorenoeugenio820@gmail.com';
const origin = process.env.SITE_URL || 'https://copisteria-central.vercel.app';

const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(to)}`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Origin: origin,
    Referer: `${origin}/`,
  },
  body: JSON.stringify({
    name: 'Copistería Central Proof',
    email: 'prueba-cliente@example.com',
    _replyto: 'prueba-cliente@example.com',
    _subject: `PROOF shop-notify · ${new Date().toISOString()}`,
    message: [
      'Prueba de entrega FormSubmit (sustituye Resend onboarding@resend.dev).',
      `Destino: ${to}`,
      `Origin: ${origin}`,
    ].join('\n'),
  }),
});

const body = await res.json().catch(() => ({}));
console.log(JSON.stringify({ httpStatus: res.status, to, body }, null, 2));

if (String(body.success) === 'true') {
  console.log('\nOK: send succeeded (not 403).');
  process.exit(0);
}

if (/activat/i.test(String(body.message || ''))) {
  console.error(
    '\nPENDING: FormSubmit needs one-time Activate Form click in this inbox, then re-run.',
  );
  process.exit(2);
}

console.error('\nFAIL: unexpected FormSubmit response.');
process.exit(1);
