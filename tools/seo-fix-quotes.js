var fs = require('fs');
var path = require('path');
var REPO = path.join(__dirname, '..', 'GOHMWEB-Repo');
var FILES = [
    'blog-50-astrology-questions-worldwide.html',
    'blog-50-numerology-questions-worldwide.html',
    'blog-50-palmistry-questions-worldwide.html',
    'blog-50-tarot-questions-worldwide.html'
];
var fixed = 0;
FILES.forEach(function (f) {
    var full = path.join(REPO, f);
    var lines = fs.readFileSync(full, 'utf8').split('\n');
    var out = lines.map(function (l) {
        if (!/^ *<meta/i.test(l)) return l;
        if (!/content="/.test(l)) return l;
        var ci = l.indexOf('content="');
        var end = l.lastIndexOf('">');
        if (end <= ci) return l;
        var val = l.slice(ci + 9, end);
        if (val.indexOf('"') < 0) return l;
        fixed++;
        return l.slice(0, ci + 9) + val.split('"').join('&quot;') + l.slice(end);
    });
    fs.writeFileSync(full, out.join('\n'), 'utf8');
    console.log('FIXED ' + f);
});
console.log('inner-quote fix done, attributes repaired: ' + fixed);
