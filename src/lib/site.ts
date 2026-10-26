export const site = {
  name: 'juanmendo',
  personName: 'Juan Mendoza',
  shortName: 'jm',
  handle: 'juanmendo13',
  brand: 'juanmendo',
  tagline: 'Full-stack · encargos a medida',
  description:
    'juanmendo — encargos full-stack: webs/apps, APIs, TPV/PDA, paneles, automatización, desktop, IA. Interés en ciberseguridad. Sevilla · Milano.',
  role: 'Ingeniería Informática · Full-stack · encargos',
  location: 'Sevilla · Milano',
  email: 'jmendozadame@gmail.com',
  github: 'https://github.com/Juanmendo13',
  url: 'https://juanmendo.dev',
  isPrototype: false,
} as const;

export type Site = typeof site;
