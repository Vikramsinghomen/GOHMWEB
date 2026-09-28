/**
 * Restores the three launch badges (LaunchBuff / LaunchKiwi / Smol Spot) into any
 * footer that lost them, and re-indents the footer grid.
 *
 * The badges sit between .footer-grid and .footer-copy, and must be direct children
 * of .container.footer-inner (CSS uses grid-column: 1 / -1 on .footer-badges).
 *
 * Usage: node tools/restore-footer-badges.js
 */
const fs = require('fs');
const path = require('path');

const REPO = path.join(__dirname, '..', 'GOHMWEB-Repo');
const files = fs.readdirSync(REPO).filter((f) => f.endsWith('.html'));
const ind = (n) => ' '.repeat(n);

const BADGES = [
  {
    href: 'https://launchbuff.com/products/greatohm-ofqg4k',
    title: 'Featured on LaunchBuff',
    src: 'https://launchbuff.com/badge-featured-dark.svg',
    alt: 'Featured on LaunchBuff'
  },
  {
    href: 'https://launchkiwi.com/p/greatohm',
    title: 'Featured on LaunchKiwi',
    src: 'https://launchkiwi.com/badge-light.svg',
    alt: 'Featured on LaunchKiwi'
  },
  {
    href: 'https://smolspot.com/projects/greatohm?utm_source=badge',
    title: 'Featured on Smol Spot',
    src: 'https://smolspot.com/smolspot/images/badges/featured-on-light.svg',
    alt: 'Featured on Smol Spot'
  }
];

const badgeHtml =
  ind(12) + '<div class="footer-badges">\n' +
  BADGES.map((b) =>
    ind(16) + '<a href="' + b.href + '" target="_blank" rel="noopener noreferrer" title="' + b.title + '" class="footer-badge-item">\n' +
    ind(20) + '<img src="' + b.src + '" alt="' + b.alt + '" height="44" loading="lazy" />\n' +
    ind(16) + '</a>'
  ).join('\n') + '\n' +
  ind(12) + '</div>\n';

let restored = 0, already = 0;
files.forEach((f) => {
  const full = path.join(REPO, f);
  let h = fs.readFileSync(full, 'utf8');
  if (h.includes('footer-badges')) { already++; return; }

  const copyAt = h.indexOf('<p class="footer-copy">');
  if (copyAt === -1) { console.warn('no footer-copy in ' + f); return; }

  h = h.slice(0, copyAt) + badgeHtml + h.slice(copyAt);
  fs.writeFileSync(full, h, 'utf8');
  restored++;
});

console.log('badges restored: ' + restored + ' | already present: ' + already);
