import ventaImagesManifest from './venta-images.json';

export type VentaImageMeta = {
  file: string;
  source: string;
  title: string;
  creator: string;
  license: string;
  provider: string;
};

const ventaImages = ventaImagesManifest as Record<string, VentaImageMeta>;

export function getVentaImage(id: string): string {
  return ventaImages[id]?.file ?? `/venta/${id}.jpg`;
}

export function getVentaImageMeta(id: string): VentaImageMeta | undefined {
  return ventaImages[id];
}
