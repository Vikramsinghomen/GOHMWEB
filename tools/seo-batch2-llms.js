var fs = require('fs');
var path = require('path');
var REPO = path.join(__dirname, '..', 'GOHMWEB-Repo');

var POSTS = [
    'blog.html',
    'blog-chaldean-vs-pythagorean-numerology.html',
    'blog-lo-shu-grid-missing-numbers.html',
    'blog-master-numbers-11-22-33.html',
    'blog-reversed-tarot-cards.html',
    'blog-sade-sati-three-phases.html',
    'blog-vastu-pyramid-placement.html',
    'blog-50-questions-indians-ask-astrologers.html',
    'blog-50-astrology-questions-worldwide.html',
    'blog-50-numerology-questions-indians-ask.html',
    'blog-50-numerology-questions-worldwide.html',
    'blog-50-vastu-questions-indians-ask.html',
    'blog-50-vastu-fengshui-questions-worldwide.html',
    'blog-50-palmistry-questions-indians-ask.html',
    'blog-50-palmistry-questions-worldwide.html',
    'blog-50-tarot-questions-indians-ask.html',
    'blog-50-tarot-questions-worldwide.html'
];

function meta(file) {
    var h = fs.readFileSync(path.join(REPO, file), 'utf8');
    var t = (h.match(/<title>([\s\S]*?)<\/title>/i) || ['', file])[1].trim();
    var d = (h.match(/name="description"[\s\S]{0,400}?content="([^"]*)"/i) || ['', ''])[1];
    return { t: t, d: d };
}

// --- llms.txt: add Blog section before ## Optional ---
var slim = path.join(REPO, 'llms.txt');
var s = fs.readFileSync(slim, 'utf8');
if (s.indexOf('blog.html') < 0) {
    var lines = POSTS.map(function (f) {
        var m = meta(f);
        return '- [' + m.t.split('|')[0].trim().slice(0, 60) + '](https://www.greatohm.com/' + f + ')';
    });
    var block = '\n## Blog — Guides & 50-Question Q&A\n\n' + lines.join('\n') + '\n';
    s = s.replace('## Optional', block + '\n## Optional');
    fs.writeFileSync(slim, s, 'utf8');
    console.log('WROTE llms.txt (+' + POSTS.length + ' links)');
} else { console.log('SAME llms.txt'); }

// --- llms-full.txt: append blog directory + per-post H1/desc ---
var full = path.join(REPO, 'llms-full.txt');
var f = fs.readFileSync(full, 'utf8');
if (f.indexOf('blog-50-tarot-questions-worldwide.html') < 0) {
    var secs = POSTS.map(function (pf) {
        var m = meta(pf);
        return '### ' + m.t.split('|')[0].trim() + ' (https://www.greatohm.com/' + pf + ')\n\n' + m.d + '\n';
    });
    var dir = POSTS.map(function (pf) {
        return '- [Blog post](https://www.greatohm.com/' + pf + ')';
    });
    f = f.replace(
        '- [Delete Account](https://www.greatohm.com/delete-account.html): Self-service account deletion and complete data erasure procedures.\n',
        '- [Delete Account](https://www.greatohm.com/delete-account.html): Self-service account deletion and complete data erasure procedures.\n' + dir.join('\n') + '\n'
    );
    f = f + '\n## Blog Library (guides + 50-question Q&A)\n\n' + secs.join('\n');
    fs.writeFileSync(full, f, 'utf8');
    console.log('WROTE llms-full.txt (+' + POSTS.length + ' sections)');
} else { console.log('SAME llms-full.txt'); }
