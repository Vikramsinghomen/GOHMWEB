// Unify the header nav menu across all pages.
// Every page gets the same 11 items in the same order as index.html,
// with section links pointed at index.html#... (or the real page for
// services/join). Operates on bytes and rewrites only the
// <ul class="nav-links">...</ul> block so surrounding content,
// encoding and line endings are untouched.
const fs = require('fs');
const path = require('path');

const dir = path.resolve(__dirname, '..', 'GOHMWEB-Repo');

// label, target (without index.html prefix for section links)
const MENU = [
    ['Home', 'index.html#home', '#home'],
    ['What is GreatOhm?', 'index.html#what', '#what'],
    ['Our Services', 'services.html', 'services.html'],
    ['Why use it?', 'index.html#why', '#why'],
    ['Screenshots', 'index.html#screenshots', '#screenshots'],
    ['Features', 'index.html#features', '#features'],
    ['Sciences', 'index.html#sciences', '#sciences'],
    ['FAQ', 'index.html#faq', '#faq'],
    ['Download', 'index.html#download', '#download'],
    ['Join Us', 'join.html', 'join.html'],
    ['Contact', 'index.html#contact', '#contact'],
];

const UL_RE = /<ul class="nav-links" id="navLinks">[\s\S]*?<\/ul>/;

function buildBlock(indent, hrefIdx, eol) {
    const pad = ' '.repeat(indent);
    const inner = ' '.repeat(indent + 4);
    const items = MENU.map(
        ([label, pageHref, indexHref]) =>
            `${inner}<li><a href="${hrefIdx === 0 ? indexHref : pageHref}">${label}</a></li>`
    );
    return [
        `${pad}<ul class="nav-links" id="navLinks">`,
        ...items,
        `${pad}</ul>`,
    ].join(eol);
}

const files = fs.readdirSync(dir).filter((f) => f.endsWith('.html'));
let changed = 0;

for (const file of files) {
    const full = path.join(dir, file);
    const src = fs.readFileSync(full, 'utf8');
    const m = src.match(UL_RE);
    if (!m) {
        console.log(`SKIP  ${file} (no nav-links block found)`);
        continue;
    }

    // Match the existing indentation and the line ending used just before the
    // <ul> so the replacement blends in.
    const before = src.slice(0, m.index);
    // Indentation of the <ul>'s own line. `before` still ends with that
    // whitespace, so it is trimmed off and re-emitted by buildBlock.
    const lineStart = before.lastIndexOf('\n') + 1;
    const indent = (before.slice(lineStart).match(/^[ \t]*/) || [''])[0];
    const eol = /\r\n/.test(m[0]) ? '\r\n' : '\n';

    // Drop the <ul> line's own leading whitespace from `before` (buildBlock
    // re-adds it), and let the newline that originally followed </ul> stay
    // untouched in `after` so no blank line is introduced.
    const head = before.slice(0, before.length - indent.length);
    const block = buildBlock(indent.length, file === 'index.html' ? 0 : 1, eol);
    const out = head + block + src.slice(m.index + m[0].length);

    if (out === src) {
        console.log(`SAME  ${file}`);
        continue;
    }
    fs.writeFileSync(full, out, 'utf8');
    changed++;
    console.log(`WROTE ${file} -> ${MENU.length} items`);
}

console.log(`\n${changed} file(s) updated.`);
