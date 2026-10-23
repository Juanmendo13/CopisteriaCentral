export const site = {
  name: 'Juan Mendoza',
  shortName: 'JM',
  handle: 'juanmendo13',
  tagline: 'Webs para negocios locales',
  description:
    'Juan Mendoza — ingeniero de software. Diseño y desarrollo webs rápidas para negocios locales: copisterías, bares, pizzerías y comercios.',
  role: 'Software engineer',
  location: 'Sevilla · remoto',
  email: 'jmendozadame@gmail.com',
  github: 'https://github.com/Juanmendo13',
  url: 'https://juanmendoza.dev',
  isPrototype: false,
} as const;

export type Site = typeof site;
