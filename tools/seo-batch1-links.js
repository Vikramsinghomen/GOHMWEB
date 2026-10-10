var fs = require('fs');
var path = require('path');

var REPO = path.join(__dirname, '..', 'GOHMWEB-Repo');

var MAP = [
    { science: 'astrology.html', label: 'Astrology',
      posts: ['blog-50-questions-indians-ask-astrologers.html', 'blog-50-astrology-questions-worldwide.html'] },
    { science: 'numerology.html', label: 'Numerology',
      posts: ['blog-50-numerology-questions-indians-ask.html', 'blog-50-numerology-questions-worldwide.html'] },
    { science: 'vastu.html', label: 'Vaastu',
      posts: ['blog-50-vastu-questions-indians-ask.html', 'blog-50-vastu-fengshui-questions-worldwide.html'] },
    { science: 'palmistry.html', label: 'Palmistry',
      posts: ['blog-50-palmistry-questions-indians-ask.html', 'blog-50-palmistry-questions-worldwide.html'] },
    { science: 'tarot.html', label: 'Tarot',
      posts: ['blog-50-tarot-questions-indians-ask.html', 'blog-50-tarot-questions-worldwide.html'] }
];

var TITLES = {};
var DESCS = {};
function pageMeta(file) {
    var h = fs.readFileSync(path.join(REPO, file), 'utf8');
    var t = (h.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || ['', file])[1].replace(/<[^>]+>/g, '').trim();
    var d = (h.match(/name="description"[\s\S]{0,300}?content="([^"]{0,140})/i) || ['', ''])[1];
    TITLES[file] = t;
    DESCS[file] = d;
}
Object.keys({}).concat(MAP.reduce(function (a, m) { return a.concat(m.posts); }, []))
    .forEach(pageMeta);

var MARK = '<!-- SEO-BATCH1: science-to-blog -->';
var BACKMARK = '<!-- SEO-BATCH1: blog-to-science -->';
var changed = 0;

function cards(posts) {
    return posts.map(function (f) {
        return '                            <a href="' + f + '" class="science-card">\n' +
            '                                <h3>' + TITLES[f] + '</h3>\n' +
            '                                <p>' + DESCS[f] + '</p>\n' +
            '                            </a>';
    }).join('\n');
}

MAP.forEach(function (m) {
    var full = path.join(REPO, m.science);
    var src = fs.readFileSync(full, 'utf8');
    if (src.indexOf(MARK) >= 0) { console.log('SAME  ' + m.science); return; }
    var section = '                    ' + MARK + '\n' +
        '                    <h2 class="section-title" style="margin-top:44px">Further Reading on the Blog</h2>\n' +
        '                    <p class="section-lead">Real questions about ' + m.label + ', answered calmly by GreatOhm.</p>\n' +
        '                    <div class="science-grid">\n' +
        cards(m.posts) + '\n' +
        '                    </div>\n';
    var anchor = '<div class="cta-box">';
    if (src.indexOf(anchor) >= 0) {
        src = src.replace(anchor, section + '\n                    ' + anchor);
    } else {
        var idx = src.lastIndexOf('</main>');
        var pbClose = src.lastIndexOf('</div>', idx);
        src = src.slice(0, pbClose) + section + '\n                ' + src.slice(pbClose);
    }
    fs.writeFileSync(full, src, 'utf8');
    changed++;
    console.log('WROTE ' + m.science);
});

MAP.forEach(function (m) {
    m.posts.forEach(function (f, i) {
        var sib = m.posts[1 - i];
        var full = path.join(REPO, f);
        var src = fs.readFileSync(full, 'utf8');
        if (src.indexOf(BACKMARK) >= 0) { console.log('SAME  ' + f); return; }
        var para = '                    ' + BACKMARK + '\n' +
            '                    <p class="blog-backlinks">Explore the <a href="' + m.science + '">' + m.label +
            ' section</a> on GreatOhm, or keep reading: <a href="' + sib + '">' + TITLES[sib] + '</a>.</p>\n';
        var idx = src.lastIndexOf('</main>');
        var pbClose = src.lastIndexOf('</div>', idx);
        src = src.slice(0, pbClose) + para + '\n                ' + src.slice(pbClose);
        fs.writeFileSync(full, src, 'utf8');
        changed++;
        console.log('WROTE ' + f);
    });
});

console.log('\nbatch1 done: ' + changed + ' file(s) updated.');
