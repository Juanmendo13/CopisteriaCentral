/** Mensajes de resultado en el navegador (no afirmar Gmail si solo hubo copia Outlook). */

export type ShopNotifyMeta = {
  primaryReady?: boolean;
  backupOk?: boolean;
  via?: string;
  backupTo?: string;
  intendedTo?: string;
};

export type ShopNotifyKind = 'pedido' | 'presupuesto' | 'venta';

const OK: Record<ShopNotifyKind, string> = {
  pedido: 'Pedido enviado. La tienda recibe el aviso con el enlace al archivo.',
  presupuesto: 'Presupuesto enviado a la tienda. Te responderemos por email o teléfono.',
  venta: 'Solicitud enviada a la tienda. Te confirmaremos stock y precio.',
};

/**
 * Interpreta Web3Forms (cliente) + metadatos del API.
 * Solo `ok: true` cuando el canal primario (Gmail/Web3Forms listo) confirma entrega.
 */
export function shopNotifyClientStatus(
  primarySubmitOk: boolean,
  meta: ShopNotifyMeta,
  kind: ShopNotifyKind,
): { ok: boolean; partial: boolean; text: string } {
  const primaryReady = meta.primaryReady === true;
  const backupOk = meta.backupOk === true || meta.via === 'resend-fallback';
  const backupLabel = meta.backupTo || 'Outlook (copia de seguridad)';

  if (primarySubmitOk && primaryReady) {
    return { ok: true, partial: false, text: OK[kind] };
  }

  if (primarySubmitOk && !primaryReady) {
    return {
      ok: false,
      partial: true,
      text:
        'Aviso enviado, pero la clave Web3Forms aún no apunta al Gmail de la tienda ' +
        `(${meta.intendedTo || 'Gmail configurado'}). ` +
        (backupOk
          ? `Hay copia de seguridad en ${backupLabel}.`
          : 'No hubo copia de seguridad.'),
    };
  }

  if (backupOk) {
    return {
      ok: false,
      partial: true,
      text:
        `Solo copia de seguridad (${backupLabel}). ` +
        'El aviso principal a Gmail no se completó. Si no te llaman, escribe o llama al local.',
    };
  }

  return {
    ok: false,
    partial: false,
    text: 'No se pudo avisar a la tienda. Prueba otra vez o llama al local.',
  };
}
