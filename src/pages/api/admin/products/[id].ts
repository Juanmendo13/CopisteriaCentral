export const prerender = false;

import type { APIRoute } from 'astro';
import { isAdminConfigured, isAuthenticated } from '../../../../lib/admin-auth';
import {
  loadAdminCatalog,
  upsertProduct,
  validateProductInput,
  writeCatalogToBlob,
  type CatalogProduct,
} from '../../../../lib/venta-catalog';

async function requireAuth(request: Request): Promise<Response | null> {
  if (!isAdminConfigured()) {
    return Response.json({ error: 'Admin no configurado.' }, { status: 503 });
  }
  if (!(await isAuthenticated(request))) {
    return Response.json({ error: 'No autorizado.' }, { status: 401 });
  }
  return null;
}

export const PUT: APIRoute = async ({ request, params }) => {
  const denied = await requireAuth(request);
  if (denied) return denied;

  const id = params.id?.trim();
  if (!id) return Response.json({ error: 'Falta id.' }, { status: 400 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Petición inválida.' }, { status: 400 });
  }

  const validated = validateProductInput({ ...(body as object), id });
  if (!validated.ok) return Response.json({ error: validated.error }, { status: 400 });

  try {
    const { catalog } = await loadAdminCatalog();
    const result = upsertProduct(catalog, { ...validated.data, id }, 'update');
    if ('error' in result) return Response.json({ error: result.error }, { status: 404 });
    await writeCatalogToBlob(result.catalog);
    return Response.json({ ok: true, product: result.product, updatedAt: result.catalog.updatedAt });
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : 'No se pudo guardar.' },
      { status: 500 },
    );
  }
};

/** Soft-delete: marca activo=false (o hard remove si ?hard=1). */
export const DELETE: APIRoute = async ({ request, params, url }) => {
  const denied = await requireAuth(request);
  if (denied) return denied;

  const id = params.id?.trim();
  if (!id) return Response.json({ error: 'Falta id.' }, { status: 400 });

  const hard = url.searchParams.get('hard') === '1';

  try {
    const { catalog } = await loadAdminCatalog();
    const idx = catalog.products.findIndex((p) => p.id === id);
    if (idx < 0) return Response.json({ error: 'Producto no encontrado.' }, { status: 404 });

    let products: CatalogProduct[];
    if (hard) {
      products = catalog.products.filter((p) => p.id !== id);
    } else {
      products = catalog.products.map((p) =>
        p.id === id ? { ...p, activo: false, updatedAt: new Date().toISOString() } : p,
      );
    }

    const next = { ...catalog, products, updatedAt: new Date().toISOString() };
    await writeCatalogToBlob(next);
    return Response.json({ ok: true, hard, updatedAt: next.updatedAt });
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : 'No se pudo eliminar.' },
      { status: 500 },
    );
  }
};
