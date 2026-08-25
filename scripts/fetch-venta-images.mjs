/**
 * Descarga imágenes CC0 / CC-BY de Openverse para cada producto de venta.
 * Uso: node scripts/fetch-venta-images.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'public', 'venta');
const manifestPath = path.join(root, 'src', 'data', 'venta-images.json');

const ventaModule = await import(pathToFileURL(path.join(root, 'src', 'data', 'venta.ts')).href);
const { venta } = ventaModule;

/** Términos de búsqueda más precisos que el nombre completo. */
const SEARCH = {
  'v-boli-gel': 'gel pen stationery',
  'v-boli-bic': 'ballpoint pen blue',
  'v-boli-roller': 'rollerball pen',
  'v-boli-borrable': 'friction erasable pen',
  'v-recambio-borrable': 'pen refill cartridge',
  'v-mina-05': 'mechanical pencil lead',
  'v-mina-07': 'pencil lead 0.7',
  'v-portaminas': 'mechanical pencil',
  'v-lapiz-hb': 'wooden pencil HB',
  'v-lapiz-2b': 'drawing pencil 2B',
  'v-lapiz-bicolor': 'red blue pencil',
  'v-caja-colores': 'colored pencils box',
  'v-fluo-clasico': 'highlighter marker yellow',
  'v-fluo-pastel': 'pastel highlighter',
  'v-rotulador-fino': 'fine liner pen',
  'v-permanente-conica': 'permanent marker',
  'v-permanente-bisel': 'chisel tip marker',
  'v-pizarra': 'whiteboard marker',
  'v-rotulador-cd': 'cd marker pen',
  'v-cinta-correctora': 'correction tape',
  'v-corrector-liquido': 'liquid paper corrector',
  'v-boli-corrector': 'correction pen',
  'v-goma-lapiz': 'eraser pencil',
  'v-goma-tinta': 'ink eraser',
  'v-sacapuntas-simple': 'pencil sharpener',
  'v-sacapuntas-deposito': 'pencil sharpener container',
  'v-cuaderno-a4': 'spiral notebook A4',
  'v-cuaderno-a5': 'small spiral notebook',
  'v-libreta-dura': 'hardcover notebook',
  'v-libreta-bolsillo': 'pocket notebook',
  'v-postit-clasico': 'sticky notes yellow',
  'v-postit-neon': 'neon sticky notes',
  'v-banderitas': 'index tabs sticky',
  'v-recambio-a4': 'loose leaf paper A4',
  'v-milimetrado': 'graph paper pad',
  'v-vegetal': 'tracing paper pad',
  'v-acuarela': 'watercolor paper pad',
  'v-folios-a4': 'printer paper ream',
  'v-cartulinas-color': 'colored cardstock',
  'v-cartulinas-blancas': 'white cardstock',
  'v-pliego-cartulina': 'large cardstock sheet',
  'v-carton-pluma': 'foam board sheet',
  'v-talonario-recibos': 'receipt book',
  'v-talonario-facturas': 'invoice book',
  'v-talonario-albaranes': 'delivery note book',
  'v-archivador-definitivo': 'archive storage box',
  'v-palanca-ancho': 'lever arch file',
  'v-palanca-estrecho': 'ring binder narrow',
  'v-carpeta-4-anillas': 'ring binder A4',
  'v-carpeta-2-anillas': 'two ring binder',
  'v-carpeta-fundas': 'document folder sleeves',
  'v-acordeon': 'expanding file folder',
  'v-gomas-carton': 'folder elastic bands',
  'v-gomas-pp': 'plastic folder',
  'v-carpeta-pinza': 'clip board folder',
  'v-clipboard': 'clipboard',
  'v-fundas-std': 'sheet protectors A4',
  'v-fundas-hd': 'heavy duty sheet protector',
  'v-sobre-a4': 'document envelope A4',
  'v-sobre-a5': 'small envelope',
  'v-subcarpeta': 'divider folder tab',
  'v-separador-alf': 'alphabet dividers',
  'v-separador-colores': 'colored tab dividers',
  'v-fichero': 'index card box',
  'v-fichas': 'index cards',
  'v-tijeras-escolares': 'school scissors',
  'v-tijeras-oficina': 'office scissors',
  'v-cutter-9': 'utility knife cutter',
  'v-cutter-18': 'large utility knife',
  'v-cuchillas': 'cutter blades pack',
  'v-base-corte': 'cutting mat',
  'v-barra-pegamento': 'glue stick',
  'v-pegamento-liquido': 'liquid glue bottle',
  'v-cianocrilato': 'super glue',
  'v-blutack': 'adhesive putty blu tack',
  'v-cinta-transparente': 'clear adhesive tape',
  'v-dispensador': 'tape dispenser',
  'v-cinta-carrocero': 'masking tape roll',
  'v-doble-cara': 'double sided tape',
  'v-cinta-embalar': 'packing tape',
  'v-clips-std': 'paper clips box',
  'v-clips-mariposa': 'large paper clips',
  'v-binder': 'binder clips',
  'v-chinchetas-laton': 'brass push pins',
  'v-chinchetas-color': 'color push pins',
  'v-encuadernadores': 'binding prongs',
  'v-gomas-elasticas': 'rubber bands',
  'v-grapadora': 'office stapler',
  'v-minigrapadora': 'mini stapler',
  'v-grapas': 'staples box',
  'v-quitagrapas': 'staple remover',
  'v-taladradora': 'hole punch',
  'v-regla-plastico': 'plastic ruler 30cm',
  'v-regla-metal': 'metal ruler',
  'v-escuadra': 'set square ruler',
  'v-cartabon': 'triangle ruler drafting',
  'v-transportador': 'protractor',
  'v-compas': 'drawing compass',
  'v-escalimetro': 'architect scale ruler',
  'v-calc-basica': 'desk calculator',
  'v-calc-cientifica': 'scientific calculator',
  'v-sobre-comercial': 'white business envelope',
  'v-sobre-kraft': 'kraft envelope',
  'v-sobre-burbujas': 'bubble mailer envelope',
  'v-tubo-planos': 'cardboard tube plans',
  'v-rollo-burbujas': 'bubble wrap roll',
  'v-rollo-kraft': 'kraft paper roll',
  'v-etiquetas': 'address labels sheet',
  'v-usb-16': 'usb flash drive',
  'v-usb-32': 'usb memory stick',
  'v-usb-64': 'usb drive 64gb',
  'v-bramante': 'twine string roll',
};

