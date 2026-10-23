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

## Email de pedidos (Outlook)

Buzón único: `pizzeriaformula1@outlook.es` (`PEDIDOS_EMAIL` / `site.inboxEmail`).

### Estado actual

- Canal primario: **Resend** → Outlook (`onboarding@resend.dev` en modo prueba).
- `PEDIDOS_EMAIL` = `pizzeriaformula1@outlook.es` en Production / Preview / Development.
- Web3Forms es **opcional** y solo se usa si `WEB3FORMS_ACCESS_KEY` es la key Outlook-bound (p. ej. A0). Keys ligadas a Gmail se ignoran.

**Qué hacer ahora:** hard-refresh de `/pedido`, enviar un pedido de prueba y revisar Inbox + Spam de ese Outlook.

### Cableado

| Canal | Quién envía | Destino |
| --- | --- | --- |
| Primario | Servidor → Resend | `PEDIDOS_EMAIL` / Outlook |
| Secundario (opcional) | Navegador → Web3Forms | Solo si la key es Outlook-bound |

### Si quieres Web3Forms como refuerzo

1. Usa la Access Key de Outlook del proyecto hermano A0 (`WEB3FORMS_ACCESS_KEY` Outlook-bound), **o** crea una nueva en https://web3forms.com/ con `pizzeriaformula1@outlook.es`.
2. No uses keys creadas con Gmail: el código las descarta para no avisar al buzón antiguo.
