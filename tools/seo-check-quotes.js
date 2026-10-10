var fs = require('fs');
var path = require('path');
var REPO = path.join(__dirname, '..', 'GOHMWEB-Repo');
var found = 0;
fs.readdirSync(REPO).filter(function (f) { return f.endsWith('.html'); }).forEach(function (f) {
    var lines = fs.readFileSync(path.join(REPO, f), 'utf8').split('\n');
    lines.forEach(function (l, i) {
        // a meta/link line with content="..." where after the closing quote there are
        // stray quotes before '>' => attribute terminated early (unescaped inner quotes)
        var m = l.match(/content="[^"]*"/);
        if (m) {
            var rest = l.slice(l.indexOf(m[0]) + m[0].length, l.lastIndexOf('>'));
            if (rest.indexOf('"') >= 0 && /^[\s\w:]*$/.test(l.slice(0, l.indexOf('content='))) === false) { /* skip complex */ }
            // simpler: inner-quote bug shows as content="...X" — with more quoted text before tag end
            if (/content="[^"]*"[^>]*"[^>]*>/.test(l) && /<meta/i.test(l)) {
                found++;
                console.log('BAD ' + f + ':' + (i + 1) + ' :: ' + l.trim().slice(0, 140));
            }
        }
    });
});
console.log(found === 0 ? 'NO INNER-QUOTE BUGS' : 'INNER-QUOTE BUGS: ' + found);
