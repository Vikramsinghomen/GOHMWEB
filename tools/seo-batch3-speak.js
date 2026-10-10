var fs = require('fs');
var path = require('path');
var patch = { count: 0 };
var BFILES = [
    'build-blog-posts.js',
    'build-qa-blog.js',
    'build-numerology-qa-blog.js',
    'build-vastu-qa-blog.js',
    'build-palmistry-qa-blog.js',
    'build-tarot-qa-blog.js'
];
BFILES.forEach(function (file) {
    var full = path.join(__dirname, file);
    var src = fs.readFileSync(full, 'utf8');
    var before = src;
    // Speakable inside BlogPosting (after keywords line)
    if (src.indexOf('speakableSpecification') < 0) {
        src = src.split('"keywords": ${JSON.stringify(p.keywords)}').join(
            '"keywords": ${JSON.stringify(p.keywords)},\n' +
            '                "speakableSpecification": {\n' +
            '                    "@type": "SpeakableSpecification",\n' +
            '                    "cssSelector": [".page-title", ".faq-q"]\n' +
            '                }'
        );
    }
    if (src.indexOf('speakableSpecification') < 0) {
        src = src.split('"keywords": "${p.keywords}"').join(
            '"keywords": "${p.keywords}",\n' +
            '                "speakableSpecification": {\n' +
            '                    "@type": "SpeakableSpecification",\n' +
            '                    "cssSelector": [".page-title", ".faq-q"]\n' +
            '                }'
        );
    }
    if (src !== before) { fs.writeFileSync(full, src, 'utf8'); patch.count++; console.log('WROTE tools/' + file); }
    else { console.log('SAME  tools/' + file); }
});
var PATCHED = { count: 0 };
// Inject SpeakableSpecification into the live BlogPosting JSON-LD of blog pages
var BLOGS = [
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
    'blog-50-tarot-questions-worldwide',
    'blog-50-tarot-questions-indians-ask-worldwide'
];
var REPO = path.join(__dirname, '..', 'GOHMWEB-Repo');
BLOGS.forEach(function (slug) {
    var full = path.join(REPO, slug + '.html');
    if (!fs.existsSync(full)) { console.log('MISS  ' + slug); return; }
    var src = fs.readFileSync(full, 'utf8');
    if (src.indexOf('speakableSpecification') >= 0) { console.log('SAME  ' + slug); return; }
    // Inject after the keywords line inside the BlogPosting block
    var re = /("keywords":\s*(?:"[^"]*"|\[[^\]]*\]))(\s*\n\s*\})/;
    if (!re.test(src)) { console.log('NOKEY ' + slug); return; }
    src = src.replace(re, '$1,\n                "speakableSpecification": {\n                    "@type": "SpeakableSpecification",\n                    "cssSelector": [".page-title", ".faq-q"]\n                }$2');
    fs.writeFileSync(full, src, 'utf8');
    PATCHED.count++;
    console.log('WROTE ' + slug);
});
console.log('speakable-live done: ' + PATCHED.count);
