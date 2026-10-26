export type Locale = 'es' | 'en' | 'it';

export type Localized = Record<Locale, string>;

export type ProjectLink = {
  href: string;
  label: Localized;
};

export type Project = {
  slug: string;
  name: string;
  client: Localized;
  pitch: Localized;
  /** Owner-facing pitch for /negocios — outcomes, no tech jargon. */
  humanPitch?: Localized;
  /** Short owner-facing capability bullets for /negocios cards. */
  humanBullets?: Localized[];
  stack: string[];
  live?: string;
  /** Extra demos (e.g. Pitteri PDA /sala/) — never invent URLs. */
  demos?: ProjectLink[];
  repo?: string;
  download?: string;
  year: string;
  /** Real UI screenshot path, or omit when no public web UI / no authentic capture. */
  image?: string;
  frontend: Localized[];
  backend: Localized[];
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
      es: 'Copistería full-stack: pedido con PDF (páginas detectadas automáticamente), calculadora de precio, papelería `/venta` con catálogo vivo, panel `/admin` de productos/stock autónomo, y avisos al Gmail del local.',
      en: 'Full-stack copy shop: PDF orders (pages auto-detected), price calculator, `/venta` stationery with live catalogue, `/admin` self-serve products/stock panel, and alerts to the shop Gmail.',
      it: 'Copisteria full-stack: ordini PDF (pagine rilevate automaticamente), calcolatore prezzo, cartoleria `/venta` con catalogo live, pannello `/admin` prodotti/stock autonomo e avvisi alla Gmail del locale.',
    },
    humanPitch: {
      es: 'El cliente sube el PDF para imprimir: la web cuenta las páginas sola (nadie las cuenta a mano), calcula un precio orientativo y el aviso llega al email del local. Papelería online con carrito, y un panel del dueño para dar de alta productos y gestionar el stock sin depender de un informático.',
      en: 'Customers upload a PDF to print: the site counts the pages automatically (no manual counting), shows an indicative price, and emails the shop. Online stationery with a cart, plus an owner panel to add products and manage stock without needing a developer.',
      it: 'Il cliente carica il PDF da stampare: il sito conta le pagine da solo (niente conteggio a mano), calcola un prezzo orientativo e avvisa la Gmail del locale. Cartoleria online con carrello e pannello del titolare per prodotti e stock senza un informatico.',
    },
    humanBullets: [
      {
        es: 'Subida de PDF: las páginas se detectan solas',
        en: 'PDF upload: pages detected automatically',
        it: 'Upload PDF: pagine rilevate automaticamente',
      },
      {
        es: 'Precio orientativo según formato, color, caras, páginas y copias',
        en: 'Indicative price from size, colour, sides, pages and copies',
        it: 'Prezzo orientativo da formato, colore, facciate, pagine e copie',
      },
      {
        es: 'Panel del dueño: alta de productos y stock de papelería',
        en: 'Owner panel: add products and manage stationery stock',
        it: 'Pannello titolare: prodotti e stock cartoleria',
      },
      {
        es: 'Aviso del pedido al email del local (+ WhatsApp si el archivo es grande)',
        en: 'Order alert to the shop email (+ WhatsApp for large files)',
        it: 'Avviso ordine alla email del locale (+ WhatsApp se il file è grande)',
      },
    ],
    stack: ['Astro 7', 'Tailwind 4', 'Vercel', 'Vercel Blob', 'pdf.js', 'Web3Forms', 'Resend'],
    live: 'https://copisteria-central.vercel.app',
    repo: 'https://github.com/Juanmendo13/CopisteriaCentral',
    year: '2026',
    image: '/portfolio/shots/copisteria-central.jpg',
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
        es: '`/pedido`: subida PDF/JPG/PNG; pdf.js cuenta `numPages` y rellena el campo de páginas (editable si hace falta)',
        en: '`/pedido`: PDF/JPG/PNG upload; pdf.js reads `numPages` and fills the pages field (editable if needed)',
        it: '`/pedido`: upload PDF/JPG/PNG; pdf.js legge `numPages` e riempie il campo pagine (editabile se serve)',
      },
      {
        es: 'Calculadora de precio orientativo en vivo (formato, color, caras, páginas, copias)',
        en: 'Live indicative price calculator (size, colour, sides, pages, copies)',
        it: 'Calcolatore prezzo orientativo live (formato, colore, facciate, pagine, copie)',
      },
      {
        es: 'Papelería `/venta`: catálogo en vivo (Blob) con fallback estático, búsqueda, cards densas, carrito sticky con subtotal',
        en: 'Stationery `/venta`: live catalogue (Blob) with static fallback, search, dense cards, sticky cart with subtotal',
        it: 'Cartoleria `/venta`: catalogo live (Blob) con fallback statico, ricerca, card dense, carrello sticky con subtotale',
      },
      {
        es: 'Badges de stock en `/venta` cuando el admin gestiona unidades (0 / consultar)',
        en: 'Stock badges on `/venta` when admin manages units (0 / enquire)',
        it: 'Badge stock su `/venta` quando l’admin gestisce unità (0 / consulta)',
      },
      {
        es: '`/admin`: panel privado (login + cookie) para productos, precios, imagen, activo/oculto y stock',
        en: '`/admin`: private panel (login + cookie) for products, prices, image, active/hidden and stock',
        it: '`/admin`: pannello privato (login + cookie) per prodotti, prezzi, immagine, attivo/nascosto e stock',
      },
      {
        es: 'Precios orientativos con carrito de presupuesto (`/precios`)',
        en: 'Indicative prices with quote cart (`/precios`)',
        it: 'Prezzi orientativi con carrello preventivo (`/precios`)',
      },
      {
        es: 'Contacto: teléfono, WhatsApp, horario y mapa; galería `/imagenes` y legales',
        en: 'Contact: phone, WhatsApp, hours and map; `/imagenes` gallery and legal pages',
        it: 'Contatti: telefono, WhatsApp, orari e mappa; galleria `/imagenes` e legali',
      },
    ],
    backend: [
      {
        es: '`POST /api/pedido` — valida pedido (incl. páginas/copias) e inicia aviso a la tienda',
        en: '`POST /api/pedido` — validates order (incl. pages/copies) and triggers shop notify',
        it: '`POST /api/pedido` — valida ordine (incl. pagine/copie) e avvia notifica al negozio',
      },
      {
        es: '`POST /api/upload` — subida a Vercel Blob (`BLOB_READ_WRITE_TOKEN`)',
        en: '`POST /api/upload` — upload to Vercel Blob (`BLOB_READ_WRITE_TOKEN`)',
        it: '`POST /api/upload` — upload su Vercel Blob (`BLOB_READ_WRITE_TOKEN`)',
      },
      {
        es: 'Catálogo vivo en Blob `catalog/venta.json` (`venta-catalog.ts`) con fallback al catálogo estático',
        en: 'Live catalogue in Blob `catalog/venta.json` (`venta-catalog.ts`) with static fallback',
        it: 'Catalogo live in Blob `catalog/venta.json` (`venta-catalog.ts`) con fallback statico',
      },
      {
        es: '`/api/admin/*` — login/logout/session, CRUD productos, seed y subida de imagen (auth por cookie HttpOnly)',
        en: '`/api/admin/*` — login/logout/session, product CRUD, seed and image upload (HttpOnly cookie auth)',
        it: '`/api/admin/*` — login/logout/session, CRUD prodotti, seed e upload immagine (auth cookie HttpOnly)',
      },
      {
        es: '`POST /api/presupuesto-carrito` y `/api/presupuesto-contacto`',
        en: '`POST /api/presupuesto-carrito` and `/api/presupuesto-contacto`',
        it: '`POST /api/presupuesto-carrito` e `/api/presupuesto-contacto`',
      },
      {
        es: 'Web3Forms → Gmail de pedidos (`PEDIDOS_EMAIL` / `WEB3FORMS_ACCESS_KEY`); Resend opcional',
        en: 'Web3Forms → orders Gmail (`PEDIDOS_EMAIL` / `WEB3FORMS_ACCESS_KEY`); optional Resend',
        it: 'Web3Forms → Gmail ordini (`PEDIDOS_EMAIL` / `WEB3FORMS_ACCESS_KEY`); Resend opzionale',
      },
      {
        es: 'WhatsApp (`wa.me`) como alternativa si el archivo es grande',
        en: 'WhatsApp (`wa.me`) fallback for large files',
        it: 'WhatsApp (`wa.me`) come alternativa per file grandi',
      },
      {
        es: '`GET /api/notify-health` — comprobación del canal de avisos',
        en: '`GET /api/notify-health` — notify channel health check',
        it: '`GET /api/notify-health` — health check del canale di avviso',
      },
      {
        es: 'SSR Astro en Vercel (`@astrojs/vercel`)',
        en: 'Astro SSR on Vercel (`@astrojs/vercel`)',
        it: 'SSR Astro su Vercel (`@astrojs/vercel`)',
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
      es: 'Web pública del bar + comandera PDA en `/sala/` (mesas, cocina, cuenta, admin) con sync Supabase opcional o localStorage.',
      en: 'Public bar site + waiter PDA at `/sala/` (tables, kitchen, bill, admin) with optional Supabase sync or localStorage.',
      it: 'Sito pubblico del bar + PDA comanderia su `/sala/` (tavoli, cucina, conto, admin) con sync Supabase opzionale o localStorage.',
    },
    humanPitch: {
      es: 'Web del bar para quien te busca (carta, horario, Maps) y, aparte, una comandería en el móvil: mesas por zonas, cocina, cuenta y cierre. Puedes abrir la demo de sala ahora mismo.',
      en: 'A public site for people looking you up (menu, hours, Maps) plus a phone comandería: zoned tables, kitchen, bill and close-out. You can open the sala demo right now.',
      it: 'Sito del bar per chi ti cerca (menu, orari, Maps) e, a parte, una comanderia sul telefono: tavoli per zone, cucina, conto e chiusura. Puoi aprire subito la demo sala.',
    },
    humanBullets: [
      {
        es: 'Demo en vivo de la comandería: pitteri.vercel.app/sala/',
        en: 'Live comandería demo: pitteri.vercel.app/sala/',
        it: 'Demo live della comanderia: pitteri.vercel.app/sala/',
      },
      {
        es: 'PIN de camareros, plano de mesas, cocina y cobro',
        en: 'Waiter PIN, floor plan, kitchen and payment',
        it: 'PIN camerieri, pianta tavoli, cucina e pagamento',
      },
      {
        es: 'Sirve como base de un TPV/comandera sencillo para bares',
        en: 'Works as a base for a simple bar POS/comandería',
        it: 'Serve da base per un TPV/comanderia semplice da bar',
      },
    ],
    stack: ['React', 'Vite', 'Supabase', 'Vercel'],
    live: 'https://pitteri.vercel.app',
    demos: [
      {
        href: 'https://pitteri.vercel.app/sala/',
        label: {
          es: 'Probar PDA /sala',
          en: 'Try PDA /sala',
          it: 'Prova PDA /sala',
        },
      },
    ],
    repo: 'https://github.com/Juanmendo13/piteri',
    year: '2025',
    image: '/portfolio/shots/pitteri.jpg',
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
    humanPitch: {
      es: 'Catálogo de ferretería por categorías: el cliente busca, arma el presupuesto con notas y te lo manda por WhatsApp o checkout. Registro por email para repetir pedidos.',
      en: 'Hardware catalogue by category: customers search, build a quote with notes and send it via WhatsApp or checkout. Email signup for repeat orders.',
      it: 'Catalogo ferramenta per categorie: il cliente cerca, prepara il preventivo con note e lo manda su WhatsApp o checkout. Registrazione email per ordini ripetuti.',
    },
    humanBullets: [
      {
        es: 'Catálogo por categorías + ficha de producto',
        en: 'Category catalogue + product pages',
        it: 'Catalogo per categorie + scheda prodotto',
      },
      {
        es: 'Presupuesto listo para WhatsApp (o checkout)',
        en: 'Quote ready for WhatsApp (or checkout)',
        it: 'Preventivo pronto per WhatsApp (o checkout)',
      },
    ],
    stack: ['React 19', 'Vite', 'Express', 'Firebase', 'Nodemailer', 'Tailwind 4'],
    live: 'https://ferreteria-yelamo.vercel.app/',
    repo: 'https://github.com/Juanmendo13/FerreteriaYelamo',
    year: '2025',
    image: '/portfolio/shots/ferreteria-yelamo.jpg',
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
    humanPitch: {
      es: 'Carta digital con precios reales, tamaños e ingredientes: el cliente monta el carrito (recogida o reparto), inicia sesión y el pedido llega al correo de la pizzería. También hay carta para imprimir en PDF.',
      en: 'Digital menu with real prices, sizes and ingredients: customers build a cart (pickup or delivery), sign in, and the order hits the pizzeria inbox. Printable PDF menu included.',
      it: 'Menu digitale con prezzi reali, taglie e ingredienti: il cliente compone il carrello (ritiro o consegna), accede e l’ordine arriva alla casella della pizzeria. C’è anche il menu PDF da stampare.',
    },
    humanBullets: [
      {
        es: 'Carta con precios reales + carrito (recogida/reparto)',
        en: 'Menu with real prices + cart (pickup/delivery)',
        it: 'Menu con prezzi reali + carrello (ritiro/consegna)',
      },
      {
        es: 'Pedido al email de la pizzería; carta PDF imprimible',
        en: 'Order to the pizzeria email; printable PDF menu',
        it: 'Ordine alla email della pizzeria; menu PDF stampabile',
      },
    ],
    stack: ['Astro', 'Tailwind 4', 'Clerk', 'Web3Forms', 'Vercel'],
    live: 'https://pizzeria-formula-1.vercel.app',
    repo: 'https://github.com/Juanmendo13/pizzeria-formula-1',
    year: '2025',
    image: '/portfolio/shots/pizzeria-formula-1.jpg',
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
    humanPitch: {
      es: 'Web de imprenta/copistería orientada a campus: fichas de servicio (fotocopias, A0–A6, encuadernación…), precios orientativos y pedido con archivo hasta gran formato, con aviso al local y alternativa WhatsApp.',
      en: 'Campus-oriented print shop site: service pages (copies, A0–A6, binding…), indicative prices and file orders up to large format, with shop alerts and WhatsApp fallback.',
      it: 'Sito tipografia/copisteria campus: schede servizio (copie, A0–A6, rilegatura…), prezzi orientativi e ordini con file fino al grande formato, con avviso al locale e alternativa WhatsApp.',
    },
    humanBullets: [
      {
        es: 'Servicios y pedido con archivo hasta formato A0',
        en: 'Services and file orders up to A0',
        it: 'Servizi e ordini con file fino ad A0',
      },
      {
        es: 'Precios orientativos + contacto WhatsApp/Maps',
        en: 'Indicative prices + WhatsApp/Maps contact',
        it: 'Prezzi orientativi + contatto WhatsApp/Maps',
      },
    ],
    stack: ['Astro', 'Tailwind', 'Vercel', 'Vercel Blob', 'Web3Forms'],
    live: 'https://a0-impresiones.vercel.app',
    year: '2026',
    image: '/portfolio/shots/a0-impresiones.jpg',
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
    download:
      'https://github.com/Juanmendo13/Stockfeet/releases/download/v0.0.0/Stockfeet-0.0.0-try-windows.zip',
    year: '2025',
    image: '/portfolio/shots/stockfeet-chess.jpg',
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
    image: '/portfolio/shots/subatomic-os.jpg',
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
    humanPitch: {
      es: 'Landing del pub (caffè, focacce, cerveza, recibidoría) con dirección y marca, más una ruta `/tpv/` embebida para el punto de venta del día a día.',
      en: 'Pub landing (coffee, focaccia, beer, corner shop) with address and brand, plus an embedded `/tpv/` route for day-to-day point of sale.',
      it: 'Landing del pub (caffè, focacce, birra, ricevitoria) con indirizzo e brand, più una route `/tpv/` embedded per il punto vendita quotidiano.',
    },
    humanBullets: [
      {
        es: 'Web de marca + horario/ubicación',
        en: 'Brand site + hours/location',
        it: 'Sito di brand + orari/posizione',
      },
      {
        es: 'TPV embebido en `/tpv/` para el mostrador',
        en: 'Embedded POS at `/tpv/` for the counter',
        it: 'TPV embedded su `/tpv/` per il bancone',
      },
    ],
    stack: ['Static web', 'Vercel'],
    live: 'https://orticas-pub.vercel.app',
    year: '2026',
    image: '/portfolio/shots/orticas-pub.jpg',
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
];

/** Local-business case studies for /negocios (excludes Stockfeet, subatomic.os). */
export const businessSlugs = [
  'copisteria-central',
  'ferreteria-yelamo',
  'pitteri',
  'pizzeria-formula-1',
  'a0-impresiones',
  'orticas-pub',
] as const;

export function getBusinessProjects(): Project[] {
  return businessSlugs
    .map((slug) => projects.find((p) => p.slug === slug))
    .filter((p): p is Project => Boolean(p));
}
