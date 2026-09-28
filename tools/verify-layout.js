// Structural sanity check across all pages after the header/footer rebuild.
// Usage: node tools/verify-layout.js
const fs = require('fs');
const path = require('path');

const REPO = path.join(__dirname, '..', 'GOHMWEB-Repo');
const files = fs.readdirSync(REPO).filter((f) => f.endsWith('.html'));

let bad = 0;
const fail = (f, t) => { bad++; console.log('  FAIL ' + f + ' :: ' + t); };

files.forEach((f) => {
  const h = fs.readFileSync(path.join(REPO, f), 'utf8');

  // Header: links row must come before the brand row, and JS hooks must survive
  if (!(h.indexOf('class="nav-links"') < h.indexOf('class="nav-brand"'))) fail(f, 'nav-links before nav-brand');
  if (!h.includes('id="navLinks"')) fail(f, 'missing #navLinks (JS hook)');
  if (!h.includes('id="navToggle"')) fail(f, 'missing #navToggle (JS hook)');

  // Footer: 4-col grid present, 3 link columns, badges + copyright preserved
  if (!h.includes('class="footer-grid"')) fail(f, 'missing .footer-grid');
  if ((h.match(/class="footer-col"/g) || []).length !== 3) fail(f, 'expected 3 .footer-col');
  if (!h.includes('footer-badges')) fail(f, 'footer badges lost');
  if (!h.includes('footer-copy')) fail(f, 'footer copy lost');

  // Tag balance
  ['div', 'section', 'main', 'ul', 'nav', 'footer', 'header', 'button', 'a', 'p', 'body'].forEach((t) => {
    const o = (h.match(new RegExp('<' + t + '\\b', 'g')) || []).length;
    const c = (h.match(new RegExp('</' + t + '>', 'g')) || []).length;
    if (o !== c) fail(f, 'unbalanced <' + t + '> ' + o + '/' + c);
  });

  // JSON-LD still parses
  [...h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].forEach((x, i) => {
    try { JSON.parse(x[1]); } catch (e) { fail(f, 'bad JSON-LD #' + i + ': ' + e.message); }
  });
});

console.log(bad
  ? '\nISSUES: ' + bad
  : '\nALL ' + files.length + ' PAGES OK - structure, tag balance and JSON-LD clean');
