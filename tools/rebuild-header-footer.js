/**
 * Rebuilds the header nav and footer across every page in GOHMWEB-Repo:
 *
 *  1. Header becomes a two-row layout — row 1 is the full-width page link bar,
 *     row 2 holds the logo + company name in the right corner. This stops the
 *     11-item nav from overflowing and being clipped on the right.
 *
 *  2. Footer becomes a balanced 4-column grid (brand + Explore / Sciences / Legal)
 *     instead of `1fr auto`, which left a huge void on the left and one very tall
 *     single link column on the right.
 *
 * Each page keeps its OWN link set and hrefs (sub-pages already use index.html#anchor),
 * so this is safe to run across all pages.
 *
 * Usage: node tools/rebuild-header-footer.js
 */
const fs = require('fs');
const path = require('path');

const REPO = path.join(__dirname, '..', 'GOHMWEB-Repo');
const files = fs.readdirSync(REPO).filter((f) => f.endsWith('.html'));

const ind = (n) => ' '.repeat(n);

function escAttr(s) { return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;'); }

// ---------------------------------------------------------------- header
function rebuildHeader(html) {
  const navMatch = html.match(/<nav class="nav container">[\s\S]*?<\/nav>/);
  if (!navMatch) return null;
  const old = navMatch[0];

  const brandMatch = old.match(/<a href="[^"]*" class="nav-brand">[\s\S]*?<\/a>/);
  const taglineMatch = old.match(/<span class="nav-tagline">([\s\S]*?)<\/span>/);
  const brandHref = (brandMatch && (brandMatch[0].match(/href="([^"]*)"/) || [])[1]) || '#home';
  const tagline = taglineMatch ? taglineMatch[1].trim() : '';

  // Preserve this page's own nav links
  const links = [...old.matchAll(/<li><a href="([^"]*)">([\s\S]*?)<\/a><\/li>/g)]
    .map((m) => ({ href: m[1], label: m[2].trim() }));
  if (!links.length) return null;

  const linkHtml = links
    .map((l) => ind(16) + '<li><a href="' + escAttr(l.href) + '">' + l.label + '</a></li>')
    .join('\n');

  const next =
    '<nav class="nav container">\n' +
    ind(12) + '<!-- Row 1: page links (full width, wraps instead of clipping) -->\n' +
    ind(12) + '<ul class="nav-links" id="navLinks">\n' + linkHtml + '\n' + ind(12) + '</ul>\n' +
    ind(12) + '<!-- Row 2: logo + company name, right corner -->\n' +
    ind(12) + '<a href="' + escAttr(brandHref) + '" class="nav-brand">\n' +
    ind(16) + '<!-- 📝 EDIT HERE: small nav logo (uses processed transparent logos) -->\n' +
    ind(16) + '<span class="nav-logo">\n' +
    ind(20) + '<img src="assets/logo1-trim.png" alt="GreatOhm logo" class="nav-logo-a">\n' +
    ind(16) + '</span>\n' +
    (tagline ? ind(16) + '<span class="nav-tagline">' + tagline + '</span>\n' : '') +
    ind(12) + '</a>\n' +
    ind(12) + '<button class="nav-toggle" id="navToggle" aria-label="Menu" aria-expanded="false" aria-controls="navLinks"><span></span><span></span><span></span></button>\n' +
    ind(8) + '</nav>';

  return html.replace(old, next);
}

// ---------------------------------------------------------------- footer
const COLS = [
  { key: 'explore', title: 'Explore', match: /^(home|about us|our services|join us|contact|download|what is greatohm)/i },
  { key: 'sciences', title: 'Sciences', match: /^(astrology|numerology|tarot|vastu|palmistry|kundli|nakshatra|manglik|sade|lal|lo shu|shubh)/i },
  { key: 'legal', title: 'Legal', match: /^(privacy|terms|delete)/i }
];

function rebuildFooter(html) {
  const m = html.match(/<div class="container footer-inner">[\s\S]*?\n(\s*)<\/div>\s*<\/footer>/);
  if (!m) return null;
  const old = m[0];

  const brandBlock = (old.match(/<div class="footer-brand">[\s\S]*?<\/div>/) || [])[0] || '';
  const taglineText = (brandBlock.match(/<p>([\s\S]*?)<\/p>/) || [])[1] || '';

  const links = [...old.matchAll(/<li><a href="([^"]*)">([\s\S]*?)<\/a><\/li>/g)]
    .map((x) => ({ href: x[1], label: x[2].trim() }));

  // Badges contain no nested <div>, so a non-greedy match to the first </div> is exact.
  // NOTE: do not add a trailing lookahead here - the block may be followed by
  // .footer-copy, a comment, or the closing </div> depending on the page.
  const badges = (old.match(/<div class="footer-badges">[\s\S]*?<\/div>/) || [])[0] || '';
  const copy = (old.match(/<p class="footer-copy">[\s\S]*?<\/p>/) || [])[0] || '';

  const buckets = { explore: [], sciences: [], legal: [] };
  links.forEach((l) => {
    const col = COLS.find((c) => c.match.test(l.label));
    buckets[col ? col.key : 'explore'].push(l);
  });

  const colHtml = COLS.filter((c) => buckets[c.key].length).map((c) =>
    ind(12) + '<div class="footer-col">\n' +
    ind(16) + '<h4 class="footer-col-title">' + c.title + '</h4>\n' +
    ind(16) + '<ul class="footer-links">\n' +
    buckets[c.key].map((l) => ind(20) + '<li><a href="' + escAttr(l.href) + '">' + l.label + '</a></li>').join('\n') + '\n' +
    ind(16) + '</ul>\n' +
    ind(12) + '</div>'
  ).join('\n');

  const next =
    '<div class="container footer-inner">\n' +
    ind(12) + '<div class="footer-grid">\n' +
    ind(12) + '<!-- 📝 EDIT HERE: Footer brand + tagline -->\n' +
    ind(16) + '<div class="footer-brand">\n' +
    ind(20) + '<img src="assets/logo1-trim.png" alt="GreatOhm" class="footer-logo">\n' +
    ind(20) + '<p>' + taglineText + '</p>\n' +
    ind(16) + '</div>\n' +
    colHtml + '\n' +
    ind(12) + '</div>\n' +
    (badges ? badges + '\n' : '') +
    (copy ? ind(12) + copy + '\n' : '') +
    ind(8) + '</div>\n' +
    ind(4) + '</footer>';

  return html.replace(old, next);
}

let hCount = 0, fCount = 0;
files.forEach((f) => {
  const full = path.join(REPO, f);
  let html = fs.readFileSync(full, 'utf8');
  const before = html;

  const withHeader = rebuildHeader(html);
  if (withHeader) { html = withHeader; hCount++; }

  const withFooter = rebuildFooter(html);
  if (withFooter) { html = withFooter; fCount++; }

  if (html !== before) fs.writeFileSync(full, html, 'utf8');
});

console.log('headers rebuilt: ' + hCount + ' | footers rebuilt: ' + fCount + ' (of ' + files.length + ' pages)');
