var fs = require('fs');
var path = require('path');
var REPO = path.join(__dirname, '..', 'GOHMWEB-Repo');
var bad = 0;
fs.readdirSync(REPO).filter(function (f) { return f.endsWith('.html'); }).forEach(function (f) {
    var src = fs.readFileSync(path.join(REPO, f), 'utf8');
    var ms = src.match(/image:alt" content="([^"]*)"/g) || [];
    ms.forEach(function (m) {
        var v = m.match(/content="([^"]*)"/)[1];
        // corruption heuristics: truncated mid-phrase, empty, or contains raw HTML entities glitches
        var truncated = /(\bthe|\bof|\bfor|\band|\bto|\bin|—|-)\s*$/i.test(v);
        if (v.length === 0 || truncated || /&amp;amp;/.test(v)) {
            bad++;
            console.log('BAD  ' + f + ' :: ' + v);
        }
    });
});
console.log(bad === 0 ? 'ALT CLEAN' : 'ALT ISSUES: ' + bad);
