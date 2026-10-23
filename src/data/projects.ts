export type Project = {
  slug: string;
  name: string;
  client: string;
  summary: string;
  stack: string[];
  href: string;
  image: string;
  year: string;
};

export const projects: Project[] = [
  {
    slug: 'copisteria-central',
    name: 'Copistería Central',
    client: 'Reina Mercedes, Sevilla',
    summary:
      'Catálogo, pedidos con PDF y precios para una copistería junto al campus. De la ficha de Maps a una web operativa.',
    stack: ['Astro', 'Tailwind', 'Vercel'],
    href: 'https://github.com/Juanmendo13/CopisteriaCentral',
    image: '/portfolio/work-1.jpg',
    year: '2026',
  },
  {
    slug: 'pizzeria-formula-1',
    name: 'Pizzería Formula 1',
    client: 'Hostelería',
    summary:
      'Carta, pedidos y presencia digital para una pizzería. Enfoque en móvil y conversión desde el mostrador.',
    stack: ['Astro', 'Resend'],
    href: 'https://github.com/Juanmendo13/pizzeria-formula-1',
    image: '/portfolio/work-2.jpg',
    year: '2025',
  },
  {
    slug: 'pitteri',
    name: 'Pitteri 56',
    client: 'Milano',
    summary:
      'Web y comandería del bar Pitteri 56. Flujo de pedidos pensado para el ritmo del local.',
    stack: ['JavaScript', 'Node'],
    href: 'https://github.com/Juanmendo13/piteri',
    image: '/portfolio/work-3.jpg',
    year: '2025',
  },
  {
    slug: 'ferreteria-yelamo',
    name: 'Ferretería Yélamo',
    client: 'Comercio local',
    summary:
      'Escaparate digital para ferretería: catálogo claro, contacto directo y carga rápida en móvil.',
    stack: ['TypeScript', 'React'],
    href: 'https://github.com/Juanmendo13/FerreteriaYelamo',
    image: '/portfolio/work-4.jpg',
    year: '2025',
  },
];
