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

Buzón objetivo: `bellamorenoeugenio820@gmail.com` (`PEDIDOS_EMAIL` / `site.inboxEmail`).

### Estado actual (listo)

- `WEB3FORMS_ACCESS_KEY` en Vercel apunta a la key creada con el Gmail de la tienda (`5fc29db1…903f`).
- `WEB3FORMS_GMAIL_READY=1` en Production / Preview / Development.
- `PEDIDOS_EMAIL` = `bellamorenoeugenio820@gmail.com`.

**Qué hacer ahora:** hard-refresh de `/pedido`, enviar un pedido de prueba y revisar Inbox + Spam de ese Gmail.

### Por qué a veces aparece Outlook

1. **Resend (copia de seguridad)** usa `onboarding@resend.dev` en modo prueba → solo entrega a `pizzeriaformula1@outlook.es`. Eso funciona y no es el canal primario.
2. **Web3Forms (primario)** entrega al email con el que se creó la Access Key. Keys antiguas (p. ej. A0) ligadas a Outlook no sirven para Gmail.
3. FormSubmit quedó descartado (Activate Form caduca / Gmail lo previsualiza → “Not a valid link”).

### Si hay que rotar la key

1. https://web3forms.com/ → Create Access Key con `bellamorenoeugenio820@gmail.com`
2. Actualiza `WEB3FORMS_ACCESS_KEY` en Vercel (todas las envs) y deja `WEB3FORMS_GMAIL_READY=1`
3. Redeploy y prueba un pedido

### Cableado actual

| Canal | Quién envía | Destino |
| --- | --- | --- |
| Primario | Navegador → `api.web3forms.com` | Email ligado a `WEB3FORMS_ACCESS_KEY` |
| Copia de seguridad | Servidor → Resend | `PEDIDOS_FALLBACK_EMAIL` / Outlook de prueba |
