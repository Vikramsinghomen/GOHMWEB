var fs = require('fs');
var path = require('path');
var REPO = path.join(__dirname, '..', 'GOHMWEB-Repo');
var fails = 0;
function fail(m) { fails++; console.log('FAIL ' + m); }

var files = fs.readdirSync(REPO).filter(function (f) { return f.endsWith('.html'); });
files.forEach(function (f) {
    var full = path.join(REPO, f);
    var src = fs.readFileSync(full, 'utf8');

    // 1. JSON-LD blocks must parse
    var re = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g, m;
    while ((m = re.exec(src)) !== null) {
        try { JSON.parse(m[1]); }
        catch (e) { fail('JSON-LD parse ' + f + ': ' + e.message); }
    }

    // 2. title tag length (soft check 10-70)
    var t = src.match(/<title>([^<]*)<\/title>/);
    if (t) {
        var len = t[1].length;
        if (len > 70 || len < 10) console.log('WARN title len ' + len + ' ' + f + ' :: ' + t[1]);
    }

    // 3. description length 50-170
    var d = src.match(/<meta name="description"\s*\n?\s*content="([^"]*)"/);
    if (d && (d[1].length > 170 || d[1].length < 50)) console.log('WARN desc len ' + d[1].length + ' ' + f);

    // 4. og:image / twitter:image must point at an existing file
    var imgs = src.match(/assets\/og\/[a-z0-9-]+\.png/g) || [];
    imgs.forEach(function (u) {
        if (!fs.existsSync(path.join(REPO, u))) fail('missing og image ' + u + ' in ' + f);
    });

    // 5. truncated-title corruption in image:alt (ends with common title tails mid-phrase)
    (src.match(/image:alt" content="([^"]*)"/g) || []).forEach(function (a) {
        var v = a.match(/content="([^"]*)"/)[1];
        if (/\b(Answered|— Which|Worldwide —|Indians Ask —)\s*$/.test(v) === false && /&\s*$|-\s*$/.test(v)) {
            console.log('WARN suspicious alt ' + f + ' :: ' + v);
        }
        if (v.length > 130) console.log('WARN long alt ' + v.length + ' ' + f);
    });

    // 6. stray markers from batch scripts
    if (/SEO-BATCH3-TITLE/.test(src)) console.log('WARN title marker left in ' + f);
});
console.log('---');
console.log('html files checked: ' + files.length);
console.log(fails === 0 ? 'AUDIT PASS' : 'AUDIT FAILURES: ' + fails);
