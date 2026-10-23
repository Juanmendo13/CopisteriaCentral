import type { PDFDocumentLoadingTask } from 'pdfjs-dist';

export type PdfPageCountResult =
  | { ok: true; pages: number }
  | {
      ok: false;
      reason: 'password' | 'invalid' | 'not-pdf' | 'empty' | 'error';
      message: string;
    };

let pdfJsReady: Promise<typeof import('pdfjs-dist')> | null = null;

/**
 * Lazy-load pdf.js + worker only when a PDF is selected (keeps initial bundle small).
 *
 * Worker URL uses Vite's `?url` so the .mjs asset is emitted next to other client
 * chunks (same origin) — avoids CDN/CORS and version skew.
 */
async function loadPdfJs() {
  if (!pdfJsReady) {
    pdfJsReady = (async () => {
      const pdfjs = await import('pdfjs-dist');
      const workerUrl = (await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default;
      pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
      return pdfjs;
    })();
  }
  return pdfJsReady;
}

function isPdfFile(file: File): boolean {
  if (file.type === 'application/pdf') return true;
  return file.name.toLowerCase().endsWith('.pdf');
}

/**
 * Count PDF pages in the browser via pdf.js. Does not upload or render pages.
 *
 * Note: pdfjs-dist v5+ removed `PDFDocumentProxy.destroy()`. Teardown is
 * `loadingTask.destroy()` (which also cleans the proxy). Calling `pdf.destroy()`
 * throws after a successful count and was showing the manual-fallback error in prod.
 */
export async function countPdfPages(file: File): Promise<PdfPageCountResult> {
  if (!file) {
    return { ok: false, reason: 'empty', message: 'No hay archivo.' };
  }
  if (!isPdfFile(file)) {
    return {
      ok: false,
      reason: 'not-pdf',
      message: 'Solo se puede detectar páginas en PDF. Indícalas a mano.',
    };
  }

  let loadingTask: PDFDocumentLoadingTask | null = null;

  try {
    const pdfjs = await loadPdfJs();
    const data = new Uint8Array(await file.arrayBuffer());
    loadingTask = pdfjs.getDocument({ data, useSystemFonts: true });
    const pdf = await loadingTask.promise;
    const pages = pdf.numPages;

    if (!Number.isInteger(pages) || pages < 1) {
      return {
        ok: false,
        reason: 'invalid',
        message: 'No se pudo leer el número de páginas. Indícalas a mano.',
      };
    }

    return { ok: true, pages: Math.min(pages, 5000) };
  } catch (error) {
    const name = error && typeof error === 'object' && 'name' in error ? String((error as { name: string }).name) : '';
    const message = error instanceof Error ? error.message : '';

    if (name === 'PasswordException' || /password/i.test(message)) {
      return {
        ok: false,
        reason: 'password',
        message: 'Este PDF está protegido con contraseña. Indica las páginas a mano.',
      };
    }
    if (name === 'InvalidPDFException' || /invalid\s*pdf/i.test(message)) {
      return {
        ok: false,
        reason: 'invalid',
        message: 'El archivo no parece un PDF válido. Indica las páginas a mano.',
      };
    }

    return {
      ok: false,
      reason: 'error',
      message: 'No se pudieron detectar las páginas. Indícalas a mano.',
    };
  } finally {
    try {
      await loadingTask?.destroy();
    } catch {
      /* ignore teardown errors — page count already decided */
    }
  }
}

export function isImageFile(file: File): boolean {
  if (file.type === 'image/jpeg' || file.type === 'image/png') return true;
  const name = file.name.toLowerCase();
  return name.endsWith('.jpg') || name.endsWith('.jpeg') || name.endsWith('.png');
}
