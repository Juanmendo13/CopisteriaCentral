# Copistería Central

Propuesta de web para **Copistería Central** (Av. Reina Mercedes 41, Sevilla). Adaptada desde el demo de [A0 Impresiones](https://github.com/Juanmendo13/a0-impresiones). El local **no tiene web propia**; la ficha pública está en [Google Maps](https://www.google.com/maps/place/Copister%C3%ADa+Central/@37.3587595,-5.9861024,17z).

## Datos usados (fuentes públicas)

| Campo | Valor | Estado |
|-------|--------|--------|
| Nombre | Copistería Central | Confirmado |
| Dirección | Av. Reina Mercedes 41, Local B, 41012 Sevilla | Confirmado |
| Teléfono | +34 954 62 53 84 | Confirmado (directorios) |
| Horario L–J | 9:00 – 20:30 | Confirmado (directorios) |
| Horario V | 9:00 – 14:00 / 16:30 – 20:30 | Confirmado |
| Horario S | 9:30 – 13:30 | Confirmado |
| Email / CIF / titular legal | — | **Pendiente** |
| Fotos del local | Placeholders de A0 | **Pendiente** |
| Precios reales | Catálogo orientativo | **Pendiente** |
| WhatsApp / redes | — | **Pendiente** (el 954 es fijo) |

## Stack

Astro 7 + Tailwind 4 + Resend + Vercel Blob + Web3Forms. Mismo flujo que A0: catálogo, pedido con PDF, precios y contacto.

## Desarrollo

```bash
pnpm install
copy .env.example .env.local
pnpm astro dev
```

## Pendiente con el cliente

1. Confirmar titular, CIF y email real.
2. Fotos de fachada e interior.
3. Lista de servicios y precios reales (quitar lo que no ofrezcan).
4. Móvil / WhatsApp si lo tienen.
5. Desplegar en Vercel y enseñar la demo en el local.
