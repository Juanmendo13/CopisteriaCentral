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

Resend con `onboarding@resend.dev` **no puede** enviar a Gmail (403). FormSubmit quedó descartado: el enlace “Activate Form” suele caducar o invalidarse (Gmail lo previsualiza) y responde “Not a valid link”.

**Camino actual (primario):** el **navegador** envía con Web3Forms al Gmail ligado a `WEB3FORMS_ACCESS_KEY` (la key es pública por diseño; no hay enlace “Activate Form”).

1. Abre https://web3forms.com/
2. Create Access Key con `bellamorenoeugenio820@gmail.com`
3. Copia la key del correo (revisa Spam / Promociones)
4. En Vercel → Settings → Environment Variables, actualiza `WEB3FORMS_ACCESS_KEY` (Production / Preview / Development) y redeploy
5. Prueba desde el sitio (Contacto / Pedido) o `POST /api/notify-health` y luego envía el payload `web3forms` a `https://api.web3forms.com/submit`

**Importante:** la key debe crearse **con ese Gmail**. Si la key apunta a otro correo, Gmail no recibirá nada.

**Respaldo:** Resend deja copia en `pizzeriaformula1@outlook.es`.

**No uses FormSubmit:** el enlace Activate Form suele salir “Not a valid link” (caduca o Gmail lo previsualiza).
