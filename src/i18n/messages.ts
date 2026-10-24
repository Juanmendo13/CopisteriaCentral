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
      'Soy Juan: cuarto curso de Ingeniería Informática, ahora de Erasmus en el Politecnico di Milano. Trabajo full-stack de punta a punta —UI/UX y sitios rápidos en el cliente; APIs, auth, email, subida de archivos (Blob), paneles admin/PDA y despliegue en Vercel en el servidor—. Construyo herramientas para comercios locales (pedidos, cartas, catálogos, presupuestos) y me interesan la IA y la ciberseguridad.',
    'about.lang': 'Español nativo · English C1',
    'about.tag1': 'Frontend · UI/UX · SSR',
    'about.tag2': 'Backend · APIs · Auth',
    'about.tag3': 'Email · Blob · Admin/PDA',
    'about.tag4': 'Deploy Vercel',
    'about.tag5': 'IA · Ciberseguridad',
    'work.kicker': 'Proyectos',
    'work.title': 'Todo el trabajo en producción',
    'work.lead':
      'Cada ficha lista funcionalidades frontend y backend leídas del código o del deploy real. Sin relleno.',
    'work.live': 'Visitar',
    'work.code': 'Código',
    'work.download': 'Descargar',
    'work.frontend': 'Frontend',
    'work.backend': 'Backend / API / infra',
    'work.note': 'Nota',
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
      'I’m Juan: fourth-year Computer Engineering student, currently on Erasmus at Politecnico di Milano. I work full-stack end to end — UI/UX and fast client sites; APIs, auth, email, file uploads (Blob), admin/PDA panels and Vercel deploys on the server. I build tools for local businesses (orders, menus, catalogues, quotes) and I care about AI and cybersecurity.',
    'about.lang': 'Native Spanish · English C1',
    'about.tag1': 'Frontend · UI/UX · SSR',
    'about.tag2': 'Backend · APIs · Auth',
    'about.tag3': 'Email · Blob · Admin/PDA',
    'about.tag4': 'Vercel deploy',
    'about.tag5': 'AI · Cybersecurity',
    'work.kicker': 'Projects',
    'work.title': 'Everything shipping in production',
    'work.lead':
      'Each card lists frontend and backend features read from real code or deploys. No filler.',
    'work.live': 'Visit',
    'work.code': 'Code',
    'work.download': 'Download',
    'work.frontend': 'Frontend',
    'work.backend': 'Backend / API / infra',
    'work.note': 'Note',
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
      'Sono Juan: quarto anno di Ingegneria Informatica, ora in Erasmus al Politecnico di Milano. Lavoro full-stack end-to-end — UI/UX e siti veloci lato client; API, auth, email, upload file (Blob), pannelli admin/PDA e deploy su Vercel lato server. Costruisco strumenti per negozi locali (ordini, menu, cataloghi, preventivi) e mi interessano l’IA e la cybersecurity.',
    'about.lang': 'Spagnolo madrelingua · English C1',
    'about.tag1': 'Frontend · UI/UX · SSR',
    'about.tag2': 'Backend · API · Auth',
    'about.tag3': 'Email · Blob · Admin/PDA',
    'about.tag4': 'Deploy Vercel',
    'about.tag5': 'IA · Cybersecurity',
    'work.kicker': 'Progetti',
    'work.title': 'Tutto ciò che è in produzione',
    'work.lead':
      'Ogni scheda elenca funzionalità frontend e backend lette dal codice o dal deploy reale. Niente riempitivo.',
    'work.live': 'Visita',
    'work.code': 'Codice',
    'work.download': 'Scarica',
    'work.frontend': 'Frontend',
    'work.backend': 'Backend / API / infra',
    'work.note': 'Nota',
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
