var path = require('path');
var fs2 = require('fs');
var REPO2 = path.join(__dirname, '..', 'GOHMWEB-Repo');
var SCI = ['astrology.html', 'numerology.html', 'vastu.html', 'palmistry.html', 'tarot.html'];
var fixed = 0;
SCI.forEach(function (f) {
    var full = path.join(REPO2, f);
    var src = fs2.readFileSync(full, 'utf8');
    var before = src;
    // 1. Close faq-list before the marker: "</div></div>\n\n<marker>" -> "</div>\n</div>\n\n<marker>"
    src = src.replace(
        /<\/div><\/div>(\s*)(<!-- SEO-BATCH1: science-to-blog -->)/,
        '</div>\n                        </div>$1$2'
    );
    // 2. Replace B icon with book emoji
    src = src.split('<span class="sc-icon">B</span>').join('<span class="sc-icon">📖</span>');
    if (src !== before) { fs2.writeFileSync(full, src, 'utf8'); fixed++; console.log('FIXED ' + f); }
    else { console.log('SAME  ' + f); }
});
console.log('fix done: ' + fixed);
