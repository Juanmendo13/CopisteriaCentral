export const site = {
  name: 'Juan Mendoza',
  shortName: 'JM',
  handle: 'juanmendo13',
  brand: 'JUAN',
  tagline: 'Ingeniería & webs para negocios locales',
  description:
    'Juan Mendoza — estudiante de Ingeniería Informática en Sevilla (Erasmus en el Politecnico di Milano). Webs para negocios locales, IA y ciberseguridad.',
  role: 'Ingeniería Informática',
  location: 'Sevilla · Milano (Erasmus)',
  email: 'jmendozadame@gmail.com',
  github: 'https://github.com/Juanmendo13',
  url: 'https://juanmendo.dev',
  isPrototype: false,
} as const;

export type Site = typeof site;
