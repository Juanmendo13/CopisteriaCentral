export type PdfPageCountResult =
  | { ok: true; pages: number }
  | {
      ok: false;
      reason: 'password' | 'invalid' | 'not-pdf' | 'empty' | 'error';
      message: string;
    };

let pdfJsReady: Promise<typeof import('pdfjs-dist')> | null = null;

/** Lazy-load pdf.js + worker only when a PDF is selected (keeps initial bundle small). */
async function loadPdfJs() {
  if (!pdfJsReady) {
    pdfJsReady = (async () => {
      const pdfjs = await import('pdfjs-dist');
      const workerMod = await import('pdfjs-dist/build/pdf.worker.min.mjs?url');
      pdfjs.GlobalWorkerOptions.workerSrc = workerMod.default;
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

  try {
    const pdfjs = await loadPdfJs();
    const data = new Uint8Array(await file.arrayBuffer());
    const loadingTask = pdfjs.getDocument({ data, useSystemFonts: true });
    const pdf = await loadingTask.promise;
    const pages = pdf.numPages;
    await pdf.destroy();

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
  }
}

export function isImageFile(file: File): boolean {
  if (file.type === 'image/jpeg' || file.type === 'image/png') return true;
  const name = file.name.toLowerCase();
  return name.endsWith('.jpg') || name.endsWith('.jpeg') || name.endsWith('.png');
}
