var fs = require('fs');
var path = require('path');
var REPO = path.join(__dirname, '..', 'GOHMWEB-Repo');
fs.readdirSync(REPO).filter(function (f) { return f.endsWith('.html'); }).forEach(function (f) {
    var src = fs.readFileSync(path.join(REPO, f), 'utf8');
    var d = src.match(/<meta name="description"\s*\n?\s*content="([^"]*)"/);
    if (d && d[1].length > 160) {
        console.log('=== ' + f + ' (' + d[1].length + ')');
        console.log(d[1]);
    }
});
