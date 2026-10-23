/** Mensajes de resultado en el navegador tras avisar a la tienda. */

export type ShopNotifyMeta = {
  primaryReady?: boolean;
  backupOk?: boolean;
  primaryOk?: boolean;
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
 * Interpreta el resultado del API (Resend primario → Outlook) + Web3Forms opcional.
 * Si el servidor ya entregó vía Resend → éxito limpio.
 */
export function shopNotifyClientStatus(
  secondarySubmitOk: boolean,
  meta: ShopNotifyMeta,
  kind: ShopNotifyKind,
): { ok: boolean; partial: boolean; text: string } {
  const serverOk =
    meta.primaryOk === true ||
    meta.via === 'resend' ||
    meta.backupOk === true ||
    meta.via === 'resend-fallback';

  if (serverOk) {
    return { ok: true, partial: false, text: OK[kind] };
  }

  if (secondarySubmitOk) {
    return { ok: true, partial: false, text: OK[kind] };
  }

  return {
    ok: false,
    partial: false,
    text: 'No se pudo avisar a la tienda. Prueba otra vez o llama al local.',
  };
}
