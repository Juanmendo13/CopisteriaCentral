# Copistería Central

Web de **Copistería Central** — Av. Reina Mercedes 41, Local B, Sevilla (junto a ETSII).

Sitio en producción: [https://copisteria-central.vercel.app](https://copisteria-central.vercel.app)

## Qué es

Página pública del local: servicios de fotocopias e impresión, catálogo de papelería con carrito, envío de archivos PDF para imprimir, y contacto (teléfono / WhatsApp / mapa).

## Stack

- [Astro](https://astro.build) 7
- [Tailwind CSS](https://tailwindcss.com) 4
- Despliegue en [Vercel](https://vercel.com) (`@astrojs/vercel`)
- [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) — subida de PDF en `/pedido` y catálogo JSON del admin
- [Web3Forms](https://web3forms.com) — avisos de pedido/presupuesto al Gmail de la tienda
- Resend — copia de seguridad opcional si Web3Forms no está configurado

## Funcionalidades

| Ruta | Qué hace |
|------|----------|
| `/` | Home con marca, servicios y presupuestos rápidos |
| `/servicios` | Catálogo de servicios |
| `/pedido` | Subida de PDF + opciones de impresión → aviso a la tienda |
| `/venta` | Papelería: catálogo en vivo (Blob) con fallback estático, búsqueda, carrito |
| `/admin` | Gestión de productos y stock (login + cookie HttpOnly) |
| `/precios` | Precios orientativos |
| `/contacto` | Teléfono, WhatsApp, horario y mapa |
| `/imagenes` | Galería del local |

Flujo de avisos: el servidor envía con **Resend** al buzón Outlook de la tienda (`PEDIDOS_EMAIL`). WhatsApp (`wa.me`) queda como alternativa si el archivo es grande o hay duda.

## Desarrollo local

Requisitos: Node.js ≥ 22.12 y [pnpm](https://pnpm.io).

```bash
pnpm install
copy .env.example .env.local   # Windows
# cp .env.example .env.local   # macOS / Linux
pnpm astro dev
```

Variables (ver `.env.example`; **no** commits de `.env` / secretos):

| Variable | Uso |
|----------|-----|
| `PEDIDOS_EMAIL` | Buzón Outlook de pedidos (`pizzeriaformula1@outlook.es`) |
| `SITE_URL` | URL pública (prod: `https://copisteria-central.vercel.app`) |
| `WEB3FORMS_ACCESS_KEY` | Opcional — solo si la key está ligada a Outlook |
| `BLOB_READ_WRITE_TOKEN` | Token de Vercel Blob (PDFs + JSON del catálogo `/admin`) |
| `ADMIN_USER` | Usuario del panel `/admin` (por defecto `admin`) |
| `ADMIN_PASSWORD` | Contraseña del panel (obligatoria; sin ella el admin permanece cerrado) |
| `ADMIN_SESSION_SECRET` | Opcional — secreto HMAC de la cookie (también acepta `ADMIN_SECRET`) |
| `RESEND_API_KEY` / `RESEND_FROM` | Primario — Resend → Outlook (modo prueba: onboarding@resend.dev) |

### Admin del catálogo (`/admin`)

1. En Vercel → Project → **Settings → Environment Variables**, crea:
   - `ADMIN_PASSWORD` (Production + Preview) — contraseña fuerte
   - Opcional: `ADMIN_USER` (default `admin`)
   - Opcional: `ADMIN_SESSION_SECRET` — cadena larga aleatoria para firmar la cookie
2. Redeploy.
3. Entra en `https://copisteria-central.vercel.app/admin` (redirige a `/admin/login` si no hay sesión).
4. Tras entrar:
   - **Importar catálogo base** (una vez) para copiar el listado estático a Blob (`catalog/venta.json`)
   - Añadir / editar / desactivar productos (nombre, descripción, categoría, precio, unidad, stock o «consultar», imagen URL o subida)
5. `/venta` lee el catálogo vivo; si Blob está vacío o falla, usa el catálogo de `src/data/venta.ts`.

Cookie de sesión: `cc_admin_session` (**HttpOnly**, `SameSite=Lax`, `Secure` en Vercel). Middleware cierra `/admin/*` y `/api/admin/*` sin sesión válida (excepto login/logout).

```bash
pnpm build
pnpm preview
```

## Despliegue

Proyecto Vercel **copisteria-central**. Las variables de entorno se configuran en el dashboard de Vercel (Production / Preview); el build es el estándar de Astro.

```bash
pnpm build
# o: vercel --prod
```

## Local

| | |
|--|--|
| Dirección | Av. Reina Mercedes 41, Local B, 41012 Sevilla |
| Teléfono / WhatsApp | +34 954 62 53 84 |
| L–J | 9:00 – 20:30 |
| Viernes | 9:00 – 14:00 / 16:30 – 20:30 |
| Sábados | 9:30 – 13:30 |
| Domingos | Cerrado |
| Maps | [Google Maps](https://www.google.com/maps/place/Copister%C3%ADa+Central/@37.3587595,-5.9861024,17z) |

Repo: [Juanmendo13/CopisteriaCentral](https://github.com/Juanmendo13/CopisteriaCentral)
