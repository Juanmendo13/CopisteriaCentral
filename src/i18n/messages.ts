import type { Locale } from '../data/projects';

export const locales: Locale[] = ['es', 'en', 'it'];
export const defaultLocale: Locale = 'es';
export const LANG_STORAGE_KEY = 'juan-portfolio-lang';

export const localeLabels: Record<Locale, string> = {
  es: 'ES',
  en: 'EN',
  it: 'IT',
};

export const ui = {
  es: {
    'meta.description':
      'juanmendo — full-stack: UI/UX, SSR, formularios, APIs, auth, email/blob, paneles/PDA y deploy en Vercel. Negocios locales, IA y ciberseguridad. Sevilla · Milano.',
    'nav.work': 'Proyectos',
    'nav.about': 'Sobre mí',
    'nav.contact': 'Contacto',
    'nav.aria': 'Principal',
    'lang.aria': 'Idioma',
    'hero.kicker': 'Full-stack · Ingeniería Informática · Sevilla / Milano',
    'hero.headline': 'Frontend y backend que el local usa de verdad.',
    'hero.lead':
      'Diseño la interfaz y monto el servidor: SSR, formularios, APIs, auth, email, blob storage, paneles y comanderas. De la ficha de Maps a un producto en Vercel.',
    'hero.ctaWork': 'Ver proyectos',
    'hero.ctaContact': 'Contactar',
    'about.kicker': 'Sobre mí',
    'about.title': 'Juan, de Sevilla.',
    'about.body':
      'Hola, soy Juan, más conocido como juanmendo: estudiante de Ingeniería Informática, actualmente de Erasmus en Milán. Me adapto a cualquier encargo. Tengo experiencia con IA y con webs full-stack para todo tipo de comercios —frontend y backend, APIs, autenticación y paneles de gestión autónoma (stock, alta de productos y operativa del cliente)—. También he hecho un juego idle (aún en alpha temprana) y una app estilo Duolingo, pero de ajedrez (Stockfeet). Tengo más proyectos en marcha; por ahora siguen privados hasta versiones más maduras.',
    'about.lang': 'Español nativo · English C1',
    'about.tag1': 'Frontend · Backend',
    'about.tag2': 'APIs · Auth',
    'about.tag3': 'Gestión · Stock',
    'about.tag4': 'IA',
    'about.tag5': 'Idle · Chess apps',
    'work.kicker': 'Proyectos',
    'work.title': 'Todo el trabajo en producción',
    'work.lead':
      'Cada ficha lista funcionalidades frontend y backend leídas del código o del deploy real. Sin relleno.',
    'work.live': 'Visitar',
    'work.code': 'Código',
    'work.download': 'Descargar',
    'work.frontend': 'Frontend',
    'work.backend': 'Backend / API / infra',
    'work.open': 'Expandir detalles',
    'work.close': 'Cerrar',
    'contact.kicker': 'Contacto',
    'contact.title': '¿Necesitas full-stack para tu local?',
    'contact.lead':
      'Cuéntame el negocio y qué tiene que hacer la web (carta, pedidos, catálogo, panel…). Respondo con una propuesta concreta — sin presentación eterna.',
    'contact.email': 'Escribir email',
    'contact.github': 'GitHub',
    'footer.copy': 'Full-stack · frontend + backend en producción',
    'footer.rights': 'Portfolio personal',
  },
  en: {
    'meta.description':
      'juanmendo — full-stack: UI/UX, SSR, forms, APIs, auth, email/blob, admin/PDA and Vercel deploy. Local businesses, AI and cybersecurity. Seville · Milan.',
    'nav.work': 'Projects',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.aria': 'Main',
    'lang.aria': 'Language',
    'hero.kicker': 'Full-stack · Computer Engineering · Seville / Milan',
    'hero.headline': 'Frontend and backend the shop actually uses.',
    'hero.lead':
      'I design the UI and ship the server: SSR, forms, APIs, auth, email, blob storage, admin panels and waiter PDAs. From a Maps listing to a product on Vercel.',
    'hero.ctaWork': 'See projects',
    'hero.ctaContact': 'Contact',
    'about.kicker': 'About',
    'about.title': 'Juan, from Seville.',
    'about.body':
      'Hi, I’m Juan — better known as juanmendo: Computer Engineering student, currently on Erasmus in Milan. I adapt to any brief. I’ve worked with AI and built full-stack websites for all kinds of businesses — frontend and backend, APIs, authentication, and self-serve admin panels (stock, product intake, and day-to-day operations). I’ve also shipped an idle game (still early alpha) and a Duolingo-style chess app (Stockfeet). I have more projects underway; for now they stay private until more mature releases.',
    'about.lang': 'Native Spanish · English C1',
    'about.tag1': 'Frontend · Backend',
    'about.tag2': 'APIs · Auth',
    'about.tag3': 'Ops · Stock',
    'about.tag4': 'AI',
    'about.tag5': 'Idle · Chess apps',
    'work.kicker': 'Projects',
    'work.title': 'Everything shipping in production',
    'work.lead':
      'Each card lists frontend and backend features read from real code or deploys. No filler.',
    'work.live': 'Visit',
    'work.code': 'Code',
    'work.download': 'Download',
    'work.frontend': 'Frontend',
    'work.backend': 'Backend / API / infra',
    'work.open': 'Expand details',
    'work.close': 'Close',
    'contact.kicker': 'Contact',
    'contact.title': 'Need full-stack for your shop?',
    'contact.lead':
      'Tell me about the business and what the site must do (menu, orders, catalogue, panel…). I reply with a concrete proposal — no endless pitch deck.',
    'contact.email': 'Email me',
    'contact.github': 'GitHub',
    'footer.copy': 'Full-stack · frontend + backend in production',
    'footer.rights': 'Personal portfolio',
  },
  it: {
    'meta.description':
      'juanmendo — full-stack: UI/UX, SSR, form, API, auth, email/blob, admin/PDA e deploy su Vercel. Negozi locali, IA e cybersecurity. Siviglia · Milano.',
    'nav.work': 'Progetti',
    'nav.about': 'Su di me',
    'nav.contact': 'Contatto',
    'nav.aria': 'Principale',
    'lang.aria': 'Lingua',
    'hero.kicker': 'Full-stack · Ingegneria Informatica · Siviglia / Milano',
    'hero.headline': 'Frontend e backend che il locale usa davvero.',
    'hero.lead':
      'Disegno l’interfaccia e porto il server: SSR, form, API, auth, email, blob storage, pannelli admin e PDA camerieri. Dalla scheda di Maps a un prodotto su Vercel.',
    'hero.ctaWork': 'Vedi progetti',
    'hero.ctaContact': 'Contattami',
    'about.kicker': 'Su di me',
    'about.title': 'Juan, da Siviglia.',
    'about.body':
      'Ciao, sono Juan — meglio conosciuto come juanmendo: studente di Ingegneria Informatica, attualmente in Erasmus a Milano. Mi adatto a qualsiasi incarico. Ho esperienza con l’IA e con siti full-stack per ogni tipo di commercio — frontend e backend, API, autenticazione e pannelli di gestione autonoma (stock, inserimento prodotti e operatività del cliente). Ho anche realizzato un gioco idle (ancora in early alpha) e un’app in stile Duolingo, ma di scacchi (Stockfeet). Ho altri progetti in corso; per ora restano privati fino a versioni più mature.',
    'about.lang': 'Spagnolo madrelingua · English C1',
    'about.tag1': 'Frontend · Backend',
    'about.tag2': 'API · Auth',
    'about.tag3': 'Gestione · Stock',
    'about.tag4': 'IA',
    'about.tag5': 'Idle · Chess apps',
    'work.kicker': 'Progetti',
    'work.title': 'Tutto ciò che è in produzione',
    'work.lead':
      'Ogni scheda elenca funzionalità frontend e backend lette dal codice o dal deploy reale. Niente riempitivo.',
    'work.live': 'Visita',
    'work.code': 'Codice',
    'work.download': 'Scarica',
    'work.frontend': 'Frontend',
    'work.backend': 'Backend / API / infra',
    'work.open': 'Espandi dettagli',
    'work.close': 'Chiudi',
    'contact.kicker': 'Contatto',
    'contact.title': 'Serve full-stack per il tuo locale?',
    'contact.lead':
      'Raccontami il business e cosa deve fare il sito (menu, ordini, catalogo, pannello…). Rispondo con una proposta concreta — senza presentazione infinita.',
    'contact.email': 'Scrivi email',
    'contact.github': 'GitHub',
    'footer.copy': 'Full-stack · frontend + backend in produzione',
    'footer.rights': 'Portfolio personale',
  },
} as const satisfies Record<Locale, Record<string, string>>;

export type UiKey = keyof (typeof ui)['es'];

export function t(locale: Locale, key: UiKey): string {
  return ui[locale][key] ?? ui.es[key];
}
