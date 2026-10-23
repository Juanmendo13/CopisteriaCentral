/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly ADMIN_USER?: string;
  readonly ADMIN_PASSWORD?: string;
  readonly ADMIN_SESSION_SECRET?: string;
  readonly ADMIN_SECRET?: string;
  readonly BLOB_READ_WRITE_TOKEN?: string;
  readonly PEDIDOS_EMAIL?: string;
  readonly SITE_URL?: string;
  readonly WEB3FORMS_ACCESS_KEY?: string;
  readonly RESEND_API_KEY?: string;
  readonly RESEND_FROM?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare namespace App {
  interface Locals {
    adminUser?: string;
  }
}
