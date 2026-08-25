export interface Servicio {
  slug: string;
  title: string;
  short: string;
  formats?: string[];
  items: string[];
  body: string;
  extra?: string[];
  /** Tarjeta destacada en el grid (fondo azul suave, icono). */
  featured?: boolean;
  /** Ocupa todo el ancho del grid (3 columnas). */
  fullWidth?: boolean;
}

export const servicios: Servicio[] = [
  {
    slug: 'papeleria',
    title: 'Venta de papelería',
    short: 'Bolígrafos, libretas, carpetas, grapadoras y más. Catálogo completo con precios.',
    items: [
      'Escritura y corrección',
      'Cuadernos, blocs y folios',
      'Archivo y carpetas',
      'Corte, adhesivos y clips',
      'Reglas, grapadoras y calculadoras',
      'Embalaje, sobres y pendrives',
    ],
    body: 'Zona de venta del local: material de escritorio y oficina. Consulta el catálogo online, añade a tu lista y reserva o recoge en mostrador. Precios orientativos; el stock se confirma en tienda.',
    extra: [
      'Abre el catálogo completo en /venta para precios y lista de compra.',
      'El surtido concreto puede variar según temporada.',
    ],
    featured: true,
    fullWidth: true,
  },
  {
    slug: 'fotocopias',
    title: 'Fotocopias',
    short: 'Blanco y negro y color, en los formatos de trabajo diario.',
    formats: ['A5', 'A4', 'A3'],
    items: ['Fotocopias B/N', 'Fotocopias color', 'A5, A4 y A3'],
    body: 'Fotocopias en blanco y negro y color para apuntes, dossiers, trámites y copias de última hora. Formatos A5, A4 y A3, con acabado nítido y entrega inmediata en el local.',
  },
  {
    slug: 'impresiones-pequeno-formato',
    title: 'Impresiones pequeño formato',
    short: 'Tarjetas, invitaciones, flyers, fotos y papeles especiales hasta SRA3.',
    formats: ['A6', 'A5', 'A4', 'A3', 'SRA3', 'Personalizado'],
    items: [
      'Tarjetas de visita',
      'Tarjetas de boda, seating, meseros y place',
      'Invitaciones y Christmas',
      'Folletos, flyers y cuadernillos',
      'Carpetas, etiquetas y sobres',
      'Adhesivos, pegatinas y acetato',
      'Papel vegetal y poliéster',
      'Fotos',
    ],
    body: 'Impresión de pequeño formato para identidad, eventos y material promocional. Trabajamos A6, A5, A4, A3, SRA3 y medidas personalizadas, sobre papeles convencionales y especiales.',
  },
  {
    slug: 'impresiones-gran-formato',
    title: 'Impresiones gran formato',
    short: 'Planos A3–A0, carteles, fotos y póster científicos en tela y papel.',
    formats: ['A3', 'A2', 'A1', 'A0', 'Personalizado'],
    featured: true,
    items: [
      'Planos B/N y color (A3–A0 y personalizados)',
      'Carteles y fotos',
      'Póster científicos en tela y papeles',
      'Vinilos y lonas',
      'Materiales rígidos: aluminio, metacrilato, forex…',
    ],
    body: 'Gran formato pensado para arquitectura, investigación y comunicación visual. Planos hasta A0, póster de congresos, carteles y soportes rígidos o flexibles según el uso (interior, exterior, exposición).',
  },
  {
    slug: 'escaner',
    title: 'Escáner',
    short: 'Digitalización de documentos y originales hasta A3.',
    formats: ['A3', 'A4', 'A5 y menores'],
    items: ['Escaneo A3', 'Escaneo A4', 'Formatos más pequeños'],
    body: 'Escaneamos originales en A3, A4 y formatos menores para archivo digital, envío o reimpresión. Útil para planos antiguos, apuntes, fotos y documentación de proyectos.',
  },
  {
    slug: 'encuadernaciones',
    title: 'Encuadernaciones',
    short: 'Espiral metálica, channel de tapa dura, revistas, libros, catálogos y tesis.',
    formats: ['A5', 'A4', 'A3'],
    items: [
      'Espiral metálica A5, A4 y A3',
      'Channel (tapa dura) A4',
      'Revistas, libros y catálogos',
      'Tesis',
    ],
    body: 'Encuadernación para trabajos académicos y publicaciones: espiral metálica en A5, A4 y A3, y channel de tapa dura en A4. Ideal para TFG, tesis, catálogos y dossiers de presentación.',
  },
  {
    slug: 'plastificados-laminados',
    title: 'Plastificados y laminados',
    short: 'Protección mate o brillo: plastificado hasta A3 y laminado hasta 1 m de ancho.',
    items: ['Plastificados hasta A3', 'Laminado mate o brillo hasta 1 m de ancho'],
    body: 'Protegemos impresiones de uso frecuente o exposición. Plastificado hasta A3 y laminado mate o brillo hasta 1 metro de ancho, para planos, carteles, menús y material de mostrador.',
  },
  {
    slug: 'montaje-carton-pluma',
    title: 'Montaje en cartón pluma adhesivo',
    short: 'Póster, planos, carteles y fotos listos para colgar o presentar.',
    items: ['Póster científicos', 'Planos', 'Carteles', 'Fotos'],
    body: 'Montaje sobre cartón pluma adhesivo para que el trabajo salga rígido, plano y presentable. Muy usado en póster de congresos, entregas de proyecto y exposiciones.',
  },
  {
    slug: 'venta-carton-pluma',
    title: 'Venta de cartón pluma',
    short: 'Planchas de 3, 5 y 10 mm en blanco, negro y kraft.',
    items: ['Espesores 3, 5 y 10 mm', 'Colores blanco, negro y kraft', 'Varios tamaños'],
    body: 'Venta de cartón pluma en distintos espesores y acabados para maquetas, montajes y señalética. Consulta medidas disponibles en el local o pide presupuesto.',
  },
  {
    slug: 'grabacion-cd-dvd',
    title: 'Grabación CD/DVD',
    short: 'Copia de discos con pegatina redonda para entrega o archivo.',
    items: ['Grabación CD/DVD', 'Pegatina redonda'],
    body: 'Grabación de CD o DVD con etiqueta circular impresa. Pensado para entregas, copias de seguridad y archivos que aún se piden en soporte óptico.',
  },
  {
    slug: 'diseno-grafico',
    title: 'Diseño gráfico',
    short: 'Apoyo para carteles, papelería, invitaciones y piezas listas para imprimir.',
    items: ['Cartelería y flyers', 'Papelería e invitaciones', 'Ajustes de archivo para impresión'],
    body: 'Si el archivo no está cerrado o necesitas una pieza sencilla (flyer, invitación, cartel, tarjeta), te ayudamos a dejarlo listo para imprimir. Cuéntanos formato, cantidad y fecha de entrega.',
  },
];

export function getServicio(slug: string): Servicio | undefined {
  return servicios.find((s) => s.slug === slug);
}
