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

**Camino actual (primario):** Web3Forms → Gmail ligado a `WEB3FORMS_ACCESS_KEY`.

1. Abre https://web3forms.com/
2. Create Access Key con `bellamorenoeugenio820@gmail.com`
3. Copia la key del correo (revisa Spam)
4. En Vercel → Project → Settings → Environment Variables, pon `WEB3FORMS_ACCESS_KEY` (Production / Preview / Development) y redeploy
5. Prueba: `POST https://copisteria-central.vercel.app/api/notify-health` → debe devolver `"via":"web3forms"`

**Respaldo:** Resend deja copia en `pizzeriaformula1@outlook.es` si Web3Forms falla.
