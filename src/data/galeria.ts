/**
 * Galería de Copistería Central.
 * Fotos A0 eliminadas a propósito. Hero = póster de marca en repo (PNG/JPG reales).
 */
export const fotos = [
  {
    image: '/galeria/hero-brand.jpg',
    alt: 'Póster de marca Copistería Central — Reina Mercedes, Sevilla',
  },
] as const;

/** Asset real en public/galeria (generado con sharp). No usar SVG stub. */
export const heroImage = '/galeria/hero-brand.jpg';
export const heroAlt = 'Copistería Central — póster de marca, Reina Mercedes, Sevilla';
