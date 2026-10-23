## Development

Node.js 22 and pnpm are required. Install from the lockfile:

```
pnpm install --frozen-lockfile
```

Copy `.env.example` to `.env.local` for local defaults. Pages render without API keys. Sending presupuesto or pedido email needs `RESEND_API_KEY`, file upload needs `BLOB_READ_WRITE_TOKEN`, and the contact form needs `WEB3FORMS_ACCESS_KEY`.

When starting the dev server, use background mode:

```
astro dev --background --host 0.0.0.0 --port 4321
```

The Cloud Agent environment already starts that server. Manage it with `astro dev stop`, `astro dev status`, and `astro dev logs`. It listens at http://127.0.0.1:4321/.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
