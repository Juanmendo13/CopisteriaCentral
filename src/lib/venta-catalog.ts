/**
 * Catálogo de venta en vivo (Vercel Blob JSON) con fallback al catálogo estático.
 * Pathname fijo: catalog/venta.json
 */

import { get, put } from '@vercel/blob';
import {
  venta as staticVenta,
  ventaCategorias as staticCategorias,
  type VentaItem,
  type VentaModo,
} from '../data/venta';
import { getVentaImage } from '../data/venta-images';

export const CATALOG_BLOB_PATH = 'catalog/venta.json';
export const PLACEHOLDER_IMAGE = '/venta/_placeholder.svg';

export type CatalogProduct = VentaItem & {
  /**
   * Unidades en stock.
   * - number: mostrar stock (0 = sin stock)
   * - null: «Sin stock / consultar» (gestionado en admin)
   * - undefined: no mostrar badge (catálogo base / sin gestionar)
   */
  stock?: number | null;
  /** false = oculto en /venta (desactivado). */
  activo: boolean;
  updatedAt?: string;
};

export type VentaCatalogFile = {
  version: 1;
  updatedAt: string;
  products: CatalogProduct[];
};

export type CatalogSource = 'blob' | 'static';

function hasBlobToken(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

function nowIso(): string {
  return new Date().toISOString();
}

export function slugifyId(nombre: string): string {
  const base = nombre
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
  const suffix = Date.now().toString(36).slice(-4);
  return `v-${base || 'producto'}-${suffix}`;
}

/** Stock aleatorio sensato para semilla / productos nuevos (3–40 uds). */
export function randomStock(min = 3, max = 40): number {
  const lo = Math.min(min, max);
  const hi = Math.max(min, max);
  return lo + Math.floor(Math.random() * (hi - lo + 1));
}

export function staticToCatalogProducts(opts?: { withRandomStock?: boolean }): CatalogProduct[] {
  const withRandomStock = opts?.withRandomStock !== false;
  return staticVenta.map((item) => ({
    ...item,
    image: item.image ?? getVentaImage(item.id),
    stock: withRandomStock ? randomStock() : item.stock,
    activo: true,
  }));
}

function normalizeProduct(raw: unknown): CatalogProduct | null {
  if (!raw || typeof raw !== 'object') return null;
  const p = raw as Record<string, unknown>;
  const id = typeof p.id === 'string' ? p.id.trim() : '';
  const nombre = typeof p.nombre === 'string' ? p.nombre.trim() : '';
  if (!id || !nombre) return null;

  const modo: VentaModo = p.modo === 'consultar' ? 'consultar' : 'fijo';
  let precio: number | null = null;
  if (typeof p.precio === 'number' && Number.isFinite(p.precio)) precio = p.precio;
  else if (p.precio === null) precio = null;

  let stock: number | null | undefined = undefined;
  if (typeof p.stock === 'number' && Number.isFinite(p.stock)) {
    stock = Math.max(0, Math.floor(p.stock));
  } else if (p.stock === null) {
    stock = null;
  }

  const image =
    typeof p.image === 'string' && p.image.trim()
      ? p.image.trim()
      : getVentaImage(id) || PLACEHOLDER_IMAGE;

  return {
    id,
    nombre,
    descripcion: typeof p.descripcion === 'string' ? p.descripcion.trim() : '',
    categoria: typeof p.categoria === 'string' && p.categoria.trim() ? p.categoria.trim() : 'Otros',
    precio: modo === 'consultar' ? null : precio,
    unidad: typeof p.unidad === 'string' && p.unidad.trim() ? p.unidad.trim() : 'ud',
    modo,
    image,
    stock,
    activo: p.activo !== false,
    updatedAt: typeof p.updatedAt === 'string' ? p.updatedAt : undefined,
  };
}

function parseCatalogJson(text: string): VentaCatalogFile | null {
  try {
    const data = JSON.parse(text) as unknown;
    if (!data || typeof data !== 'object') return null;
    const obj = data as Record<string, unknown>;
    const productsRaw = Array.isArray(obj.products) ? obj.products : [];
    const products = productsRaw.map(normalizeProduct).filter((p): p is CatalogProduct => Boolean(p));
    return {
      version: 1,
      updatedAt: typeof obj.updatedAt === 'string' ? obj.updatedAt : nowIso(),
      products,
    };
  } catch {
    return null;
  }
}

export async function readCatalogFromBlob(): Promise<VentaCatalogFile | null> {
  if (!hasBlobToken()) return null;
  try {
    // Store del proyecto es público (mismo que PDFs de pedido).
    const result = await get(CATALOG_BLOB_PATH, { access: 'public', useCache: false });
    if (!result || result.statusCode !== 200 || !result.stream) return null;
    const text = await new Response(result.stream).text();
    return parseCatalogJson(text);
  } catch {
    return null;
  }
}

export async function writeCatalogToBlob(catalog: VentaCatalogFile): Promise<void> {
  if (!hasBlobToken()) {
    throw new Error('Falta BLOB_READ_WRITE_TOKEN para guardar el catálogo.');
  }
  const body: VentaCatalogFile = {
    version: 1,
    updatedAt: nowIso(),
    products: catalog.products,
  };
  await put(CATALOG_BLOB_PATH, JSON.stringify(body, null, 2), {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json',
    cacheControlMaxAge: 60,
  });
}

/** Catálogo admin (incluye desactivados). Si Blob vacío → semilla estática en memoria (no escribe hasta guardar). */
export async function loadAdminCatalog(): Promise<{
  catalog: VentaCatalogFile;
  source: CatalogSource;
  seeded: boolean;
}> {
  const fromBlob = await readCatalogFromBlob();
  if (fromBlob && fromBlob.products.length > 0) {
    return { catalog: fromBlob, source: 'blob', seeded: false };
  }
  const products = staticToCatalogProducts({ withRandomStock: true });
  return {
    catalog: { version: 1, updatedAt: nowIso(), products },
    source: fromBlob ? 'blob' : 'static',
    seeded: true,
  };
}

/** Escribe la semilla estática en Blob con stock aleatorio (idempotente: sobrescribe). */
export async function seedCatalogFromStatic(): Promise<VentaCatalogFile> {
  const catalog: VentaCatalogFile = {
    version: 1,
    updatedAt: nowIso(),
    products: staticToCatalogProducts({ withRandomStock: true }),
  };
  await writeCatalogToBlob(catalog);
  return catalog;
}

/**
 * Rellena stock aleatorio en productos que aún no tienen número (undefined).
 * No toca stock ya numérico ni null («consultar» del admin).
 */
export function backfillMissingRandomStock(catalog: VentaCatalogFile): {
  catalog: VentaCatalogFile;
  changed: boolean;
} {
  let changed = false;
  const products = catalog.products.map((p) => {
    if (typeof p.stock === 'number' || p.stock === null) return p;
    changed = true;
    return { ...p, stock: randomStock(), updatedAt: nowIso() };
  });
  if (!changed) return { catalog, changed: false };
  return {
    catalog: { version: 1, updatedAt: nowIso(), products },
    changed: true,
  };
}

/**
 * Si el Blob no tiene catálogo, lo siembra desde el estático con stock aleatorio.
 * Si hay catálogo pero faltan stocks numéricos, rellena y persiste.
 */
export async function ensureCatalogSeeded(): Promise<VentaCatalogFile> {
  const fromBlob = await readCatalogFromBlob();
  if (!fromBlob || fromBlob.products.length === 0) {
    return seedCatalogFromStatic();
  }
  const { catalog, changed } = backfillMissingRandomStock(fromBlob);
  if (changed) {
    await writeCatalogToBlob(catalog);
  }
  return catalog;
}

export type StockLine = { id: string; cantidad: number };

export type DecrementStockResult =
  | { ok: true; catalog: VentaCatalogFile; touched: string[] }
  | { ok: false; error: string; status: 400 | 409 | 503 };

/**
 * Decrementa stock en Blob para líneas de venta.
 * Reintento leve ante carreras (lectura → validación → escritura).
 * Solo afecta productos con stock numérico; null («consultar») no se vende online.
 */
export async function decrementStockForOrder(
  lines: StockLine[],
  opts?: { retries?: number },
): Promise<DecrementStockResult> {
  if (!hasBlobToken()) {
    return {
      ok: false,
      error: 'El catálogo en vivo no está disponible. Prueba más tarde o llama a la tienda.',
      status: 503,
    };
  }

  const retries = Math.max(1, opts?.retries ?? 3);
  const needed = new Map<string, number>();
  for (const line of lines) {
    const qty = Math.floor(line.cantidad);
    if (!line.id || !Number.isInteger(qty) || qty < 1) {
      return { ok: false, error: 'Cantidad inválida en el pedido.', status: 400 };
    }
    needed.set(line.id, (needed.get(line.id) ?? 0) + qty);
  }

  if (needed.size === 0) {
    const catalog = await ensureCatalogSeeded();
    return { ok: true, catalog, touched: [] };
  }

  let lastError = 'No se pudo actualizar el stock. Inténtalo de nuevo.';

  for (let attempt = 0; attempt < retries; attempt++) {
    const catalog = await ensureCatalogSeeded();
    const byId = new Map(catalog.products.map((p) => [p.id, p]));
    const touched: string[] = [];
    const nextProducts = catalog.products.map((p) => ({ ...p }));

    for (const [id, qty] of needed) {
      const idx = nextProducts.findIndex((p) => p.id === id);
      const product = idx >= 0 ? nextProducts[idx] : undefined;
      if (!product || !byId.has(id)) {
        return {
          ok: false,
          error: `Producto no disponible en el catálogo: ${id}`,
          status: 400,
        };
      }
      if (product.activo === false) {
        return {
          ok: false,
          error: `«${product.nombre}» no está disponible ahora mismo.`,
          status: 400,
        };
      }

      if (product.stock === null || product.stock === undefined) {
        return {
          ok: false,
          error: `«${product.nombre}» está sin stock o hay que consultar disponibilidad en tienda.`,
          status: 400,
        };
      }

      if (product.stock < qty) {
        const disponible = product.stock;
        return {
          ok: false,
          error:
            disponible <= 0
              ? `«${product.nombre}» está sin stock.`
              : `Stock insuficiente de «${product.nombre}»: solo quedan ${disponible} uds (pediste ${qty}).`,
          status: 409,
        };
      }

      nextProducts[idx] = {
        ...product,
        stock: product.stock - qty,
        updatedAt: nowIso(),
      };
      touched.push(id);
    }

    const nextCatalog: VentaCatalogFile = {
      version: 1,
      updatedAt: nowIso(),
      products: nextProducts,
    };

    try {
      await writeCatalogToBlob(nextCatalog);
      return { ok: true, catalog: nextCatalog, touched };
    } catch (e) {
      lastError = e instanceof Error ? e.message : lastError;
    }
  }

  return { ok: false, error: lastError, status: 503 };
}

export function withResolvedImages(products: CatalogProduct[]): CatalogProduct[] {
  return products.map((p) => ({
    ...p,
    image: p.image?.trim() || getVentaImage(p.id) || PLACEHOLDER_IMAGE,
  }));
}

/** Público: solo activos. Si Blob vacío y hay token, siembra con stock aleatorio. */
export async function loadPublicCatalog(): Promise<{
  products: CatalogProduct[];
  categorias: string[];
  source: CatalogSource;
  total: number;
}> {
  let fromBlob: VentaCatalogFile | null = null;
  if (hasBlobToken()) {
    try {
      fromBlob = await ensureCatalogSeeded();
    } catch {
      fromBlob = await readCatalogFromBlob();
    }
  } else {
    fromBlob = await readCatalogFromBlob();
  }

  if (fromBlob && fromBlob.products.length > 0) {
    const active = withResolvedImages(fromBlob.products.filter((p) => p.activo !== false));
    const categorias = uniqueCategorias(active);
    return {
      products: active,
      categorias,
      source: 'blob',
      total: active.length,
    };
  }

  const products = withResolvedImages(staticToCatalogProducts({ withRandomStock: true }));
  return {
    products,
    categorias: [...staticCategorias],
    source: 'static',
    total: products.length,
  };
}

function uniqueCategorias(products: CatalogProduct[]): string[] {
  const order = [...staticCategorias] as string[];
  const seen = new Set<string>();
  const result: string[] = [];
  for (const cat of order) {
    if (products.some((p) => p.categoria === cat)) {
      result.push(cat);
      seen.add(cat);
    }
  }
  for (const p of products) {
    if (!seen.has(p.categoria)) {
      result.push(p.categoria);
      seen.add(p.categoria);
    }
  }
  return result;
}

export function groupByCategoria(
  products: CatalogProduct[],
  categorias: string[],
): { categoria: string; items: CatalogProduct[] }[] {
  return categorias
    .map((categoria) => ({
      categoria,
      items: products.filter((p) => p.categoria === categoria),
    }))
    .filter((g) => g.items.length > 0);
}

export type ProductInput = {
  id?: string;
  nombre: string;
  descripcion?: string;
  categoria: string;
  precio?: number | null;
  unidad?: string;
  modo?: VentaModo;
  stock?: number | null;
  activo?: boolean;
  image?: string;
};

export function validateProductInput(body: unknown): { ok: true; data: ProductInput } | { ok: false; error: string } {
  if (!body || typeof body !== 'object') return { ok: false, error: 'Datos inválidos.' };
  const b = body as Record<string, unknown>;
  const nombre = typeof b.nombre === 'string' ? b.nombre.trim() : '';
  if (nombre.length < 2) return { ok: false, error: 'El nombre es obligatorio (mín. 2 caracteres).' };
  if (nombre.length > 120) return { ok: false, error: 'Nombre demasiado largo.' };

  const categoria = typeof b.categoria === 'string' ? b.categoria.trim() : '';
  if (!categoria) return { ok: false, error: 'La categoría es obligatoria.' };

  const modo: VentaModo = b.modo === 'consultar' ? 'consultar' : 'fijo';
  let precio: number | null = null;
  if (modo === 'fijo') {
    if (b.precio === null || b.precio === '' || b.precio === undefined) {
      return { ok: false, error: 'Indica un precio o marca «Consultar».' };
    }
    const n = typeof b.precio === 'number' ? b.precio : Number(b.precio);
    if (!Number.isFinite(n) || n < 0) return { ok: false, error: 'Precio no válido.' };
    precio = Math.round(n * 100) / 100;
  }

  let stock: number | null = null;
  if (b.stock === null || b.stock === '' || b.stock === 'consultar' || b.stock === undefined) {
    stock = null;
  } else {
    const n = typeof b.stock === 'number' ? b.stock : Number(b.stock);
    if (!Number.isFinite(n) || n < 0) return { ok: false, error: 'Stock no válido.' };
    stock = Math.floor(n);
  }

  const image = typeof b.image === 'string' ? b.image.trim().slice(0, 500) : '';
  if (image && !isAllowedProductImageUrl(image)) {
    return { ok: false, error: 'La imagen debe ser una ruta relativa (/…) o una URL https://.' };
  }

  return {
    ok: true,
    data: {
      id: typeof b.id === 'string' ? b.id.trim() : undefined,
      nombre,
      descripcion: typeof b.descripcion === 'string' ? b.descripcion.trim().slice(0, 500) : '',
      categoria: categoria.slice(0, 80),
      precio,
      unidad: typeof b.unidad === 'string' && b.unidad.trim() ? b.unidad.trim().slice(0, 20) : 'ud',
      modo,
      stock,
      activo: b.activo !== false && b.activo !== 'false',
      image,
    },
  };
}

/** Relative path (/venta/…) or absolute https URL. Empty is handled by callers. */
export function isAllowedProductImageUrl(value: string): boolean {
  const v = value.trim();
  if (!v) return true;
  if (v.startsWith('/') && !v.startsWith('//')) return true;
  try {
    const u = new URL(v);
    return u.protocol === 'https:';
  } catch {
    return false;
  }
}

export function upsertProduct(
  catalog: VentaCatalogFile,
  input: ProductInput,
  mode: 'create' | 'update',
): { catalog: VentaCatalogFile; product: CatalogProduct } | { error: string } {
  const id = mode === 'create' ? slugifyId(input.nombre) : (input.id ?? '').trim();
  if (!id) return { error: 'Falta el id del producto.' };

  if (mode === 'create' && catalog.products.some((p) => p.id === id)) {
    return { error: 'Ya existe un producto con ese id.' };
  }
  if (mode === 'update' && !catalog.products.some((p) => p.id === id)) {
    return { error: 'Producto no encontrado.' };
  }

  const product: CatalogProduct = {
    id,
    nombre: input.nombre,
    descripcion: input.descripcion ?? '',
    categoria: input.categoria,
    precio: input.modo === 'consultar' ? null : (input.precio ?? null),
    unidad: input.unidad ?? 'ud',
    modo: input.modo ?? 'fijo',
    image: input.image?.trim() || getVentaImage(id) || PLACEHOLDER_IMAGE,
    stock: input.stock,
    activo: input.activo !== false,
    updatedAt: nowIso(),
  };

  const products =
    mode === 'create'
      ? [...catalog.products, product]
      : catalog.products.map((p) => (p.id === id ? product : p));

  return {
    catalog: { version: 1, updatedAt: nowIso(), products },
    product,
  };
}
