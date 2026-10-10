var fs = require('fs');
var path = require('path');
var REPO = path.join(__dirname, '..', 'GOHMWEB-Repo');
var SLUGS = [
    'blog',
    'blog-chaldean-vs-pythagorean-numerology',
    'blog-lo-shu-grid-missing-numbers',
    'blog-master-numbers-11-22-33',
    'blog-reversed-tarot-cards',
    'blog-sade-sati-three-phases',
    'blog-vastu-pyramid-placement',
    'blog-50-questions-indians-ask-astrologers',
    'blog-50-astrology-questions-worldwide',
    'blog-50-numerology-questions-indians-ask',
    'blog-50-numerology-questions-worldwide',
    'blog-50-vastu-questions-indians-ask',
    'blog-50-vastu-fengshui-questions-worldwide',
    'blog-50-palmistry-questions-indians-ask',
    'blog-50-palmistry-questions-worldwide',
    'blog-50-tarot-questions-indians-ask',
    'blog-50-tarot-questions-worldwide'
];
var changed = 0;
SLUGS.forEach(function (slug) {
    var full = path.join(REPO, slug + '.html');
    var src = fs.readFileSync(full, 'utf8');
    var before = src;
    var img = 'https://www.greatohm.com/assets/og/' + slug + '-og.png';
    src = src.split('https://www.greatohm.com/assets/og/index-og.png').join(img);
    if (src !== before) { fs.writeFileSync(full, src, 'utf8'); changed++; console.log('WROTE ' + slug); }
    else { console.log('SAME  ' + slug); }
});
console.log('og-wire done: ' + changed);
