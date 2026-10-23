export const site = {
  name: 'Copistería Central',
  shortName: 'CC',
  tagline: 'Copistería en Reina Mercedes',
  description:
    'Copistería en Sevilla, Av. Reina Mercedes 41: fotocopias, impresión, encuadernación, plastificados y papelería junto al campus universitario.',
  /** Titular y CIF pendientes de confirmar con el local. */
  titular: 'Copistería Central',
  cif: 'Pendiente',
  address: 'Av. Reina Mercedes 41, Local B, 41012 Sevilla',
  addressLine: 'Av. Reina Mercedes 41, Local B',
  postalCity: '41012 Sevilla',
  landmark: 'Reina Mercedes · junto a ETSII',
  phone: '+34 954 62 53 84',
  phoneHref: 'tel:+34954625384',
  /** El fijo puede no tener WhatsApp; se usa el mismo número hasta confirmar móvil. */
  whatsappHref: 'https://wa.me/34954625384',
  whatsappNumber: '34954625384',
  shopPhone: '+34 954 62 53 84',
  shopPhoneHref: 'tel:+34954625384',
  /** Sin correo público por ahora. */
  email: '',
  isPrototype: true,
  /**
   * Buzón de pedidos (fallback si falta PEDIDOS_EMAIL).
   * Los avisos van por FormSubmit (navegador) a este Gmail.
   */
  inboxEmail: 'bellamorenoeugenio820@gmail.com',
  privacyEmail: '',
  currentWeb:
    'https://www.google.com/maps/place/Copister%C3%ADa+Central/@37.3587595,-5.9861024,17z',
  url: 'https://copisteria-central.vercel.app',
  mapsUrl:
    'https://www.google.com/maps/place/Copister%C3%ADa+Central/@37.3587595,-5.9861024,17z/data=!3m1!4b1!4m6!3m5!1s0xd126dd4d907b5d7:0x77fa599946b81bf0!8m2!3d37.3587595!4d-5.9861024!16s%2Fg%2F11g6rkshy9',
  mapsEmbed:
    'https://maps.google.com/maps?q=Copister%C3%ADa+Central,+Av.+Reina+Mercedes+41,+41012+Sevilla&hl=es&z=17&output=embed',
  hours: [
    { days: 'Lunes a jueves', hours: '9:00 – 20:30' },
    { days: 'Viernes', hours: '9:00 – 14:00 / 16:30 – 20:30' },
    { days: 'Sábados', hours: '9:30 – 13:30' },
    { days: 'Domingos', hours: 'Cerrado' },
  ],
  social: {
    facebook: '',
    instagram: '',
    linkedin: '',
  },
} as const;

/** Deep link de WhatsApp con texto prellenado (pedidos, consultas, errores). */
export function whatsappLink(message: string): string {
  const text = encodeURIComponent(message.trim());
  return `https://wa.me/${site.whatsappNumber}?text=${text}`;
}

export type Site = typeof site;
