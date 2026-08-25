export const prerender = false;

import type { APIRoute } from 'astro';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { ALLOWED_MIME, MAX_FILE_BYTES } from '../../data/formatos';

export const POST: APIRoute = async ({ request }) => {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return Response.json(
      { error: 'Falta BLOB_READ_WRITE_TOKEN. Crea un Blob Store en Vercel.' },
      { status: 503 },
    );
  }

  let body: HandleUploadBody;
  try {
    body = (await request.json()) as HandleUploadBody;
  } catch {
    return Response.json({ error: 'Petición inválida.' }, { status: 400 });
  }

  try {
    const json = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!pathname.startsWith('pedidos/')) {
          throw new Error('Ruta de archivo no permitida.');
        }

        return {
          allowedContentTypes: [...ALLOWED_MIME],
          maximumSizeInBytes: MAX_FILE_BYTES,
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => {},
    });

    return Response.json(json);
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'No se pudo preparar la subida.' },
      { status: 400 },
    );
  }
};
