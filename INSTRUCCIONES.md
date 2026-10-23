# Instrucciones — Copistería Central

## Origen

Clonado y adaptado desde `a0-impresiones`. Marca, dirección, teléfono, horario y textos de Reina Mercedes actualizados. Catálogo de servicios/precios e imágenes siguen siendo plantilla hasta visitar el local.

## Hecho

- `src/lib/site.ts` con datos de Copistería Central.
- Navbar / hero / footer / emails / banner de prototipo.
- Enlace a Google Maps como ficha pública (no tienen web).

## Por confirmar en el local

- Titular y CIF (aviso legal / privacidad).
- Email de pedidos.
- WhatsApp (el fijo 954 puede no tener).
- Fotos reales (sustituir `/public/galeria/`).
- Qué servicios ofrecen de verdad (gran formato, plotter, etc.).
- Precios del mostrador.

## Demo / Resend

Formularios van al buzón `PEDIDOS_EMAIL` (hoy `bellamorenoeugenio820@gmail.com`).

Con `RESEND_FROM=…<onboarding@resend.dev>` Resend solo entrega al email de prueba de la
cuenta Resend (`pizzeriaformula1@outlook.es`), no al Gmail. Los envíos a Gmail fallan
hasta verificar un dominio en https://resend.com/domains y cambiar `RESEND_FROM` a ese dominio.
