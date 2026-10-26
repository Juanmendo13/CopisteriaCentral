# juanmendo — Portfolio

Portfolio personal cyberpunk: **https://juanmendo.dev** (canónico).  
`juanmendo.com` redirige 301 → `juanmendo.dev`.

- `/` — perfil técnico (APIs, stack, FE/BE)
- `/negocios` — página para dueños de locales (lenguaje humano + formulario)

## Stack

- Astro 7 + Tailwind 4 + Vercel (SSR adapter; pages prerendered, `/api/*` serverless)
- Marca **juanmendo**; presentación personal (“Juan…”) solo en Sobre mí
- UI en español (default) con conmutador **ES / EN / IT** (persistido en `localStorage`)
- Tipografía: Oxanium, Rajdhani, Share Tech Mono

## Formularios → email de Juan

| Ruta | API | Audiencia |
|------|-----|-----------|
| `/negocios` | `POST /api/lead` | Dueños de locales |
| `/` `#contacto` | `POST /api/contact` | Audiencia técnica |

Patrón: validación en servidor → payload **Web3Forms** para el navegador (+ **Resend** opcional como respaldo). Misma idea que Copistería Central.

### Variables en Vercel (`juan-portfolio`)

| Variable | Requerida | Notas |
|----------|-----------|-------|
| `WEB3FORMS_ACCESS_KEY` | Sí* | Crear en [web3forms.com](https://web3forms.com/) con el Gmail de Juan |
| `LEAD_EMAIL` | No | Default `jmendozadame@gmail.com` (`CONTACT_EMAIL` / `PEDIDOS_EMAIL` también sirven) |
| `RESEND_API_KEY` | No | Respaldo server-side |
| `RESEND_FROM` | No | Default `juanmendo <onboarding@resend.dev>` |

\*Si falta Web3Forms pero hay Resend, el envío puede ir solo por Resend.

## Desarrollo

```bash
pnpm install
pnpm astro dev
```

## Build

```bash
pnpm build
pnpm preview
```

## Dominios

Proyecto Vercel: `juan-portfolio`. Si DNS está en Cloudflare, apunta el apex a los registros recomendados por Vercel (A/CNAME).
