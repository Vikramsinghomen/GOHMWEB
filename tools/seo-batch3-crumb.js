var fs = require('fs');
var path = require('path');
var REPO = path.join(__dirname, '..', 'GOHMWEB-Repo');

// Pages lacking BreadcrumbList (from audit) + their trail
var TARGETS = {
    'about.html': [['Home', 'https://www.greatohm.com/'], ['About Us', 'https://www.greatohm.com/about.html']],
    'astrology.html': [['Home', 'https://www.greatohm.com/'], ['Astrology', 'https://www.greatohm.com/astrology.html']],
    'delete-account.html': [['Home', 'https://www.greatohm.com/'], ['Delete Account', 'https://www.greatohm.com/delete-account.html']],
    'join.html': [['Home', 'https://www.greatohm.com/'], ['Join Us', 'https://www.greatohm.com/join.html']],
    'kundli.html': [['Home', 'https://www.greatohm.com/'], ['Astrology', 'https://www.greatohm.com/astrology.html'], ['Kundli', 'https://www.greatohm.com/kundli.html']],
    'numerology.html': [['Home', 'https://www.greatohm.com/'], ['Numerology', 'https://www.greatohm.com/numerology.html']],
    'palmistry.html': [['Home', 'https://www.greatohm.com/'], ['Palmistry', 'https://www.greatohm.com/palmistry.html']],
    'privacy.html': [['Home', 'https://www.greatohm.com/'], ['Privacy Policy', 'https://www.greatohm.com/privacy.html']],
    'services.html': [['Home', 'https://www.greatohm.com/'], ['Our Services', 'https://www.greatohm.com/services.html']],
    'supplement.html': [['Home', 'https://www.greatohm.com/'], ['Commerce Supplement', 'https://www.greatohm.com/supplement.html']],
    'tarot.html': [['Home', 'https://www.greatohm.com/'], ['Tarot', 'https://www.greatohm.com/tarot.html']],
    'terms.html': [['Home', 'https://www.greatohm.com/'], ['Terms', 'https://www.greatohm.com/terms.html']],
    'vastu.html': [['Home', 'https://www.greatohm.com/'], ['Vastu', 'https://www.greatohm.com/vastu.html']]
};

var MARK = 'SEO-BATCH3-BREADCRUMB';
var changed = 0;

Object.keys(TARGETS).forEach(function (file) {
    var full = path.join(REPO, file);
    var src = fs.readFileSync(full, 'utf8');
    if (src.indexOf(MARK) >= 0) { console.log('SAME  ' + file); return; }
    var trail = TARGETS[file];
    var items = trail.map(function (t, i) {
        return '                {\n' +
            '                    "@type": "ListItem",\n' +
            '                    "position": ' + (i + 1) + ',\n' +
            '                    "name": "' + t[0] + '",\n' +
            '                    "item": "' + t[1] + '"\n' +
            '                }';
    }).join(',\n');
    var block = '    <!-- ' + MARK + ' -->\n' +
        '    <script type="application/ld+json">\n' +
        '    {\n' +
        '        "@context": "https://schema.org",\n' +
        '        "@type": "BreadcrumbList",\n' +
        '        "itemListElement": [\n' + items + '\n' +
        '        ]\n' +
        '    }\n' +
        '    </script>\n';
    var anchor = '</head>';
    if (src.indexOf(anchor) < 0) { console.log('SKIP  ' + file + ' (no head)'); return; }
    src = src.replace(anchor, block + anchor);
    fs.writeFileSync(full, src, 'utf8');
    changed++;
    console.log('WROTE ' + file);
});
console.log('batch3-crumb done: ' + changed);
