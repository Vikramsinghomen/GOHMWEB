/**
 * One-off repair: normalises the footer Blog link formatting left by an
 * earlier add-blog-footer-link run (whitespace-only blank line + </ul> on
 * the same line as the Blog <li>).
 *
 * Canonical form:
 *     <li><a href="join.html">Join Us</a></li>
 *     <li><a href="blog.html">Blog</a></li>
 * </ul>
 *
 * Idempotent. Usage: node tools/fix-footer-ws.js (delete after use)
 */
const fs = require('fs');
const path = require('path');

const REPO = path.resolve(__dirname, '..', 'GOHMWEB-Repo');
const files = fs.readdirSync(REPO).filter((f) => f.endsWith('.html'));

// Join-Us <li>, then any whitespace (incl. blank lines), then Blog <li>
// glued to </ul> — collapse to the canonical three-line form.
const RE = /(<li><a href="join\.html">Join Us<\/a><\/li>)\s*\n\s*(<li><a href="blog\.html">Blog<\/a><\/li>)\s*<\/ul>/g;

let changed = 0;
for (const file of files) {
    const full = path.join(REPO, file);
    const src = fs.readFileSync(full, 'utf8');
    const out = src.replace(RE, '$1\n                    $2\n                </ul>');
    if (out !== src) {
        fs.writeFileSync(full, out, 'utf8');
        changed++;
        console.log('FIXED ' + file);
    }
}

console.log('\n' + changed + ' file(s) repaired.');
