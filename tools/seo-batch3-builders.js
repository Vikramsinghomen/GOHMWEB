var fs = require('fs');
var path = require('path');

var SHORT = {
    'blog-chaldean-vs-pythagorean-numerology': 'Chaldean vs Pythagorean Numerology — Which Is Right?',
    'blog-lo-shu-grid-missing-numbers': 'Lo Shu Grid Missing Numbers — Meanings & Remedies',
    'blog-master-numbers-11-22-33': null,
    'blog-reversed-tarot-cards': 'Reversed Tarot Cards — A Calm Beginners Guide',
    'blog-sade-sati-three-phases': 'Sade Sati: Saturns Three 2.5-Year Phases',
    'blog-vastu-pyramid-placement': null,
    'blog-50-questions-indians-ask-astrologers': '50 Questions Indians Ask Astrologers — Answered',
    'blog-50-astrology-questions-worldwide': '50 Astrology Questions the World Asks — Answered',
    'blog-50-numerology-questions-indians-ask': '50 Numerology Questions Indians Ask — Answered',
    'blog-50-numerology-questions-worldwide': '50 Numerology Questions the World Asks — Answered',
    'blog-50-vastu-questions-indians-ask': null,
    'blog-50-vastu-fengshui-questions-worldwide': '50 Vaastu & Feng Shui Questions — Answered',
    'blog-50-palmistry-questions-indians-ask': null,
    'blog-50-palmistry-questions-worldwide': '50 Palmistry Questions the World Asks — Answered',
    'blog-50-tarot-questions-indians-ask': null,
    'blog-50-tarot-questions-worldwide': '50 Tarot Questions the World Asks — Answered'
};

var BUILDERS = [
    'build-blog-posts.js',
    'build-qa-blog.js',
    'build-numerology-qa-blog.js',
    'build-vastu-qa-blog.js',
    'build-palmistry-qa-blog.js',
    'build-tarot-qa-blog.js'
];

var changed = 0;
BUILDERS.forEach(function (file) {
    var full = path.join(__dirname, file);
    var src = fs.readFileSync(full, 'utf8');
    var before = src;
    // 1. Per-post OG image instead of shared index-og
    src = src.split('https://www.greatohm.com/assets/og/index-og.png')
        .join('https://www.greatohm.com/assets/og/${p.slug}-og.png');
    // 2. Short titles where mapped: title: 'OLD' -> title: 'NEW'
    Object.keys(SHORT).forEach(function (slug) {
        if (!SHORT[slug]) return;
        var re = new RegExp("(slug: '" + slug + "'[\\s\\S]{0,200}?title: ')([^']*)(')");
        src = src.replace(re, '$1' + SHORT[slug] + '$3');
    });
    if (src !== before) { fs.writeFileSync(full, src, 'utf8'); changed++; console.log('WROTE tools/' + file); }
    else { console.log('SAME  tools/' + file); }
});
console.log('builder-patch done: ' + changed);
