/**
 * Genera imágenes orientativas precisas (SVG → JPG) para cada producto.
 * Evita fotos de stock irrelevantes: muestra nombre + categoría con estilo de tienda.
 *
 * Uso: node scripts/generate-venta-images-svg.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

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

const CATEGORY_ICON = {
  'Escritura y corrección': '✏️',
  'Papelería, cuadernos y bloques': '📒',
  'Archivo y organización': '📁',
  'Corte, adhesión y sujeción': '✂️',
  'Herramientas de oficina y medición': '📐',
  'Embalaje, envíos y almacenamiento digital': '📦',
};

function escapeXml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function wrapLines(text, max = 26) {
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

async function generateCard(item, dest) {
  const icon = CATEGORY_ICON[item.categoria] ?? '🛒';
  const lines = wrapLines(item.nombre);
  const cat = escapeXml(item.categoria);
  const svgLines = lines
    .map((l, i) => `<tspan x="48" dy="${i === 0 ? 0 : 34}">${escapeXml(l)}</tspan>`)
    .join('');

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480" viewBox="0 0 640 480">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#eff6ff"/>
      <stop offset="100%" stop-color="#dbeafe"/>
    </linearGradient>
    <linearGradient id="badge" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#2563eb"/>
      <stop offset="100%" stop-color="#1d4ed8"/>
    </linearGradient>
  </defs>
  <rect width="640" height="480" fill="url(#bg)"/>
  <rect x="32" y="32" width="576" height="416" rx="28" fill="#ffffff" stroke="#bfdbfe" stroke-width="2"/>
  <circle cx="320" cy="148" r="62" fill="#2563eb" opacity="0.1"/>
  <text x="320" y="168" text-anchor="middle" font-size="56">${icon}</text>
  <text x="48" y="268" font-family="Segoe UI, Arial, sans-serif" font-size="28" font-weight="700" fill="#0f172a">${svgLines}</text>
  <rect x="48" y="300" width="220" height="28" rx="14" fill="url(#badge)"/>
  <text x="60" y="319" font-family="Segoe UI, Arial, sans-serif" font-size="12" font-weight="700" fill="#ffffff">${cat.toUpperCase()}</text>
  <text x="48" y="390" font-family="Segoe UI, Arial, sans-serif" font-size="14" fill="#64748b">Imagen orientativa · Copistería Central</text>
</svg>`.trim();

  await sharp(Buffer.from(svg)).jpeg({ quality: 86 }).toFile(dest);
}

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const venta = loadVentaItems();
const manifest = {};

for (const item of venta) {
  const dest = path.join(outDir, `${item.id}.jpg`);
  await generateCard(item, dest);
  manifest[item.id] = {
    file: `/venta/${item.id}.jpg`,
    source: 'generated',
    title: item.nombre,
    creator: 'Copistería Central',
    license: 'generated-orientative',
    provider: 'svg-product-card',
  };
  process.stdout.write(`✓ ${item.id}\n`);
}

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log(`\nGeneradas ${venta.length} imágenes orientativas.`);
