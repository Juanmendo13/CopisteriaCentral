export const prerender = false;

import type { APIRoute } from 'astro';
import { isAdminConfigured, isAuthenticated } from '../../../lib/admin-auth';
import { seedCatalogFromStatic } from '../../../lib/venta-catalog';

export const POST: APIRoute = async ({ request }) => {
  if (!isAdminConfigured()) {
    return Response.json({ error: 'Admin no configurado.' }, { status: 503 });
  }
  if (!(await isAuthenticated(request))) {
    return Response.json({ error: 'No autorizado.' }, { status: 401 });
  }

  try {
    const catalog = await seedCatalogFromStatic();
    return Response.json({
      ok: true,
      count: catalog.products.length,
      updatedAt: catalog.updatedAt,
    });
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : 'No se pudo sembrar el catálogo.' },
      { status: 500 },
    );
  }
};
