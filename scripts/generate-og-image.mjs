import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const publicDir = path.resolve(process.cwd(), 'public');
const outPath = path.join(publicDir, 'og-image.png');

// Imagen OG genérica (no depende de la ruta), pensada para previews:
// estilo blanco + amarillo, con llamada a "Enviar archivo".
const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#2563eb"/>
      <stop offset="55%" stop-color="#1d4ed8"/>
      <stop offset="100%" stop-color="#1e3a8a"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="20" stdDeviation="25" flood-color="#1d4ed8" flood-opacity="0.35" />
    </filter>
  </defs>

  <rect width="1200" height="630" fill="#ffffff"/>

  <!-- Card -->
  <g filter="url(#shadow)">
    <rect x="60" y="60" width="1080" height="510" rx="48" fill="url(#bg)"/>
  </g>

  <!-- Accent -->
  <circle cx="160" cy="180" r="56" fill="#ffffff" opacity="0.18"/>
  <text x="160" y="205" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="36" font-weight="800" fill="#ffffff">CC</text>

  <!-- Title -->
  <text x="240" y="220" font-family="Inter, Arial, sans-serif" font-size="48" font-weight="800" fill="#ffffff">
    Copistería Central
  </text>

  <!-- Subtitle -->
  <text x="240" y="305" font-family="Inter, Arial, sans-serif" font-size="40" font-weight="700" fill="#ffffff">
    Venta · Papelería
  </text>

  <!-- Helper -->
  <text x="240" y="370" font-family="Inter, Arial, sans-serif" font-size="26" font-weight="600" fill="#ffffff" opacity="0.9">
    Bolígrafos, libretas, carpetas y más
  </text>

  <!-- Small footer -->
  <rect x="240" y="425" width="280" height="38" rx="19" fill="#ffffff" opacity="0.2"/>
  <text x="380" y="451" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="20" font-weight="800" fill="#ffffff" opacity="0.95">
    Sevilla · Reina Mercedes
  </text>
</svg>
`.trim();

if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

// sharp renderiza SVG => PNG
const buffer = Buffer.from(svg);
await sharp(buffer).png().toFile(outPath);

console.log(`Generated: ${outPath}`);

