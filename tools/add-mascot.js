/**
 * Injects the Ohm Buddy mascot (pink + turquoise) into every page:
 *  - <link> to css/ohm-buddy.css after the styles.min.css stylesheet
 *  - <script src="js/ohm-buddy.js"> before js/main.min.js
 *
 * The mascot JS auto-mounts the floating buddy on all pages and the
 * hero buddy inside #download .cta-inner where present, so no per-page
 * markup edits are needed.
 *
 * Also patches tools/build-*.js templates so future regenerations keep
 * the mascot tags. Idempotent: already-tagged files are skipped.
 * Usage: node tools/add-mascot.js
 */
const fs = require('fs');
const path = require('path');

const REPO = path.resolve(__dirname, '..', 'GOHMWEB-Repo');
const CSS_TAG = '<link rel="stylesheet" href="css/ohm-buddy.css">';
const JS_TAG = '<script src="js/ohm-buddy.js"></script>';

let changed = 0;

// --- 1. Patch every HTML page -------------------------------------------
const pages = fs.readdirSync(REPO).filter((f) => f.endsWith('.html'));
for (const file of pages) {
    const full = path.join(REPO, file);
    let src = fs.readFileSync(full, 'utf8');
    const before = src;

    if (!src.includes('ohm-buddy.css')) {
        const anchor = '<link rel="stylesheet" href="css/styles.min.css">';
        if (src.includes(anchor)) {
            src = src.replace(anchor, anchor + '\n    ' + CSS_TAG);
        } else {
            console.log('SKIP-CSS ' + file + ' (no styles.min.css link)');
        }
    }

    if (!src.includes('js/ohm-buddy.js')) {
        const anchor = '<script src="js/main.min.js">';
        if (src.includes(anchor)) {
            src = src.replace(anchor, JS_TAG + '\n' + anchor);
        } else {
            console.log('SKIP-JS  ' + file + ' (no main.min.js script)');
        }
    }

    if (src !== before) {
        fs.writeFileSync(full, src, 'utf8');
        changed++;
        console.log('WROTE ' + file);
    } else {
        console.log('SAME  ' + file);
    }
}

// --- 2. Patch builder templates so rebuilds keep the mascot -------------
const toolsDir = __dirname;
const builders = fs.readdirSync(toolsDir).filter((f) => /^build-.*\.js$/.test(f));
let buildersChanged = 0;
for (const file of builders) {
    const full = path.join(toolsDir, file);
    let src = fs.readFileSync(full, 'utf8');
    const before = src;

    // Only patch real <link ...> template lines (skip lines starting with * or //).
    if (!src.includes('ohm-buddy.css')) {
        const lines = src.split(/\r?\n/);
        for (let i = 0; i < lines.length; i++) {
            const t = lines[i].trim();
            if (t.startsWith('*') || t.startsWith('//')) continue;
            if (lines[i].includes('css/styles.min.css">')) {
                lines[i] = lines[i].split('css/styles.min.css">').join('css/styles.min.css">\n    ' + CSS_TAG);
            }
        }
        src = lines.join('\n');
    }
    if (!src.includes('js/ohm-buddy.js') && src.includes('js/main.min.js')) {
        src = src.split('<script src="js/main.min.js">').join(JS_TAG + '\n<script src="js/main.min.js">');
    }

    if (src !== before) {
        fs.writeFileSync(full, src, 'utf8');
        buildersChanged++;
        console.log('WROTE tools/' + file);
    }
}

console.log('\n' + changed + ' page(s) + ' + buildersChanged + ' builder(s) updated with Ohm Buddy.');
