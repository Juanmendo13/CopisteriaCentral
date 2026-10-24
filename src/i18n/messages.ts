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
      'Juan Mendoza — Ingeniería Informática. Webs para negocios locales, IA y ciberseguridad. Sevilla · Erasmus Politecnico di Milano.',
    'nav.work': 'Proyectos',
    'nav.about': 'Sobre mí',
    'nav.contact': 'Contacto',
    'nav.aria': 'Principal',
    'lang.aria': 'Idioma',
    'hero.kicker': 'Ingeniería Informática · Sevilla / Milano',
    'hero.headline': 'Webs que trabajan para el negocio local.',
    'hero.lead':
      'Claridad, velocidad y personalidad. De la ficha de Maps a una herramienta que el mostrador usa de verdad.',
    'hero.ctaWork': 'Ver proyectos',
    'hero.ctaContact': 'Contactar',
    'about.kicker': 'Sobre mí',
    'about.title': 'Juan, de Sevilla.',
    'about.body':
      'Cuarto curso de Ingeniería Informática, ahora de Erasmus en el Politecnico di Milano. Construyo webs útiles para comercios locales —claras, rápidas y con personalidad— y me interesan la inteligencia artificial y la ciberseguridad.',
    'about.lang': 'Español nativo · English C1',
    'about.tag1': 'Webs para negocios locales',
    'about.tag2': 'IA',
    'about.tag3': 'Ciberseguridad',
    'work.kicker': 'Proyectos',
    'work.title': 'Todo el trabajo en producción',
    'work.lead':
      'Cada ficha lista funcionalidades frontend y backend leídas del código o del deploy real. Sin relleno.',
    'work.live': 'Visitar',
    'work.code': 'Código',
    'work.frontend': 'Frontend',
    'work.backend': 'Backend / API / infra',
    'work.note': 'Nota',
    'work.open': 'Expandir detalles',
    'work.close': 'Cerrar',
    'contact.kicker': 'Contacto',
    'contact.title': '¿Un local sin web?',
    'contact.lead':
      'Cuéntame el negocio. Respondo con una propuesta concreta — sin presentación eterna.',
    'contact.email': 'Escribir email',
    'contact.github': 'GitHub',
    'footer.copy': 'Ingeniería & webs para negocios locales',
    'footer.rights': 'Portfolio personal',
  },
  en: {
    'meta.description':
      'Juan Mendoza — Computer Engineering. Local-business websites, AI and cybersecurity. Seville · Erasmus Politecnico di Milano.',
    'nav.work': 'Projects',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.aria': 'Main',
    'lang.aria': 'Language',
    'hero.kicker': 'Computer Engineering · Seville / Milan',
    'hero.headline': 'Websites that work for the local shop.',
    'hero.lead':
      'Clarity, speed and personality. From a Maps listing to a tool the counter actually uses.',
    'hero.ctaWork': 'See projects',
    'hero.ctaContact': 'Contact',
    'about.kicker': 'About',
    'about.title': 'Juan, from Seville.',
    'about.body':
      'Fourth-year Computer Engineering student, currently on Erasmus at Politecnico di Milano. I build useful websites for local businesses — clear, fast, with personality — and I care about AI and cybersecurity.',
    'about.lang': 'Native Spanish · English C1',
    'about.tag1': 'Local business websites',
    'about.tag2': 'AI',
    'about.tag3': 'Cybersecurity',
    'work.kicker': 'Projects',
    'work.title': 'Everything shipping in production',
    'work.lead':
      'Each card lists frontend and backend features read from real code or deploys. No filler.',
    'work.live': 'Visit',
    'work.code': 'Code',
    'work.frontend': 'Frontend',
    'work.backend': 'Backend / API / infra',
    'work.note': 'Note',
    'work.open': 'Expand details',
    'work.close': 'Close',
    'contact.kicker': 'Contact',
    'contact.title': 'A shop without a site?',
    'contact.lead':
      'Tell me about the business. I reply with a concrete proposal — no endless pitch deck.',
    'contact.email': 'Email me',
    'contact.github': 'GitHub',
    'footer.copy': 'Engineering & websites for local businesses',
    'footer.rights': 'Personal portfolio',
  },
  it: {
    'meta.description':
      'Juan Mendoza — Ingegneria Informatica. Siti per negozi locali, IA e cybersecurity. Siviglia · Erasmus Politecnico di Milano.',
    'nav.work': 'Progetti',
    'nav.about': 'Su di me',
    'nav.contact': 'Contatto',
    'nav.aria': 'Principale',
    'lang.aria': 'Lingua',
    'hero.kicker': 'Ingegneria Informatica · Siviglia / Milano',
    'hero.headline': 'Siti che lavorano per il negozio locale.',
    'hero.lead':
      'Chiarezza, velocità e personalità. Dalla scheda di Maps a uno strumento che il bancone usa davvero.',
    'hero.ctaWork': 'Vedi progetti',
    'hero.ctaContact': 'Contattami',
    'about.kicker': 'Su di me',
    'about.title': 'Juan, da Siviglia.',
    'about.body':
      'Quarto anno di Ingegneria Informatica, ora in Erasmus al Politecnico di Milano. Costruisco siti utili per negozi locali — chiari, veloci, con personalità — e mi interessano l’IA e la cybersecurity.',
    'about.lang': 'Spagnolo madrelingua · English C1',
    'about.tag1': 'Siti per negozi locali',
    'about.tag2': 'IA',
    'about.tag3': 'Cybersecurity',
    'work.kicker': 'Progetti',
    'work.title': 'Tutto ciò che è in produzione',
    'work.lead':
      'Ogni scheda elenca funzionalità frontend e backend lette dal codice o dal deploy reale. Niente riempitivo.',
    'work.live': 'Visita',
    'work.code': 'Codice',
    'work.frontend': 'Frontend',
    'work.backend': 'Backend / API / infra',
    'work.note': 'Nota',
    'work.open': 'Espandi dettagli',
    'work.close': 'Chiudi',
    'contact.kicker': 'Contatto',
    'contact.title': 'Un locale senza sito?',
    'contact.lead':
      'Raccontami il business. Rispondo con una proposta concreta — senza presentazione infinita.',
    'contact.email': 'Scrivi email',
    'contact.github': 'GitHub',
    'footer.copy': 'Ingegneria & siti per negozi locali',
    'footer.rights': 'Portfolio personale',
  },
} as const satisfies Record<Locale, Record<string, string>>;

export type UiKey = keyof (typeof ui)['es'];

export function t(locale: Locale, key: UiKey): string {
  return ui[locale][key] ?? ui.es[key];
}
