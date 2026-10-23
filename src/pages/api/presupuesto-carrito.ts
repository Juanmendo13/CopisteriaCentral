export const prerender = false;

import type { APIRoute } from 'astro';
import {
  enviarPresupuestoCarrito,
  isVentaCartLineId,
  parsePresupuestoBody,
} from '../../lib/presupuesto-email';
import {
  decrementStockForOrder,
  ensureCatalogSeeded,
  type CatalogProduct,
} from '../../lib/venta-catalog';

export const POST: APIRoute = async ({ request }) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Presupuesto inválido.' }, { status: 400 });
  }

  const origenHint =
    body && typeof body === 'object' && (body as Record<string, unknown>).origen === 'venta'
      ? 'venta'
      : undefined;

  let liveVentaById: Map<string, CatalogProduct> | undefined;
  if (origenHint === 'venta') {
    try {
      const catalog = await ensureCatalogSeeded();
      liveVentaById = new Map(catalog.products.map((p) => [p.id, p]));
    } catch {
      liveVentaById = undefined;
    }
  }

  const parsed = parsePresupuestoBody(body, liveVentaById);
  if ('error' in parsed) {
    return Response.json({ error: parsed.error }, { status: 400 });
  }

  const ventaLines = parsed.lineas.filter((l) => isVentaCartLineId(l.id, liveVentaById));
  const esReservaVenta = parsed.origen === 'venta' || ventaLines.length > 0;

  if (esReservaVenta && ventaLines.length > 0) {
    const stockResult = await decrementStockForOrder(ventaLines);
    if (!stockResult.ok) {
      return Response.json({ error: stockResult.error }, { status: stockResult.status });
    }
    liveVentaById = new Map(stockResult.catalog.products.map((p) => [p.id, p]));
  }

  const payload = {
    ...parsed,
    origen: esReservaVenta ? ('venta' as const) : parsed.origen,
  };

  const result = await enviarPresupuestoCarrito(payload, liveVentaById);
  if ('error' in result) {
    return Response.json({ error: result.error }, { status: 502 });
  }

  return Response.json({
    ok: true,
    clienteDemo: result.clienteDemo,
    via: result.via,
    to: result.to,
    intendedTo: result.intendedTo,
    backupTo: result.backupTo,
    primaryReady: result.primaryReady,
    backupOk: result.backupOk,
    web3forms: result.web3forms,
    stockUpdated: esReservaVenta && ventaLines.length > 0,
    mensaje: esReservaVenta
      ? 'Reserva preparada. Enviando aviso a la tienda…'
      : 'Presupuesto preparado. Enviando aviso a la tienda…',
  });
};
