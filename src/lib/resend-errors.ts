/** Human-readable Resend API errors (testing-mode recipient limits, etc.). */
export function formatResendError(message: string | undefined, fallback: string): string {
  const raw = (message || '').trim();
  if (!raw) return fallback;

  const lower = raw.toLowerCase();
  const testingLimit =
    lower.includes('only send testing emails to your own email') ||
    lower.includes('verify a domain') ||
    (lower.includes('testing') && lower.includes('resend.dev'));

  if (testingLimit) {
    return [
      'Resend en modo prueba solo entrega a la cuenta verificada del proyecto',
      '(con FROM onboarding@resend.dev).',
      'Los avisos de tienda usan PEDIDOS_EMAIL=pizzeriaformula1@outlook.es.',
      'Para enviar a otros destinatarios (p. ej. clientes), verifica un dominio en',
      'https://resend.com/domains y pon RESEND_FROM en ese dominio.',
      `Detalle: ${raw}`,
    ].join(' ');
  }

  return raw;
}
