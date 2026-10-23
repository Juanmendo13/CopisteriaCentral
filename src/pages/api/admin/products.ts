export const prerender = false;

import type { APIRoute } from 'astro';
import { ventaCategorias } from '../../../data/venta';
import { isAdminConfigured, isAuthenticated } from '../../../lib/admin-auth';
import {
  loadAdminCatalog,
  upsertProduct,
  validateProductInput,
  writeCatalogToBlob,
} from '../../../lib/venta-catalog';

async function requireAuth(request: Request): Promise<Response | null> {
  if (!isAdminConfigured()) {
    return Response.json({ error: 'Admin no configurado.' }, { status: 503 });
  }
  if (!(await isAuthenticated(request))) {
    return Response.json({ error: 'No autorizado.' }, { status: 401 });
  }
  return null;
}

export const GET: APIRoute = async ({ request }) => {
  const denied = await requireAuth(request);
  if (denied) return denied;

  try {
    const { catalog, source, seeded } = await loadAdminCatalog();
    const cats = new Set<string>([...ventaCategorias]);
    for (const p of catalog.products) cats.add(p.categoria);
    return Response.json({
      ok: true,
      source,
      seeded,
      updatedAt: catalog.updatedAt,
      products: catalog.products,
      categorias: [...cats],
    });
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : 'No se pudo leer el catálogo.' },
      { status: 500 },
    );
  }
};

export const POST: APIRoute = async ({ request }) => {
  const denied = await requireAuth(request);
  if (denied) return denied;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Petición inválida.' }, { status: 400 });
  }

  const validated = validateProductInput(body);
  if (!validated.ok) return Response.json({ error: validated.error }, { status: 400 });

  try {
    const { catalog } = await loadAdminCatalog();
    const result = upsertProduct(catalog, validated.data, 'create');
    if ('error' in result) return Response.json({ error: result.error }, { status: 400 });
    await writeCatalogToBlob(result.catalog);
    return Response.json({ ok: true, product: result.product, updatedAt: result.catalog.updatedAt });
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : 'No se pudo guardar.' },
      { status: 500 },
    );
  }
};
