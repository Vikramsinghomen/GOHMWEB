/**
 * Injects the keyword-targeted FAQs from faq-keywords.js into each page, keeping
 * the visible .faq-list accordion and the FAQPage JSON-LD in sync.
 *
 * Existing questions are matched by normalised text; anything already present is
 * skipped, so this script is safe to re-run.
 *
 * Usage: node tools/inject-faq-keywords.js
 */
const fs = require('fs');
const path = require('path');

const REPO = path.join(__dirname, '..', 'GOHMWEB-Repo');
const additions = require('./faq-keywords.js');

const norm = (s) => s.replace(/\s+/g, ' ').replace(/&amp;/g, '&').trim().toLowerCase();
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function findFaqList(html) {
  const start = html.indexOf('<div class="faq-list">');
  if (start === -1) return null;
  // Walk forward counting div depth to find the matching close tag
  const open = /<div\b/g;
  const close = /<\/div>/g;
  let depth = 0, i = start;
  const re = /<div\b[^>]*>|<\/div>/g;
  re.lastIndex = start;
  let m;
  while ((m = re.exec(html)) !== null) {
    depth += m[0] === '</div>' ? -1 : 1;
    if (depth === 0) { i = m.index + m[0].length; break; }
  }
  return { open: start, close: i, inner: html.slice(start, i) };
}

let touched = 0, addedTotal = 0, skipped = 0;

Object.entries(additions).forEach(([file, items]) => {
  const full = path.join(REPO, file);
  if (!fs.existsSync(full)) { console.warn('SKIP (missing file): ' + file); return; }
  let html = fs.readFileSync(full, 'utf8');
  const original = html;

  // ---------- 1. visible accordion ----------
  const list = findFaqList(html);
  if (!list) { console.warn('SKIP (no .faq-list): ' + file); return; }
  const existingQ = [...list.inner.matchAll(/<button class="faq-q">([\s\S]*?)<span/g)]
    .map((m) => norm(m[1]));

  let visibleAdd = '';
  items.forEach((it) => {
    if (existingQ.includes(norm(it.q))) { skipped++; return; }
    visibleAdd +=
      '\n                        <div class="faq-item">\n' +
      '                            <button class="faq-q">' + esc(it.q) + '<span class="faq-toggle">+</span></button>\n' +
      '                            <div class="faq-a">\n' +
      '                                <p>' + esc(it.a) + '</p>\n' +
      '                            </div>\n' +
      '                        </div>';
    addedTotal++;
  });
  if (visibleAdd) {
    html = html.slice(0, list.close - '</div>'.length) + visibleAdd + html.slice(list.close - '</div>'.length);
  }

  // ---------- 2. FAQPage JSON-LD ----------
  const ldRe = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
  let m, out = '', lastEnd = 0, patched = false;
  while ((m = ldRe.exec(html)) !== null) {
    let data;
    try { data = JSON.parse(m[1]); } catch (e) { continue; }
    const nodes = Array.isArray(data) ? data : (data['@graph'] || [data]);
    const faq = nodes.find((n) => n && n['@type'] === 'FAQPage');
    if (!faq) continue;

    const have = new Set(faq.mainEntity.map((e) => norm(e.name)));
    const newOnes = items.filter((it) => !have.has(norm(it.q)));
    if (!newOnes.length) continue;

    newOnes.forEach((it) => {
      faq.mainEntity.push({ '@type': 'Question', name: it.q, acceptedAnswer: { '@type': 'Answer', text: it.a } });
    });
    out += html.slice(lastEnd, m.index);
    out += '<script type="application/ld+json">\n    ' + JSON.stringify(data, null, 4).replace(/\n/g, '\n    ') + '\n    </script>';
    lastEnd = m.index + m[0].length;
    patched = true;
  }
  if (patched) out += html.slice(lastEnd);

  if (html !== original) {
    fs.writeFileSync(full, out || html, 'utf8');
    touched++;
    console.log('updated: ' + file + ' (+' + items.length + ' keyword FAQs)');
  } else {
    console.log('no change needed: ' + file);
  }
});

console.log('\nfiles touched: ' + touched + ' | new FAQ entries: ' + addedTotal + ' | already present: ' + skipped);
