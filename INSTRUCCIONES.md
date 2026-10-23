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

## Email de pedidos (Gmail) — acción tuya

Buzón objetivo: `bellamorenoeugenio820@gmail.com` (`PEDIDOS_EMAIL` / `site.inboxEmail`).

### Por qué llega a Outlook y no a Gmail

1. **Resend (copia de seguridad)** usa `onboarding@resend.dev` en modo prueba → solo entrega a `pizzeriaformula1@outlook.es`. Eso funciona y no es el canal primario.
2. **Web3Forms (primario)** entrega al email con el que se creó la Access Key. La key copiada de A0 está ligada a Outlook, así que un “éxito” de Web3Forms también cae en Outlook, no en Gmail.
3. FormSubmit quedó descartado (Activate Form caduca / Gmail lo previsualiza → “Not a valid link”).

### Qué tienes que hacer para Gmail (obligatorio)

No se puede inventar una Access Key: hay que crearla en web3forms.com con el Gmail de la tienda.

1. Abre https://web3forms.com/
2. **Create Access Key** con exactamente `bellamorenoeugenio820@gmail.com`
3. Copia la key del correo (revisa Spam / Promociones)
4. Vercel → Settings → Environment Variables:
   - `WEB3FORMS_ACCESS_KEY` = la key nueva (Production / Preview / Development)
   - `PEDIDOS_EMAIL` = `bellamorenoeugenio820@gmail.com`
   - `WEB3FORMS_GMAIL_READY` = `1` (confirma que la key es del Gmail de la tienda)
5. Redeploy
6. Prueba un pedido/contacto: el mensaje de éxito completo solo aparece si `WEB3FORMS_GMAIL_READY=1` y Web3Forms responde OK. Si solo hay copia Outlook, la web lo dice claramente.

### Cableado actual

| Canal | Quién envía | Destino |
| --- | --- | --- |
| Primario | Navegador → `api.web3forms.com` | Email ligado a `WEB3FORMS_ACCESS_KEY` |
| Copia de seguridad | Servidor → Resend | `PEDIDOS_FALLBACK_EMAIL` / Outlook de prueba |

**Importante:** hasta el paso 4–5, no afirmamos entrega a Gmail aunque Outlook reciba avisos.
