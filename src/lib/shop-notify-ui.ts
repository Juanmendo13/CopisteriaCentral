/** Mensajes de resultado en el navegador tras avisar a la tienda. */

export type ShopNotifyMeta = {
  primaryReady?: boolean;
  backupOk?: boolean;
  via?: string;
  backupTo?: string;
  intendedTo?: string;
};

export type ShopNotifyKind = 'pedido' | 'presupuesto' | 'venta';

const OK: Record<ShopNotifyKind, string> = {
  pedido: 'Pedido enviado correctamente. La tienda ya tiene el aviso con el enlace al archivo.',
  presupuesto: 'Presupuesto enviado correctamente a la tienda. Te responderemos por email o teléfono.',
  venta: 'Solicitud enviada correctamente a la tienda. Te confirmaremos stock y precio.',
};

/**
 * Interpreta Web3Forms (cliente) + metadatos del API.
 * Si Web3Forms responde OK → éxito limpio (canal primario a la tienda).
 */
export function shopNotifyClientStatus(
  primarySubmitOk: boolean,
  meta: ShopNotifyMeta,
  kind: ShopNotifyKind,
): { ok: boolean; partial: boolean; text: string } {
  const backupOk = meta.backupOk === true || meta.via === 'resend-fallback';

  if (primarySubmitOk) {
    return { ok: true, partial: false, text: OK[kind] };
  }

  if (backupOk) {
    return {
      ok: false,
      partial: true,
      text:
        'El aviso principal no se completó. Si no te llaman pronto, escribe o llama al local.',
    };
  }

  return {
    ok: false,
    partial: false,
    text: 'No se pudo avisar a la tienda. Prueba otra vez o llama al local.',
  };
}
