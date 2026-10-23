# Instrucciones — Copistería Central

## Origen

Clonado y adaptado desde `a0-impresiones`. Marca, dirección, teléfono, horario y textos de Reina Mercedes actualizados. Catálogo de servicios/precios e imágenes siguen siendo plantilla hasta visitar el local.

## Hecho

- `src/lib/site.ts` con datos de Copistería Central.
- Navbar / hero / footer / emails / banner de prototipo.
- Enlace a Google Maps como ficha pública (no tienen web).

## Por confirmar en el local

- Titular y CIF (aviso legal / privacidad).
- WhatsApp (el fijo 954 puede no tener).
- Fotos reales (sustituir `/public/galeria/`).
- Qué servicios ofrecen de verdad (gran formato, plotter, etc.).
- Precios del mostrador.

## Email de pedidos (Gmail)

Buzón: `bellamorenoeugenio820@gmail.com` (`PEDIDOS_EMAIL` / `site.inboxEmail`).

Los avisos (pedido con PDF, carrito, presupuesto contacto) van por **FormSubmit** a ese Gmail.
No hace falta dominio verificado en Resend.

**Un solo paso la primera vez:** FormSubmit manda un correo “Activate Form” / “Action Required” a ese Gmail.
Hay que abrir el enlace una vez (revisar Spam / Promociones). Después, los envíos responden `success: true` y llegan al inbox.
