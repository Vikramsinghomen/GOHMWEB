/**
 * Regenerates css/styles.min.css from css/styles.css.
 *
 * The site loads styles.min.css (see <link rel="stylesheet" href="css/styles.min.css">),
 * so styles.css edits have NO effect until this is run.
 *
 * Minification is deliberately conservative: comments removed, whitespace collapsed,
 * last semicolon before } dropped. No value rewriting, so the output stays predictable
 * and visually identical to the source.
 *
 * Usage: node tools/build-css.js
 */
const fs = require('fs');
const path = require('path');

const REPO = path.join(__dirname, '..', 'GOHMWEB-Repo', 'css');
const src = fs.readFileSync(path.join(REPO, 'styles.css'), 'utf8');

function minify(css) {
  // Protect strings (content: "...") from comment/whitespace stripping
  const strings = [];
  let out = css.replace(/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g, (m) => {
    strings.push(m);
    return '\u0000STR' + (strings.length - 1) + '\u0000';
  });

  // Strip comments (CSS has no nested block comments)
  out = out.replace(/\/\*[\s\S]*?\*\//g, '');

  // Collapse whitespace
  out = out.replace(/\s+/g, ' ');

  // Tidy around structural characters
  out = out.replace(/\s*([{}:;,>~+])\s*/g, '$1');
  out = out.replace(/;}/g, '}');

  // Restore strings
  out = out.replace(/\u0000STR(\d+)\u0000/g, (m, i) => strings[Number(i)]);

  return out.trim();
}

const min = minify(src);
fs.writeFileSync(path.join(REPO, 'styles.min.css'), min, 'utf8');

const kb = (Buffer.byteLength(min) / 1024).toFixed(1);
const rawKb = (Buffer.byteLength(src) / 1024).toFixed(1);
console.log('styles.min.css rebuilt: ' + rawKb + ' KB -> ' + kb + ' KB');
console.log('bytes: ' + min.length);
