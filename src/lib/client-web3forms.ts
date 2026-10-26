export type Web3FormsClientPayload = {
  accessKey: string;
  subject: string;
  message: string;
  replyTo: string;
  name?: string;
  fromName?: string;
};

export type Web3FormsClientResult = { ok: true } | { ok: false; error: string };

/** Browser submit to Web3Forms (avoids Cloudflare blocks on some server IPs). */
export async function sendWeb3Forms(
  payload: Web3FormsClientPayload,
): Promise<Web3FormsClientResult> {
  if (!payload.accessKey) {
    return { ok: false, error: 'missing-key' };
  }

  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: payload.accessKey,
        subject: payload.subject,
        from_name: payload.fromName || 'juanmendo',
        name: payload.name || 'Lead negocios',
        email: payload.replyTo,
        replyto: payload.replyTo,
        message: payload.message,
      }),
    });

    const data = (await res.json().catch(() => ({}))) as {
      success?: boolean | string;
      message?: string;
    };

    if (res.ok && (data.success === true || String(data.success) === 'true')) {
      return { ok: true };
    }

    return {
      ok: false,
      error: (data.message || `HTTP ${res.status}`).trim(),
    };
  } catch {
    return { ok: false, error: 'network' };
  }
}
