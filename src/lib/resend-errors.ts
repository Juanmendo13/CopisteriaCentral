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
      'Para bellamorenoeugenio820@gmail.com: verifica un dominio en https://resend.com/domains,',
      'pon RESEND_FROM en ese dominio y PEDIDOS_EMAIL=bellamorenoeugenio820@gmail.com.',
      'Mientras tanto usa PEDIDOS_EMAIL=pizzeriaformula1@outlook.es.',
      `Detalle: ${raw}`,
    ].join(' ');
  }

  return raw;
}
