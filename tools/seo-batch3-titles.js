var fs = require('fs');
var path = require('path');
var REPO = path.join(__dirname, '..', 'GOHMWEB-Repo');

// [file, newTitleOrNull, newDescOrNull]
var FIX = [
    ['astrology.html', 'Vedic Astrology App — Horoscope, Kundli & Dasha | GreatOhm', null],
    ['blog-50-astrology-questions-worldwide.html', '50 Astrology Questions the World Asks — Answered | GreatOhm', null],
    ['blog-50-numerology-questions-indians-ask.html', '50 Numerology Questions Indians Ask — Answered | GreatOhm', null],
    ['blog-50-numerology-questions-worldwide.html', '50 Numerology Questions the World Asks — Answered | GreatOhm', null],
    ['blog-50-palmistry-questions-worldwide.html', '50 Palmistry Questions the World Asks — Answered | GreatOhm', null],
    ['blog-50-questions-indians-ask-astrologers.html', '50 Questions Indians Ask Astrologers — Answered | GreatOhm', null],
    ['blog-50-tarot-questions-worldwide.html', '50 Tarot Questions the World Asks — Answered | GreatOhm', null],
    ['blog-50-vastu-fengshui-questions-worldwide.html', '50 Vaastu & Feng Shui Questions — Answered | GreatOhm', null],
    ['blog-chaldean-vs-pythagorean-numerology.html', 'Chaldean vs Pythagorean Numerology — Which Is Right? | GreatOhm', null],
    ['blog-lo-shu-grid-missing-numbers.html', 'Lo Shu Grid Missing Numbers — Meanings & Remedies | GreatOhm', null],
    ['blog-reversed-tarot-cards.html', 'Reversed Tarot Cards — A Calm Beginners Guide | GreatOhm', null],
    ['blog-sade-sati-three-phases.html', 'Sade Sati: Saturns Three 2.5-Year Phases | GreatOhm', null],
    ['kundli-matching.html', 'Kundli Matching for Marriage — Guna Milan | GreatOhm', null],
    ['lal-kitab.html', 'Lal Kitab Remedies — Zodiac-Based Upay | GreatOhm', null],
    ['manglik-dosha.html', 'Manglik Dosha Check — Mangal & Kaal Sarp | GreatOhm', null],
    ['numerology.html', 'Numerology App — Life Path, Destiny & Name | GreatOhm', null],
    ['terms.html', 'Terms & Conditions — GreatOhm App & Club | GreatOhm',
     'Terms for the GreatOhm app, Club, subscriptions and consultations by GREATOHM (OPC) PRIVATE LIMITED.'],
    ['supplement.html', 'Commerce Supplement — Dakshina & Payments | GreatOhm', null],
    ['services.html', 'Our Services — Astrology, Numerology, Tarot & Vastu | GreatOhm', null]
];

var changed = 0;
FIX.forEach(function (row) {
    var file = row[0], nt = row[1], nd = row[2];
    var full = path.join(REPO, file);
    var src = fs.readFileSync(full, 'utf8');
    var before = src;
    if (nt) {
        var mt = src.match(/<title>([\s\S]*?)<\/title>/i);
        if (mt) {
            src = src.replace(mt[0], '<title>' + nt + '</title>');
            // mirror into og:title + twitter:title
            src = src.split(mt[1]).join(nt);
        }
    }
    if (nd) {
        var md = src.match(/name="description"\s+content="[^"]*"/i);
        if (md) src = src.replace(md[0], 'name="description"\n        content="' + nd + '"');
    }
    if (src !== before) { fs.writeFileSync(full, src, 'utf8'); changed++; console.log('WROTE ' + file); }
    else { console.log('SAME  ' + file); }
});
console.log('batch3-titles done: ' + changed);
