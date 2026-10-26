import { LANG_STORAGE_KEY, defaultLocale, ui, type UiKey } from '../i18n/messages';
import { sendWeb3Forms } from '../lib/client-web3forms';
import type { Locale } from '../data/projects';

type FormKind = 'negocios' | 'tech';

function isLocale(value: string | null): value is Locale {
  return value === 'es' || value === 'en' || value === 'it';
}

function currentLocale(): Locale {
  try {
    const stored = localStorage.getItem(LANG_STORAGE_KEY);
    if (isLocale(stored)) return stored;
  } catch {
    /* ignore */
  }
  return defaultLocale;
}

function msg(key: UiKey): string {
  const locale = currentLocale();
  return ui[locale][key] ?? ui.es[key];
}

function fieldValue(form: HTMLFormElement, name: string): string {
  const el = form.elements.namedItem(name);
  if (!el || !('value' in el)) return '';
  return String((el as HTMLInputElement).value ?? '').trim();
}

function setStatus(
  statusEl: HTMLElement,
  state: 'idle' | 'pending' | 'success' | 'error',
  text: string,
) {
  statusEl.dataset.state = state;
  statusEl.textContent = text;
  statusEl.hidden = state === 'idle' || !text;
  statusEl.classList.toggle('is-success', state === 'success');
  statusEl.classList.toggle('is-error', state === 'error');
  statusEl.classList.toggle('is-pending', state === 'pending');
}

function collectNegocios(form: HTMLFormElement) {
  return {
    email: fieldValue(form, 'email'),
    telefono: fieldValue(form, 'telefono'),
    nombreWeb: fieldValue(form, 'nombreWeb'),
    dias: Number(fieldValue(form, 'dias')),
    negocio: fieldValue(form, 'negocio'),
    website_url: fieldValue(form, 'website_url'),
  };
}

function collectTech(form: HTMLFormElement) {
  return {
    email: fieldValue(form, 'email'),
    nombre: fieldValue(form, 'nombre'),
    tipo: fieldValue(form, 'tipo'),
    stack: fieldValue(form, 'stack'),
    timeline: fieldValue(form, 'timeline'),
    scope: fieldValue(form, 'scope'),
    budget: fieldValue(form, 'budget'),
    github: fieldValue(form, 'github'),
    portfolio: fieldValue(form, 'portfolio'),
    website_url: fieldValue(form, 'website_url'),
  };
}

function errorKeyFor(kind: FormKind, code: string): UiKey {
  const map: Record<string, UiKey> = {
    email: kind === 'negocios' ? 'neg.form.err.email' : 'tech.form.err.email',
    telefono: 'neg.form.err.telefono',
    nombreWeb: 'neg.form.err.nombreWeb',
    dias: 'neg.form.err.dias',
    negocio: 'neg.form.err.negocio',
    tipo: 'tech.form.err.tipo',
    scope: 'tech.form.err.scope',
    nombre: 'tech.form.err.nombre',
    stack: 'tech.form.err.stack',
    timeline: 'tech.form.err.timeline',
    budget: 'tech.form.err.budget',
    github: 'tech.form.err.github',
    portfolio: 'tech.form.err.portfolio',
    config: kind === 'negocios' ? 'neg.form.err.config' : 'tech.form.err.config',
    invalid: kind === 'negocios' ? 'neg.form.err.generic' : 'tech.form.err.generic',
    network: kind === 'negocios' ? 'neg.form.err.generic' : 'tech.form.err.generic',
  };
  return map[code] ?? (kind === 'negocios' ? 'neg.form.err.generic' : 'tech.form.err.generic');
}

async function submitLead(kind: FormKind, form: HTMLFormElement, statusEl: HTMLElement) {
  const endpoint = kind === 'negocios' ? '/api/lead' : '/api/contact';
  const payload = kind === 'negocios' ? collectNegocios(form) : collectTech(form);
  const submitBtn = form.querySelector<HTMLButtonElement>('[type="submit"]');

  setStatus(
    statusEl,
    'pending',
    msg(kind === 'negocios' ? 'neg.form.pending' : 'tech.form.pending'),
  );
  if (submitBtn) submitBtn.disabled = true;

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = (await res.json().catch(() => ({}))) as {
      ok?: boolean;
      code?: string;
      via?: string;
      web3forms?: {
        accessKey: string;
        subject: string;
        message: string;
        replyTo: string;
        name: string;
        fromName: string;
      };
    };

    if (!res.ok || !data.ok) {
      setStatus(statusEl, 'error', msg(errorKeyFor(kind, data.code || 'invalid')));
      return;
    }

    if (data.web3forms?.accessKey) {
      const sent = await sendWeb3Forms(data.web3forms);
      if (!sent.ok) {
        // Resend backup may already have delivered
        if (data.via === 'web3forms+resend' || data.via === 'resend') {
          setStatus(
            statusEl,
            'success',
            msg(kind === 'negocios' ? 'neg.form.success' : 'tech.form.success'),
          );
          form.reset();
          return;
        }
        setStatus(statusEl, 'error', msg(errorKeyFor(kind, 'network')));
        return;
      }
    }

    setStatus(
      statusEl,
      'success',
      msg(kind === 'negocios' ? 'neg.form.success' : 'tech.form.success'),
    );
    form.reset();
  } catch {
    setStatus(statusEl, 'error', msg(errorKeyFor(kind, 'network')));
  } finally {
    if (submitBtn) submitBtn.disabled = false;
  }
}

function bindForm(form: HTMLFormElement) {
  const kind = form.dataset.leadForm as FormKind | undefined;
  if (kind !== 'negocios' && kind !== 'tech') return;
  const statusEl = form.querySelector<HTMLElement>('[data-lead-status]');
  if (!statusEl) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    void submitLead(kind, form, statusEl);
  });
}

function init() {
  document.querySelectorAll<HTMLFormElement>('form[data-lead-form]').forEach(bindForm);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
