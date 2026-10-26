import { projects, type Locale } from '../data/projects';
import { defaultLocale, LANG_STORAGE_KEY, locales, t, type UiKey, ui } from '../i18n/messages';

function isLocale(value: string | null): value is Locale {
  return value === 'es' || value === 'en' || value === 'it';
}

function readStored(): Locale {
  try {
    const stored = localStorage.getItem(LANG_STORAGE_KEY);
    if (isLocale(stored)) return stored;
  } catch {
    /* ignore */
  }
  return defaultLocale;
}

function writeStored(locale: Locale) {
  try {
    localStorage.setItem(LANG_STORAGE_KEY, locale);
  } catch {
    /* ignore */
  }
}

function applyLocale(locale: Locale) {
  document.documentElement.lang = locale;

  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n as UiKey | undefined;
    if (!key || !(key in ui.es)) return;
    el.textContent = t(locale, key);
  });

  document.querySelectorAll<HTMLElement>('[data-i18n-attr]').forEach((el) => {
    const raw = el.dataset.i18nAttr;
    if (!raw) return;
    raw.split(',').forEach((pair) => {
      const [attr, key] = pair.split(':').map((s) => s.trim());
      if (!attr || !key || !(key in ui.es)) return;
      el.setAttribute(attr, t(locale, key as UiKey));
    });
  });

  document.querySelectorAll<HTMLElement>('[data-proj]').forEach((el) => {
    const slug = el.dataset.proj;
    const field = el.dataset.projField;
    if (!slug || !field) return;
    const project = projects.find((p) => p.slug === slug);
    if (!project) return;

    if (field === 'client') {
      el.textContent = project.client[locale];
      return;
    }
    if (field === 'pitch') {
      el.textContent = project.pitch[locale];
      return;
    }
    if (field === 'humanPitch') {
      el.textContent = project.humanPitch?.[locale] ?? project.pitch[locale];
      return;
    }
    if (field.startsWith('hb:')) {
      const i = Number(field.slice(3));
      const bullet = project.humanBullets?.[i];
      if (bullet) el.textContent = bullet[locale];
      return;
    }
    if (field.startsWith('demo:')) {
      const i = Number(field.slice(5));
      const demo = project.demos?.[i];
      if (demo) el.textContent = demo.label[locale];
      return;
    }
    if (field.startsWith('fe:')) {
      const i = Number(field.slice(3));
      if (project.frontend[i]) el.textContent = project.frontend[i][locale];
      return;
    }
    if (field.startsWith('be:')) {
      const i = Number(field.slice(3));
      if (project.backend[i]) el.textContent = project.backend[i][locale];
    }
  });

  document.querySelectorAll<HTMLButtonElement>('[data-lang]').forEach((btn) => {
    const active = btn.dataset.lang === locale;
    btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    btn.classList.toggle('is-active', active);
  });

  const meta = document.querySelector('meta[name="description"]');
  if (meta) {
    const key = (meta.getAttribute('data-i18n-meta') || 'meta.description') as UiKey;
    if (key in ui.es) meta.setAttribute('content', t(locale, key));
  }
}

function init() {
  let locale = readStored();
  applyLocale(locale);

  document.querySelectorAll<HTMLButtonElement>('[data-lang]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const next = btn.dataset.lang;
      if (!isLocale(next)) return;
      locale = next;
      writeStored(locale);
      applyLocale(locale);
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

export { locales, applyLocale };
