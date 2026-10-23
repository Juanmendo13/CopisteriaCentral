export type FormSubmitPayload = {
  to: string;
  subject: string;
  message: string;
  replyTo: string;
  name?: string;
};

export type FormSubmitClientResult =
  | { ok: true }
  | { ok: false; needsActivation: boolean; error: string };

/** Browser-only: FormSubmit requires a real page Origin (Node fetch cannot set it). */
export async function sendShopFormSubmit(
  payload: FormSubmitPayload,
): Promise<FormSubmitClientResult> {
  try {
    const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(payload.to)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        name: payload.name || 'Cliente web',
        email: payload.replyTo,
        _replyto: payload.replyTo,
        _subject: payload.subject,
        message: payload.message,
        _template: 'table',
        _captcha: 'false',
      }),
    });
    const data = (await res.json().catch(() => ({}))) as {
      success?: boolean | string;
      message?: string;
    };

    if (String(data.success) === 'true') {
      return { ok: true };
    }

    const msg = (data.message || 'No se pudo avisar a la tienda.').trim();
    const needsActivation = /activat/i.test(msg);
    return {
      ok: false,
      needsActivation,
      error: needsActivation
        ? `Activa FormSubmit una vez en ${payload.to}: abre Gmail, busca “Activate Form” / “Action Required” y pulsa el enlace (revisa Spam). Luego reenvía.`
        : msg,
    };
  } catch {
    return { ok: false, needsActivation: false, error: 'No se pudo contactar con FormSubmit.' };
  }
}
