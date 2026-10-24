export type Locale = 'es' | 'en' | 'it';

export type Localized = Record<Locale, string>;

export type Project = {
  slug: string;
  name: string;
  client: Localized;
  pitch: Localized;
  stack: string[];
  live?: string;
  repo?: string;
  year: string;
  image: string;
  frontend: Localized[];
  backend: Localized[];
  note?: Localized;
};

/** Feature lists sourced from repos / live deploys — not invented. */
export const projects: Project[] = [
  {
    slug: 'copisteria-central',
    name: 'Copistería Central',
    client: {
      es: 'Reina Mercedes, Sevilla',
      en: 'Reina Mercedes, Seville',
      it: 'Reina Mercedes, Siviglia',
    },
    pitch: {
      es: 'Plataforma para una copistería de barrio: pedido con PDF, precio orientativo, catálogo de papelería y avisos al local.',
      en: 'Platform for a neighbourhood copy shop: PDF orders, indicative pricing, stationery catalogue and shop alerts.',
      it: 'Piattaforma per una copisteria di quartiere: ordini PDF, prezzi orientativi, catalogo cartoleria e avvisi al locale.',
    },
    stack: ['Astro 7', 'Tailwind 4', 'Vercel', 'Vercel Blob', 'Web3Forms', 'Resend'],
    live: 'https://copisteria-central.vercel.app',
    repo: 'https://github.com/Juanmendo13/CopisteriaCentral',
    year: '2026',
    image: '/portfolio/work-1.jpg',
    frontend: [
      {
        es: 'Home con marca, servicios destacados y presupuestos rápidos',
        en: 'Home with brand, featured services and quick quotes',
        it: 'Home con brand, servizi in evidenza e preventivi rapidi',
      },
      {
        es: 'Catálogo de servicios (`/servicios`) y fichas dinámicas `/servicio/[slug]`',
        en: 'Services catalogue (`/servicios`) and dynamic `/servicio/[slug]` pages',
        it: 'Catalogo servizi (`/servicios`) e schede dinamiche `/servicio/[slug]`',
      },
      {
        es: 'Pedido con subida de PDF/imagen, opciones de impresión y confirmación',
        en: 'Order flow with PDF/image upload, print options and confirmation',
        it: 'Flusso ordine con upload PDF/immagine, opzioni di stampa e conferma',
      },
      {
        es: 'Papelería `/venta`: búsqueda, cards densas en móvil, carrito sticky con subtotal en cabecera',
        en: 'Stationery `/venta`: search, dense mobile cards, sticky cart with header subtotal',
        it: 'Cartoleria `/venta`: ricerca, card dense su mobile, carrello sticky con subtotale in header',
      },
      {
        es: 'Precios orientativos con carrito de presupuesto (`/precios`)',
        en: 'Indicative prices with quote cart (`/precios`)',
        it: 'Prezzi orientativi con carrello preventivo (`/precios`)',
      },
      {
        es: 'Contacto: teléfono, WhatsApp, horario y mapa',
        en: 'Contact: phone, WhatsApp, hours and map',
        it: 'Contatti: telefono, WhatsApp, orari e mappa',
      },
      {
        es: 'Galería del local (`/imagenes`) e información / legales',
        en: 'Shop gallery (`/imagenes`) plus info / legal pages',
        it: 'Galleria del locale (`/imagenes`) e pagine info / legali',
      },
      {
        es: 'UI en español, tipografía de marca, diseño responsive',
        en: 'Spanish UI, brand typography, responsive design',
        it: 'UI in spagnolo, tipografia di brand, design responsive',
      },
    ],
    backend: [
      {
        es: '`POST /api/pedido` — valida pedido e inicia aviso a la tienda',
        en: '`POST /api/pedido` — validates order and triggers shop notify',
        it: '`POST /api/pedido` — valida ordine e avvia notifica al negozio',
      },
      {
        es: '`POST /api/presupuesto-carrito` y `/api/presupuesto-contacto`',
        en: '`POST /api/presupuesto-carrito` and `/api/presupuesto-contacto`',
        it: '`POST /api/presupuesto-carrito` e `/api/presupuesto-contacto`',
      },
      {
        es: '`POST /api/upload` — subida a Vercel Blob (token `BLOB_READ_WRITE_TOKEN`)',
        en: '`POST /api/upload` — upload to Vercel Blob (`BLOB_READ_WRITE_TOKEN`)',
        it: '`POST /api/upload` — upload su Vercel Blob (`BLOB_READ_WRITE_TOKEN`)',
      },
      {
        es: '`GET /api/notify-health` — comprobación del canal de avisos',
        en: '`GET /api/notify-health` — notify channel health check',
        it: '`GET /api/notify-health` — health check del canale di avviso',
      },
      {
        es: 'Web3Forms → Gmail de pedidos (`PEDIDOS_EMAIL` / `WEB3FORMS_ACCESS_KEY`)',
        en: 'Web3Forms → orders Gmail (`PEDIDOS_EMAIL` / `WEB3FORMS_ACCESS_KEY`)',
        it: 'Web3Forms → Gmail ordini (`PEDIDOS_EMAIL` / `WEB3FORMS_ACCESS_KEY`)',
      },
      {
        es: 'Resend opcional como respaldo (`RESEND_API_KEY` / `RESEND_FROM`)',
        en: 'Optional Resend fallback (`RESEND_API_KEY` / `RESEND_FROM`)',
        it: 'Resend opzionale di backup (`RESEND_API_KEY` / `RESEND_FROM`)',
      },
      {
        es: 'WhatsApp (`wa.me`) como alternativa si el archivo es grande',
        en: 'WhatsApp (`wa.me`) fallback for large files',
        it: 'WhatsApp (`wa.me`) come alternativa per file grandi',
      },
      {
        es: 'SSR Astro en Vercel (`@astrojs/vercel`)',
        en: 'Astro SSR on Vercel (`@astrojs/vercel`)',
        it: 'SSR Astro su Vercel (`@astrojs/vercel`)',
      },
    ],
  },
  {
    slug: 'a0-impresiones',
    name: 'A0 Impresiones',
    client: {
      es: 'Frente a ETSA, Sevilla',
      en: 'Opposite ETSA, Seville',
      it: 'Di fronte all’ETSA, Siviglia',
    },
    pitch: {
      es: 'Demo de copistería/imprenta gran formato: fichas de servicio, precios, presupuesto y pedido con PDF hasta A0.',
      en: 'Large-format print shop demo: service pages, prices, quotes and PDF orders up to A0.',
      it: 'Demo tipografia/grande formato: schede servizio, prezzi, preventivi e ordini PDF fino ad A0.',
    },
    stack: ['Astro', 'Tailwind', 'Vercel', 'Vercel Blob', 'Web3Forms'],
    live: 'https://a0-impresiones.vercel.app',
    year: '2026',
    image: '/portfolio/work-2.jpg',
    note: {
      es: 'Inventario desde el deploy público (sin repo GitHub público). Banner de demo: formularios aún no llegan al buzón real.',
      en: 'Inventory from the public deploy (no public GitHub repo). Demo banner: forms do not yet hit the real inbox.',
      it: 'Inventario dal deploy pubblico (nessun repo GitHub pubblico). Banner demo: i form non arrivano ancora alla casella reale.',
    },
    frontend: [
      {
        es: 'Hero de marca universitaria (ETSII/ETSA) con CTAs de pedido y llamada',
        en: 'Campus-branded hero (ETSII/ETSA) with order and call CTAs',
        it: 'Hero di brand universitario (ETSII/ETSA) con CTA ordine e chiamata',
      },
      {
        es: 'Catálogo de servicios: fotocopias, gran formato A0–A6/SRA3, encuadernación, laminados, papelería, diseño',
        en: 'Services catalogue: copies, A0–A6/SRA3 large format, binding, lamination, stationery, design',
        it: 'Catalogo servizi: copie, grande formato A0–A6/SRA3, rilegatura, plastificazione, cartoleria, design',
      },
      {
        es: 'Fichas `/servicio/[slug]` (diseño, encuadernaciones, escáner, CD/DVD, cartón pluma, etc.)',
        en: '`/servicio/[slug]` pages (design, binding, scanner, CD/DVD, foam board, etc.)',
        it: 'Schede `/servicio/[slug]` (design, rilegatura, scanner, CD/DVD, carton pluma, ecc.)',
      },
      {
        es: 'Pedido `/pedido` con selector de folio (A6…A0, personalizado) y deep-links `?formato=`',
        en: '`/pedido` with paper-size picker (A6…A0, custom) and `?formato=` deep-links',
        it: '`/pedido` con selettore foglio (A6…A0, personalizzato) e deep-link `?formato=`',
      },
      {
        es: 'Precios orientativos, galería, información, contacto y páginas legales',
        en: 'Indicative prices, gallery, info, contact and legal pages',
        it: 'Prezzi orientativi, galleria, info, contatti e pagine legali',
      },
      {
        es: 'Horario, Maps, WhatsApp (+34 611 610 148) y email pedidos@a0impresiones.com en UI',
        en: 'Hours, Maps, WhatsApp (+34 611 610 148) and pedidos@a0impresiones.com in UI',
        it: 'Orari, Maps, WhatsApp (+34 611 610 148) e pedidos@a0impresiones.com in UI',
      },
    ],
    backend: [
      {
        es: 'Formulario de pedido con `data-has-blob="1"` (subida Blob) y fallback WhatsApp',
        en: 'Order form with `data-has-blob="1"` (Blob upload) and WhatsApp fallback',
        it: 'Form ordine con `data-has-blob="1"` (upload Blob) e fallback WhatsApp',
      },
      {
        es: 'Acepta PDF/JPG/PNG hasta 50 MB; <20 MB llega adjunto al correo (según copy del form)',
        en: 'Accepts PDF/JPG/PNG up to 50 MB; <20 MB attached to email (per form copy)',
        it: 'Accetta PDF/JPG/PNG fino a 50 MB; <20 MB in allegato email (secondo il copy del form)',
      },
      {
        es: 'Canal de avisos tipo Web3Forms / email de demo (no productivo según banner)',
        en: 'Web3Forms-style notify / demo email channel (non-production per banner)',
        it: 'Canale avvisi tipo Web3Forms / email demo (non produttivo secondo il banner)',
      },
      {
        es: 'Despliegue Vercel proyecto `a0-impresiones`',
        en: 'Vercel deploy project `a0-impresiones`',
        it: 'Deploy Vercel progetto `a0-impresiones`',
      },
    ],
  },
  {
    slug: 'pizzeria-formula-1',
    name: 'Pizzería Fórmula 1',
    client: {
      es: 'Tocina, Sevilla · hostelería',
      en: 'Tocina, Seville · hospitality',
      it: 'Tocina, Siviglia · ristorazione',
    },
    pitch: {
      es: 'Carta digital con precios reales, fichas, carrito con login Clerk y envío de pedidos por correo al local.',
      en: 'Digital menu with real prices, product pages, Clerk-authenticated cart and email orders to the shop.',
      it: 'Menu digitale con prezzi reali, schede prodotto, carrello con login Clerk e ordini email al locale.',
    },
    stack: ['Astro', 'Tailwind 4', 'Clerk', 'Web3Forms', 'Vercel'],
    live: 'https://pizzeria-formula-1.vercel.app',
    repo: 'https://github.com/Juanmendo13/pizzeria-formula-1',
    year: '2025',
    image: '/portfolio/work-2.jpg',
    frontend: [
      {
        es: 'Home con carta: pizzas 00–10 y complementos (ensaladas, kebabs, pastas, etc.)',
        en: 'Home menu: pizzas 00–10 plus sides (salads, kebabs, pasta, etc.)',
        it: 'Home con menu: pizze 00–10 e contorni (insalate, kebab, paste, ecc.)',
      },
      {
        es: 'Ficha `/producto/[slug]` con ingredientes, tamaños P/M/F y añadir al carrito',
        en: '`/producto/[slug]` with ingredients, S/M/L sizes and add-to-cart',
        it: '`/producto/[slug]` con ingredienti, taglie P/M/F e aggiungi al carrello',
      },
      {
        es: 'Carrito: cantidades, total, recogida o reparto',
        en: 'Cart: quantities, total, pickup or delivery',
        it: 'Carrello: quantità, totale, ritiro o consegna',
      },
      {
        es: 'Auth UI Clerk: `/sign-in`, `/sign-up`, `/sign-out`, SSO callback',
        en: 'Clerk auth UI: `/sign-in`, `/sign-up`, `/sign-out`, SSO callback',
        it: 'UI auth Clerk: `/sign-in`, `/sign-up`, `/sign-out`, callback SSO',
      },
      {
        es: '`/imprimir-carta` optimizada para PDF + descarga `/categorias/carta-formula1.pdf`',
        en: '`/imprimir-carta` print-optimized + `/categorias/carta-formula1.pdf` download',
        it: '`/imprimir-carta` ottimizzata stampa + download `/categorias/carta-formula1.pdf`',
      },
      {
        es: 'Tema oscuro, tipografía Barlow, OG image, página de privacidad',
        en: 'Dark theme, Barlow type, OG image, privacy page',
        it: 'Tema scuro, tipografia Barlow, OG image, pagina privacy',
      },
    ],
    backend: [
      {
        es: '`POST /api/pedido` — valida pedido y prepara envío Web3Forms',
        en: '`POST /api/pedido` — validates order and prepares Web3Forms send',
        it: '`POST /api/pedido` — valida ordine e prepara invio Web3Forms',
      },
      {
        es: 'Clerk middleware + claves `PUBLIC_CLERK_*` / `CLERK_SECRET_KEY`',
        en: 'Clerk middleware + `PUBLIC_CLERK_*` / `CLERK_SECRET_KEY`',
        it: 'Middleware Clerk + chiavi `PUBLIC_CLERK_*` / `CLERK_SECRET_KEY`',
      },
      {
        es: 'Pedidos a `pizzeriaformula1@outlook.es` vía Web3Forms (`WEB3FORMS_ACCESS_KEY`, `PEDIDOS_EMAIL`)',
        en: 'Orders to `pizzeriaformula1@outlook.es` via Web3Forms',
        it: 'Ordini a `pizzeriaformula1@outlook.es` via Web3Forms',
      },
      {
        es: 'Datos de menú en `src/data/menu.json`; helpers de carrito/pedido en `src/lib`',
        en: 'Menu data in `src/data/menu.json`; cart/order helpers in `src/lib`',
        it: 'Dati menu in `src/data/menu.json`; helper carrello/ordine in `src/lib`',
      },
      {
        es: 'SSR Astro en Vercel',
        en: 'Astro SSR on Vercel',
        it: 'SSR Astro su Vercel',
      },
    ],
  },
  {
    slug: 'pitteri',
    name: 'Pitteri 56',
    client: {
      es: 'Lambrate, Milano',
      en: 'Lambrate, Milan',
      it: 'Lambrate, Milano',
    },
    pitch: {
      es: 'Web pública del bar + comandera PDA (mesas, cocina, cuenta) con sync Supabase opcional.',
      en: 'Public bar site + waiter PDA (tables, kitchen, bill) with optional Supabase sync.',
      it: 'Sito pubblico del bar + PDA comanderia (tavoli, cucina, conto) con sync Supabase opzionale.',
    },
    stack: ['React', 'Vite', 'Supabase', 'Vercel'],
    live: 'https://pitteri.vercel.app',
    repo: 'https://github.com/Juanmendo13/piteri',
    year: '2025',
    image: '/portfolio/work-3.jpg',
    frontend: [
      {
        es: 'Sitio público: hero, locale, carta, serate/eventos, visita (Maps/ATM/Instagram)',
        en: 'Public site: hero, venue, menu, nights/events, visit (Maps/ATM/Instagram)',
        it: 'Sito pubblico: hero, locale, carta, serate/eventi, visita (Maps/ATM/Instagram)',
      },
      {
        es: 'i18n IT/EN en la web pública (`Locale.jsx` / copy en `content.js`)',
        en: 'IT/EN i18n on the public site (`Locale.jsx` / `content.js`)',
        it: 'i18n IT/EN sul sito pubblico (`Locale.jsx` / `content.js`)',
      },
      {
        es: 'Estado abierto/cerrado según horario Milano',
        en: 'Open/closed status from Milan opening hours',
        it: 'Stato aperto/chiuso secondo orari di Milano',
      },
      {
        es: 'PDA `/sala/`: lock PIN camareros, plano de mesas por zonas, toma de pedidos',
        en: 'PDA `/sala/`: waiter PIN lock, zoned floor plan, order taking',
        it: 'PDA `/sala/`: lock PIN camerieri, pianta tavoli per zone, presa ordini',
      },
      {
        es: 'Pantallas Kitchen, Bill (cobro), Summary/Riepilogo diario, Admin',
        en: 'Kitchen, Bill (payment), daily Summary, Admin screens',
        it: 'Schermate Kitchen, Bill (pagamento), Summary giornaliero, Admin',
      },
      {
        es: 'Notas por línea, cantidades, impresión de comanda',
        en: 'Per-line notes, quantities, order printing',
        it: 'Note per riga, quantità, stampa comanda',
      },
      {
        es: 'Export CSV del riepilogo; métodos de pago en cierre de cuenta',
        en: 'CSV export of daily summary; payment methods on bill close',
        it: 'Export CSV del riepilogo; metodi di pagamento a chiusura conto',
      },
    ],
    backend: [
      {
        es: 'Supabase Realtime en `tables` y `orders` (`useBarRealtime.js`)',
        en: 'Supabase Realtime on `tables` and `orders` (`useBarRealtime.js`)',
        it: 'Supabase Realtime su `tables` e `orders` (`useBarRealtime.js`)',
      },
      {
        es: '`catalog_overrides` — precios/agotados solo en PDA (migración SQL documentada)',
        en: '`catalog_overrides` — PDA-only prices/sold-out (documented SQL migration)',
        it: '`catalog_overrides` — prezzi/esauriti solo PDA (migrazione SQL documentata)',
      },
      {
        es: 'Fallback `localStorage` si Supabase no está configurado',
        en: '`localStorage` fallback when Supabase is unset',
        it: 'Fallback `localStorage` se Supabase non è configurato',
      },
      {
        es: 'PINs camareros vía `PUBLIC_WAITERS_JSON` (no versionados)',
        en: 'Waiter PINs via `PUBLIC_WAITERS_JSON` (not in git)',
        it: 'PIN camerieri via `PUBLIC_WAITERS_JSON` (non in git)',
      },
      {
        es: 'RLS/policies en `supabase/`; día riepilogo 06:00–06:00 Europe/Rome',
        en: 'RLS/policies in `supabase/`; summary day 06:00–06:00 Europe/Rome',
        it: 'RLS/policies in `supabase/`; giorno riepilogo 06:00–06:00 Europe/Rome',
      },
    ],
  },
  {
    slug: 'ferreteria-yelamo',
    name: 'Ferretería Yélamo',
    client: {
      es: 'Los Rosales / Tocina, Sevilla',
      en: 'Los Rosales / Tocina, Seville',
      it: 'Los Rosales / Tocina, Siviglia',
    },
    pitch: {
      es: 'Catálogo, presupuestos por WhatsApp/checkout y auth por email para ferretería de comarca (Los Rosales / Tocina).',
      en: 'Catalogue, WhatsApp/checkout quotes and email auth for a regional hardware store (Los Rosales / Tocina).',
      it: 'Catalogo, preventivi WhatsApp/checkout e auth email per ferramenta di zona (Los Rosales / Tocina).',
    },
    stack: ['React 19', 'Vite', 'Express', 'Firebase', 'Nodemailer', 'Tailwind 4'],
    repo: 'https://github.com/Juanmendo13/FerreteriaYelamo',
    year: '2025',
    image: '/portfolio/work-4.jpg',
    note: {
      es: 'Inventario solo desde `src/` y `server.ts`. El README menciona calculadoras/DIY/flash deals que no están en el código actual.',
      en: 'Inventory from `src/` and `server.ts` only. README mentions calculators/DIY/flash deals not present in current code.',
      it: 'Inventario solo da `src/` e `server.ts`. Il README cita calcolatrici/DIY/flash deals assenti nel codice attuale.',
    },
    frontend: [
      {
        es: 'Home con hero, tabs home/catálogo/servicios y buscador',
        en: 'Home with hero, home/catalogue/services tabs and search',
        it: 'Home con hero, tab home/catalogo/servizi e ricerca',
      },
      {
        es: 'Catálogo por categorías (`CategoryCard`, `CategoryPage`) y fichas de producto',
        en: 'Category catalogue (`CategoryCard`, `CategoryPage`) and product cards',
        it: 'Catalogo per categorie (`CategoryCard`, `CategoryPage`) e schede prodotto',
      },
      {
        es: 'Presupuesto: añadir/quitar productos, notas y envío formateado por WhatsApp',
        en: 'Quote basket: add/remove products, notes and formatted WhatsApp send',
        it: 'Preventivo: aggiungi/rimuovi prodotti, note e invio WhatsApp formattato',
      },
      {
        es: '`CheckoutModal` — pedido online (métodos de pago/entrega en UI)',
        en: '`CheckoutModal` — online order (payment/delivery methods in UI)',
        it: '`CheckoutModal` — ordine online (metodi pagamento/consegna in UI)',
      },
      {
        es: '`QuoteModal`, ticker, navbar, footer y listado de servicios de taller desde `hardwareData`',
        en: '`QuoteModal`, ticker, navbar, footer and workshop services from `hardwareData`',
        it: '`QuoteModal`, ticker, navbar, footer e servizi officina da `hardwareData`',
      },
      {
        es: '`AuthModal` + `VerificationModal` (flujo de registro/verificación en cliente)',
        en: '`AuthModal` + `VerificationModal` (client signup/verification flow)',
        it: '`AuthModal` + `VerificationModal` (flusso registrazione/verifica client)',
      },
    ],
    backend: [
      {
        es: 'Express `server.ts`: `POST /api/send-code` (código verificación por email SMTP/Nodemailer)',
        en: 'Express `server.ts`: `POST /api/send-code` (SMTP/Nodemailer verification code)',
        it: 'Express `server.ts`: `POST /api/send-code` (codice verifica via SMTP/Nodemailer)',
      },
      {
        es: '`POST /api/process-order` — genera id de pedido y envía recibo por email (card/Bizum/transfer/Stripe como etiquetas)',
        en: '`POST /api/process-order` — order id + email receipt (card/Bizum/transfer/Stripe as labels)',
        it: '`POST /api/process-order` — id ordine + ricevuta email (card/Bizum/bonifico/Stripe come etichette)',
      },
      {
        es: 'Firebase cliente (`src/lib/firebase.ts`) + reglas `firestore.rules`',
        en: 'Firebase client (`src/lib/firebase.ts`) + `firestore.rules`',
        it: 'Client Firebase (`src/lib/firebase.ts`) + `firestore.rules`',
      },
      {
        es: 'Datos de catálogo/servicios/tienda en `src/data/hardwareData.ts`',
        en: 'Catalogue/services/store data in `src/data/hardwareData.ts`',
        it: 'Dati catalogo/servizi/negozio in `src/data/hardwareData.ts`',
      },
    ],
  },
  {
    slug: 'stockfeet',
    name: 'Stockfeet',
    client: {
      es: 'App de escritorio · ajedrez',
      en: 'Desktop app · chess',
      it: 'App desktop · scacchi',
    },
    pitch: {
      es: 'Coach, puzzles y rival con Leela Chess Zero (lc0): hub Play · Puzzles · Shop · Improve.',
      en: 'Coach, puzzles and opponent powered by Leela Chess Zero (lc0): Play · Puzzles · Shop · Improve hub.',
      it: 'Coach, puzzle e avversario con Leela Chess Zero (lc0): hub Play · Puzzles · Shop · Improve.',
    },
    stack: ['Python', 'Tkinter', 'python-chess', 'lc0', 'SQLite'],
    repo: 'https://github.com/Juanmendo13/Stockfeet',
    year: '2025',
    image: '/portfolio/work-3.jpg',
    frontend: [
      {
        es: 'Hub Tkinter: Play, Puzzles, Shop, Improve/Profile',
        en: 'Tkinter hub: Play, Puzzles, Shop, Improve/Profile',
        it: 'Hub Tkinter: Play, Puzzles, Shop, Improve/Profile',
      },
      {
        es: 'Tablero con skins de casillas/piezas; eval bar en vivo',
        en: 'Board with square/piece skins; live eval bar',
        it: 'Scacchiera con skin case/pezzi; eval bar live',
      },
      {
        es: 'Partida vs lc0 con hint, resign, copiar PGN, coach de jugadas',
        en: 'Play vs lc0 with hint, resign, copy PGN, move coach',
        it: 'Partita vs lc0 con hint, resign, copia PGN, coach mosse',
      },
      {
        es: 'Puzzles temáticos (mates, forks, pins…) con recompensas FeetCoins',
        en: 'Themed puzzles (mates, forks, pins…) with FeetCoins rewards',
        it: 'Puzzle a tema (mati, forks, pins…) con premi FeetCoins',
      },
      {
        es: 'Path/improvement map por etapas; perfil con streak, XP y plan',
        en: 'Staged path/improvement map; profile with streak, XP and plan',
        it: 'Path/improvement a tappe; profilo con streak, XP e piano',
      },
      {
        es: 'Shop de skins; modo CLI (`stockfeet play --cli`) y `--direct`',
        en: 'Skin shop; CLI mode (`stockfeet play --cli`) and `--direct`',
        it: 'Shop skin; modalità CLI (`stockfeet play --cli`) e `--direct`',
      },
    ],
    backend: [
      {
        es: 'Motor `Lc0Engine` (UCI) + análisis de posición / líneas',
        en: '`Lc0Engine` (UCI) + position analysis / lines',
        it: 'Motore `Lc0Engine` (UCI) + analisi posizione / linee',
      },
      {
        es: 'Libro humano por bandas Elo (Zobrist) desde packs Lichess',
        en: 'Human book by Elo bands (Zobrist) from Lichess packs',
        it: 'Libro umano per bande Elo (Zobrist) da pack Lichess',
      },
      {
        es: 'Puzzles JSON o SQLite (`puzzles.py`); scripts de import/validate',
        en: 'Puzzles JSON or SQLite (`puzzles.py`); import/validate scripts',
        it: 'Puzzle JSON o SQLite (`puzzles.py`); script import/validate',
      },
      {
        es: 'Perfil persistente en disco; strength clamping Elo',
        en: 'On-disk profile; Elo strength clamping',
        it: 'Profilo su disco; clamp forza Elo',
      },
      {
        es: 'Coach por reglas (`coach/rules.py`) + plan de mejora; LLM opcional vía env',
        en: 'Rule-based coach (`coach/rules.py`) + improvement plan; optional LLM via env',
        it: 'Coach a regole (`coach/rules.py`) + piano miglioramento; LLM opzionale via env',
      },
    ],
  },
  {
    slug: 'subatomic-os',
    name: 'subatomic.os',
    client: {
      es: 'Juego incremental · cosmogénesis',
      en: 'Incremental game · cosmogenesis',
      it: 'Gioco incrementale · cosmogenesi',
    },
    pitch: {
      es: 'Simulador idle de física de partículas: cosecha quarks, ensambla bariones, investigación y consola de sistema.',
      en: 'Particle-physics idle sim: harvest quarks, assemble baryons, research tree and system console.',
      it: 'Sim idle di fisica delle particelle: raccogli quark, assembla barioni, ricerca e console di sistema.',
    },
    stack: ['Web app', 'Vercel'],
    live: 'https://subatomic-os.vercel.app',
    year: '2025',
    image: '/portfolio/work-4.jpg',
    note: {
      es: 'Inventario desde el deploy `subatomic-os` (repo GitHub no público / 404).',
      en: 'Inventory from `subatomic-os` deploy (GitHub repo not public / 404).',
      it: 'Inventario dal deploy `subatomic-os` (repo GitHub non pubblico / 404).',
    },
    frontend: [
      {
        es: 'HUD: energía total, energía Planck, semillas cósmicas, edad del universo',
        en: 'HUD: total energy, Planck energy, cosmic seeds, universe age',
        it: 'HUD: energia totale, energia Planck, semi cosmici, età dell’universo',
      },
      {
        es: 'Extracción manual/auto de Quark Up/Down, electrón, neutrinos',
        en: 'Manual/auto extraction of Up/Down quarks, electron, neutrinos',
        it: 'Estrazione manuale/auto di quark Up/Down, elettrone, neutrini',
      },
      {
        es: 'Ensamble de protón/neutrón con lotes x1…MAX; generadores de campo bloqueados por investigación',
        en: 'Proton/neutron assembly with x1…MAX batches; field generators gated by research',
        it: 'Assemblaggio protone/neutrone con lotti x1…MAX; generatori di campo bloccati dalla ricerca',
      },
      {
        es: 'Confinamiento/estabilidad (partículas libres caducan a 60s); objetivos 1/21',
        en: 'Confinement/stability (free particles expire at 60s); goals 1/21',
        it: 'Confinamento/stabilità (particelle libere scadono a 60s); obiettivi 1/21',
      },
      {
        es: 'Modo dios, silenciar sonido, guardar, ajustes, reiniciar; consola de eventos',
        en: 'God mode, mute, save, settings, reset; event console',
        it: 'God mode, muta audio, salva, impostazioni, reset; console eventi',
      },
      {
        es: 'UI cyber/terminal en español',
        en: 'Spanish cyber/terminal UI',
        it: 'UI cyber/terminale in spagnolo',
      },
    ],
    backend: [
      {
        es: 'Persistencia local de partida (GUARDAR) en el cliente',
        en: 'Client-side save game persistence',
        it: 'Persistenza salvataggio lato client',
      },
      {
        es: 'Lógica de tasas netas, niveles Σ_safe y desbloqueos de investigación en runtime',
        en: 'Runtime net-rate, Σ_safe levels and research unlock logic',
        it: 'Logica runtime di tassi netti, livelli Σ_safe e sblocchi ricerca',
      },
      {
        es: 'Hosted en Vercel proyecto `subatomic-os`',
        en: 'Hosted on Vercel project `subatomic-os`',
        it: 'Hosted su Vercel progetto `subatomic-os`',
      },
    ],
  },
  {
    slug: 'orticas-pub',
    name: 'Ortica’s Pub',
    client: {
      es: 'Ortica / Lambrate, Milano',
      en: 'Ortica / Lambrate, Milan',
      it: 'Ortica / Lambrate, Milano',
    },
    pitch: {
      es: 'Web del pub de barrio: caffè, focacce, cerveza y recibidoría — con TPV embebido.',
      en: 'Neighbourhood pub site: coffee, focaccia, beer and corner shop — with embedded TPV.',
      it: 'Sito del pub di quartiere: caffè, focacce, birra e ricevitoria — con TPV embedded.',
    },
    stack: ['Static web', 'Vercel'],
    live: 'https://orticas-pub.vercel.app',
    year: '2026',
    image: '/portfolio/work-1.jpg',
    note: {
      es: 'Inventario desde deploy `orticas-pub` (sin repo público listado).',
      en: 'Inventory from `orticas-pub` deploy (no listed public repo).',
      it: 'Inventario dal deploy `orticas-pub` (nessun repo pubblico elencato).',
    },
    frontend: [
      {
        es: 'Landing de marca Ortica’s Pub (Via Riccardo Pitteri 7)',
        en: 'Ortica’s Pub branded landing (Via Riccardo Pitteri 7)',
        it: 'Landing brand Ortica’s Pub (Via Riccardo Pitteri 7)',
      },
      {
        es: 'Copy IT: caffè dalle 6, focacce/piadine, Guinness, Tennent’s, partita',
        en: 'IT copy: coffee from 6, focaccia/piadina, Guinness, Tennent’s, match days',
        it: 'Copy IT: caffè dalle 6, focacce/piadine, Guinness, Tennent’s, partita',
      },
      {
        es: 'Ruta `/tpv/` para punto de venta',
        en: '`/tpv/` point-of-sale route',
        it: 'Route `/tpv/` punto vendita',
      },
      {
        es: 'Favicon + web manifest PWA-ready',
        en: 'Favicon + web manifest (PWA-ready)',
        it: 'Favicon + web manifest (PWA-ready)',
      },
    ],
    backend: [
      {
        es: 'Hosting estático en Vercel (`orticas-pub`)',
        en: 'Static hosting on Vercel (`orticas-pub`)',
        it: 'Hosting statico su Vercel (`orticas-pub`)',
      },
      {
        es: 'TPV servido como ruta estática bajo `/tpv/` (detalle de API no expuesto públicamente)',
        en: 'TPV served as static `/tpv/` route (API details not publicly exposed)',
        it: 'TPV servito come route statica `/tpv/` (API non esposta pubblicamente)',
      },
    ],
  },
  {
    slug: 'proyecto-adif',
    name: 'Proyecto ADIF',
    client: {
      es: 'Prototipo autenticado',
      en: 'Authenticated prototype',
      it: 'Prototipo autenticato',
    },
    pitch: {
      es: 'App web con pantalla de login (usuario/contraseña) detrás de auth — detalle interno no público.',
      en: 'Web app with username/password login gate — internal detail not public.',
      it: 'Web app con login utente/password — dettaglio interno non pubblico.',
    },
    stack: ['Astro', 'Vercel', 'Vercel Insights'],
    live: 'https://proyecto-adif.vercel.app',
    year: '2025',
    image: '/portfolio/work-4.jpg',
    note: {
      es: 'Solo se documenta lo observable sin credenciales. No es un proyecto JRPG/Persona.',
      en: 'Only unauthenticated-observable behaviour documented. Not a JRPG/Persona project.',
      it: 'Documentato solo ciò osservabile senza credenziali. Non è un progetto JRPG/Persona.',
    },
    frontend: [
      {
        es: 'Pantalla de login centrada (Usuario / Contraseña / ENTRAR)',
        en: 'Centered login screen (User / Password / ENTER)',
        it: 'Schermata login centrata (Utente / Password / ENTRA)',
      },
      {
        es: 'Tema dark slate con acento cyan',
        en: 'Dark slate theme with cyan accent',
        it: 'Tema dark slate con accento cyan',
      },
    ],
    backend: [
      {
        es: 'Formulario `POST` de autenticación (ruta protegida tras login)',
        en: '`POST` authentication form (protected routes after login)',
        it: 'Form `POST` di autenticazione (route protette dopo il login)',
      },
      {
        es: 'Vercel Analytics/Insights script en la página de login',
        en: 'Vercel Analytics/Insights on the login page',
        it: 'Vercel Analytics/Insights nella pagina di login',
      },
    ],
  },
];
