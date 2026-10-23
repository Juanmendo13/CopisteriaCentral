/**
 * Proves FormSubmit from a real browser Origin (what the site forms use).
 * Requires playwright installed under %TEMP%/pw-web3-test (see earlier setup).
 */
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const require = createRequire(join(tmpdir(), 'pw-web3-test', 'package.json'));
const { chromium } = require('playwright');

const origin = 'https://copisteria-central.vercel.app';
const activated = process.argv[2]; // optional already-activated inbox
const gmail = 'bellamorenoeugenio820@gmail.com';

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  userAgent:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
});
const page = await context.newPage();
await page.goto(origin + '/contacto', { waitUntil: 'domcontentloaded', timeout: 60000 });

async function submit(to) {
  return page.evaluate(async (email) => {
    const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(email)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        name: 'Browser Proof',
        email: 'cliente@example.com',
        _subject: 'PROOF browser FormSubmit',
        message: 'Browser Origin proof from /contacto',
      }),
    });
    return { status: res.status, body: await res.json().catch(() => ({})) };
  }, to);
}

if (activated) {
  const r = await submit(activated);
  console.log('activated_inbox', JSON.stringify(r, null, 2));
  if (String(r.body.success) !== 'true') {
    console.error('FAIL: expected success:true for activated inbox');
    await browser.close();
    process.exit(1);
  }
  console.log('OK: browser FormSubmit success:true (not 403)');
}

const g = await submit(gmail);
console.log('gmail', JSON.stringify(g, null, 2));
await browser.close();

if (String(g.body.success) === 'true') {
  console.log('OK: Gmail FormSubmit fully live');
  process.exit(0);
}

if (/activat/i.test(String(g.body.message || ''))) {
  console.log(
    'PENDING: Gmail registered; click Activate Form in that inbox once, then browser sends succeed.',
  );
  process.exit(activated ? 0 : 2);
}

console.error('FAIL unexpected Gmail response');
process.exit(1);
