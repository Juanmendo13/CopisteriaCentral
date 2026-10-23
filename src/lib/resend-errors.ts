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
      'Resend en modo prueba (FROM onboarding@resend.dev) no entrega a Gmail arbitrario.',
      'Verifica un dominio en https://resend.com/domains y pon RESEND_FROM en ese dominio',
      'para que PEDIDOS_EMAIL=bellamorenoeugenio820@gmail.com funcione.',
      `Detalle: ${raw}`,
    ].join(' ');
  }

  return raw;
}
