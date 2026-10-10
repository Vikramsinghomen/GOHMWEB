/**
 * Adds a "Blog" link to the footer "Explore" column of every page in
 * GOHMWEB-Repo, for internal linking / SEO. It edits ONLY the footer's
 * Explore <ul class="footer-links"> block (the one under the "Explore"
 * heading), so the header nav is untouched.
 *
 * Idempotent: pages that already contain a footer Blog link are skipped.
 * Usage: node tools/add-blog-footer-link.js
 */
const fs = require('fs');
const path = require('path');

const REPO = path.resolve(__dirname, '..', 'GOHMWEB-Repo');
const files = fs.readdirSync(REPO).filter((f) => f.endsWith('.html'));

// Match the footer Explore column: its heading followed by its <ul>...</ul>.
const EXPLORE_RE = /(<h4 class="footer-col-title">Explore<\/h4>\s*<ul class="footer-links">)([\s\S]*?)(<\/ul>)/;

let changed = 0;
for (const file of files) {
    const full = path.join(REPO, file);
    let src = fs.readFileSync(full, 'utf8');

    const m = src.match(EXPLORE_RE);
    if (!m) {
        console.log('SKIP  ' + file + ' (no footer Explore block)');
        continue;
    }

    // Idempotency: skip if a Blog link already exists in that footer block.
    if (/<a href="blog\.html">Blog<\/a>/.test(m[2])) {
        console.log('SAME  ' + file);
        continue;
    }

    // Preserve the indentation + line ending used by the existing <li> items.
    const eol = /\r\n/.test(m[2]) ? '\r\n' : '\n';
    const pad = (m[2].match(/\n([ \t]*)<li>/) || [])[1] || '                    ';
    const insertion = eol + pad + '<li><a href="blog.html">Blog</a></li>';

    // Strip the whitespace-only tail (the old </ul> indent) so the inserted
    // item sits cleanly, then re-add the proper closing indent (16 spaces).
    const tail = (m[2].match(/[ \t]*$/) || [])[0] || '';
    const body = m[2].slice(0, m[2].length - tail.length);
    const closing = eol + '                ';

    const next = m[1] + body + insertion + closing + m[3];
    const out = src.replace(m[0], next);

    if (out === src) {
        console.log('SAME  ' + file);
        continue;
    }
    fs.writeFileSync(full, out, 'utf8');
    changed++;
    console.log('WROTE ' + file);
}

console.log('\n' + changed + ' file(s) updated with a footer Blog link.');
