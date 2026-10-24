export const site = {
  name: 'juanmendo',
  personName: 'Juan Mendoza',
  shortName: 'jm',
  handle: 'juanmendo13',
  brand: 'juanmendo',
  tagline: 'Full-stack para negocios locales',
  description:
    'juanmendo — full-stack: frontend, backend, APIs, auth, email/blob y deploy en Vercel. Ingeniería Informática · Sevilla · Milano.',
  role: 'Ingeniería Informática · Full-stack',
  location: 'Sevilla · Milano',
  email: 'jmendozadame@gmail.com',
  github: 'https://github.com/Juanmendo13',
  url: 'https://juanmendo.dev',
  isPrototype: false,
} as const;

export type Site = typeof site;
