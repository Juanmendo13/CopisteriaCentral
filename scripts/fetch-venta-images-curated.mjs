/**
 * Descarga imágenes curadas desde Wikimedia Commons con fallbacks verificados.
 * Si no hay foto fiable, genera una tarjeta SVG con el nombre del producto.
 *
 * Uso: node scripts/fetch-venta-images-curated.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { CURATED_WIKIMEDIA, COMMONS_FALLBACKS, VERIFIED_BASE } from './venta-image-curated.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'public', 'venta');
const manifestPath = path.join(root, 'src', 'data', 'venta-images.json');

function loadVentaItems() {
  const text = fs.readFileSync(path.join(root, 'src', 'data', 'venta.ts'), 'utf8');
  const items = [];
  const re =
    /id:\s*'([^']+)'[\s\S]*?nombre:\s*'([^']+)'[\s\S]*?categoria:\s*'([^']+)'/g;
  let m;
  while ((m = re.exec(text))) {
    items.push({ id: m[1], nombre: m[2], categoria: m[3] });
  }
  return items;
}

const venta = loadVentaItems();

const CATEGORY_BASE = {
  'Escritura y corrección': ['Staedtler_Noris_products.jpg', 'Mechanical_pencil_macro.jpg', 'Coloured-pencils.jpg', 'Ballpen.jpg'],
  'Papelería, cuadernos y bloques': ['Sticky_Notes_in_different_colors.jpg', 'Spiral-bound_notebook.jpg', 'Copy_paper_ream.jpg'],
  'Archivo y organización': ['Ring_binder.jpg', 'Clipboard.jpg', 'Index_cards.jpg'],
  'Corte, adhesión y sujeción': ['Scissors-blue.jpg', 'Glue_stick.jpg', 'Paper_clips.jpg', 'Masking_tape.jpg'],
  'Herramientas de oficina y medición': ['Stapler.jpg', 'Ruler_30cm.jpg', 'Protractor.jpg', 'Desk_calculator.jpg'],
  'Embalaje, envíos y almacenamiento digital': ['Manila_envelope.jpg', 'Bubble_wrap.jpg', 'USB_flash_drive.jpg'],
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function commonsExists(filename) {
  const url = new URL('https://commons.wikimedia.org/w/api.php');
  url.searchParams.set('action', 'query');
  url.searchParams.set('titles', `File:${filename}`);
  url.searchParams.set('prop', 'imageinfo');
  url.searchParams.set('iiprop', 'url');
  url.searchParams.set('iiurlwidth', '640');
  url.searchParams.set('format', 'json');

  const res = await fetch(url, { headers: { 'User-Agent': 'CopisteriaCentral/1.0' } });
  if (!res.ok) return null;
  const data = await res.json();
  const pages = data.query?.pages ?? {};
  const page = Object.values(pages)[0];
  if (!page || page.missing !== undefined || page.invalid !== undefined) return null;
  const info = page.imageinfo?.[0];
  if (!info?.thumburl && !info?.url) return null;
  return {
    url: info.thumburl || info.url,
    title: page.title?.replace(/^File:/, '') ?? filename,
  };
}

async function download(url, dest) {
  const res = await fetch(url, { headers: { 'User-Agent': 'CopisteriaCentral/1.0' } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
}

function escapeXml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function wrapLines(text, max = 28) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (next.length > max && line) {
      lines.push(line);
      line = w;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, 3);
}

async function generateSvgCard(item, dest) {
  const lines = wrapLines(item.nombre);
  const cat = escapeXml(item.categoria);
  const svgLines = lines
    .map((l, i) => `<tspan x="32" dy="${i === 0 ? 0 : 28}">${escapeXml(l)}</tspan>`)
    .join('');

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480" viewBox="0 0 640 480">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#eff6ff"/>
      <stop offset="100%" stop-color="#dbeafe"/>
    </linearGradient>
  </defs>
  <rect width="640" height="480" fill="url(#bg)"/>
  <rect x="24" y="24" width="592" height="432" rx="24" fill="#ffffff" stroke="#bfdbfe" stroke-width="2"/>
  <circle cx="320" cy="150" r="56" fill="#2563eb" opacity="0.12"/>
  <text x="320" y="158" text-anchor="middle" font-family="Arial, sans-serif" font-size="42">🛒</text>
  <text x="32" y="250" font-family="Arial, sans-serif" font-size="24" font-weight="700" fill="#0f172a">${svgLines}</text>
  <text x="32" y="330" font-family="Arial, sans-serif" font-size="14" font-weight="600" fill="#2563eb">${cat.toUpperCase()}</text>
  <text x="32" y="410" font-family="Arial, sans-serif" font-size="13" fill="#64748b">Imagen orientativa · Copistería Central</text>
</svg>`.trim();

  await sharp(Buffer.from(svg)).jpeg({ quality: 82 }).toFile(dest);
}

async function resolveFile(candidates) {
  for (const file of candidates) {
    const hit = await commonsExists(file);
    if (hit) return { ...hit, file, source: 'wikimedia' };
    await sleep(120);
  }
  return null;
}

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const manifest = {};
let wiki = 0;
let svg = 0;

for (const item of venta) {
  const dest = path.join(outDir, `${item.id}.jpg`);
  const primary = CURATED_WIKIMEDIA[item.id];
  const fallback = primary ? COMMONS_FALLBACKS[primary] : undefined;
  const categoryPool = CATEGORY_BASE[item.categoria] ?? Object.values(VERIFIED_BASE);
  const candidates = [primary, fallback, ...categoryPool, ...Object.values(VERIFIED_BASE)].filter(Boolean);
  const unique = [...new Set(candidates)];

  let saved = false;
  const hit = await resolveFile(unique);
  if (hit) {
    try {
      await download(hit.url, dest);
      manifest[item.id] = {
        file: `/venta/${item.id}.jpg`,
        source: hit.url,
        title: hit.title,
        creator: 'Wikimedia Commons',
        license: 'cc-by-sa / public domain',
        provider: 'wikimedia-curated',
      };
      wiki++;
      saved = true;
      process.stdout.write(`✓ ${item.id} ← ${hit.file}\n`);
    } catch {
      // fall through to svg
    }
  }

  if (!saved) {
    await generateSvgCard(item, dest);
    manifest[item.id] = {
      file: `/venta/${item.id}.jpg`,
      source: 'generated',
      title: item.nombre,
      creator: 'Copistería Central',
      license: 'generated',
      provider: 'svg-fallback',
    };
    svg++;
    process.stdout.write(`◆ ${item.id} (SVG generado)\n`);
  }
}

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log(`\nListo: ${wiki} de Wikimedia, ${svg} SVG. Total ${venta.length}.`);
