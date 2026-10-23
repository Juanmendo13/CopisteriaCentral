export const prerender = false;

import type { APIRoute } from 'astro';
import { put } from '@vercel/blob';
import { isAdminConfigured, isAuthenticated } from '../../../lib/admin-auth';

const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const MAX_BYTES = 4 * 1024 * 1024;

export const POST: APIRoute = async ({ request }) => {
  if (!isAdminConfigured()) {
    return Response.json({ error: 'Admin no configurado.' }, { status: 503 });
  }
  if (!(await isAuthenticated(request))) {
    return Response.json({ error: 'No autorizado.' }, { status: 401 });
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return Response.json({ error: 'Falta BLOB_READ_WRITE_TOKEN.' }, { status: 503 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return Response.json({ error: 'Formulario inválido.' }, { status: 400 });
  }

  const file = form.get('file');
  if (!(file instanceof File)) {
    return Response.json({ error: 'Falta el archivo (file).' }, { status: 400 });
  }
  if (!ALLOWED.has(file.type)) {
    return Response.json({ error: 'Solo JPG, PNG, WebP o GIF.' }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return Response.json({ error: 'Imagen demasiado grande (máx. 4 MB).' }, { status: 400 });
  }

  const ext =
    file.type === 'image/png'
      ? 'png'
      : file.type === 'image/webp'
        ? 'webp'
        : file.type === 'image/gif'
          ? 'gif'
          : 'jpg';

  const pathname = `admin-venta/${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  try {
    const blob = await put(pathname, file, {
      access: 'public',
      addRandomSuffix: false,
      contentType: file.type,
      cacheControlMaxAge: 60 * 60 * 24 * 30,
    });
    return Response.json({ ok: true, url: blob.url, pathname: blob.pathname });
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : 'No se pudo subir la imagen.' },
      { status: 500 },
    );
  }
};