const CATEGORY_FALLBACK = {
  'Escritura y corrección': 'office pen stationery',
  'Papelería, cuadernos y bloques': 'notebook paper stationery',
  'Archivo y organización': 'office folder organizer',
  'Corte, adhesión y sujeción': 'office scissors glue',
  'Herramientas de oficina y medición': 'office ruler stapler',
  'Embalaje, envíos y almacenamiento digital': 'shipping envelope packaging',
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function searchOpenverse(query) {
  const url = new URL('https://api.openverse.org/v1/images/');
  url.searchParams.set('q', query);
  url.searchParams.set('license', 'cc0,by,by-sa');
  url.searchParams.set('page_size', '5');
  url.searchParams.set('mature', 'false');

  const res = await fetch(url, {
    headers: { 'User-Agent': 'CopisteriaCentral/1.0 (demo catalog)' },
  });
  if (!res.ok) throw new Error(`Openverse ${res.status}`);
  const data = await res.json();
  return data.results ?? [];
}

async function downloadImage(imageUrl, dest) {
  const res = await fetch(imageUrl, {
    headers: { 'User-Agent': 'CopisteriaCentral/1.0 (demo catalog)' },
  });
  if (!res.ok) throw new Error(`Download ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
}

function pickResult(results, usedUrls) {
  for (const r of results) {
    const url = r.url || r.thumbnail;
    if (url && !usedUrls.has(url)) return r;
  }
  return results[0];
}

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const manifest = {};
const usedUrls = new Set();
let ok = 0;
let fail = 0;

for (const item of venta) {
  const dest = path.join(outDir, `${item.id}.jpg`);
  const queries = [
    SEARCH[item.id],
    item.nombre.split('(')[0].trim(),
    CATEGORY_FALLBACK[item.categoria],
    'stationery office supplies',
  ].filter(Boolean);

  let saved = false;
  for (const query of queries) {
    try {
      const results = await searchOpenverse(query);
      const hit = pickResult(results, usedUrls);
      if (!hit?.url) continue;
      await downloadImage(hit.url, dest);
      usedUrls.add(hit.url);
      manifest[item.id] = {
        file: `/venta/${item.id}.jpg`,
        source: hit.url,
        title: hit.title ?? item.nombre,
        creator: hit.creator ?? '',
        license: hit.license ?? '',
        provider: hit.provider ?? 'openverse',
      };
      ok++;
      saved = true;
      process.stdout.write(`✓ ${item.id}\n`);
      break;
    } catch (err) {
      // try next query
    }
    await sleep(350);
  }

  if (!saved) {
    fail++;
    process.stdout.write(`✗ ${item.id}\n`);
  }
  await sleep(400);
}

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log(`\nListo: ${ok} imágenes, ${fail} fallos. Manifest → ${manifestPath}`);
