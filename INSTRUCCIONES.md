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

Resend con `onboarding@resend.dev` **no puede** enviar a Gmail (403). Por eso:

1. El **navegador** envía el aviso con **FormSubmit** a ese Gmail (manda `Origin` del sitio).
2. El **servidor** deja una copia de respaldo en el buzón de prueba Resend (`pizzeriaformula1@outlook.es`).

**Primera vez (ya hecho):** en Gmail, abrir el correo de FormSubmit (“Activate Form” / “Action Required”) y pulsar el enlace (revisar Spam / Promociones). Después, FormSubmit responde `success: true` y los pedidos llegan al Gmail.

**Web3Forms no se usa:** Cloudflare bloquea muchas llamadas (incluso desde el navegador en este entorno) y la key no sustituye a FormSubmit una vez activado.
