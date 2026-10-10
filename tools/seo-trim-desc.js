var fs = require('fs');
var path = require('path');
var REPO = path.join(__dirname, '..', 'GOHMWEB-Repo');

var TRIM = {
    'about.html': 'Meet the team behind GreatOhm (OPC) Private Limited — one app unifying Vedic astrology, numerology, tarot, Vaastu, palmistry and Nakshatra.',
    'astrology.html': 'A complete Vedic astrology app — birth charts, daily horoscopes, kundli matching, planetary dashas, Sade Sati and Shubh Mahurat on GreatOhm.',
    'blog-50-astrology-questions-worldwide.html': 'The astrology questions people google most — rising signs, compatibility, Mercury retrograde and more. Clear, friendly answers on charts.',
    'blog-50-numerology-questions-indians-ask.html': 'The numerology questions Indian seekers ask most — Mulank, Bhagyank, Namank, name correction, lucky numbers and more, answered without fear.',
    'blog-50-numerology-questions-worldwide.html': 'The numerology questions people google most — life path, master numbers, angel numbers, compatibility and whether it is real, answered plainly.',
    'blog-50-palmistry-questions-indians-ask.html': 'The palmistry questions Indian readers ask most — major lines, mounts, hand shapes, marriage and fate lines, lucky signs, without fear.',
    'blog-50-palmistry-questions-worldwide.html': 'The palm-reading questions people google most — the four major lines, mounts, hand shapes, dominant hand and whether lines change.',
    'blog-50-questions-indians-ask-astrologers.html': 'Real questions Indian seekers ask astrologers — clear, calm answers on career, marriage timing, doshas, muhurat, money and health.',
    'blog-50-tarot-questions-indians-ask.html': 'The tarot questions Indian seekers ask most — how tarot works, Arcana, reversed cards, yes/no readings, love and career, and if it is safe.',
    'blog-50-tarot-questions-worldwide.html': 'The tarot questions people google most — what tarot is, Arcana, reversed cards, spreads and reading your own cards, answered plainly.',
    'blog-50-vastu-fengshui-questions-worldwide.html': 'The spatial-harmony questions people search for — Vaastu vs feng shui, chi, bagua, five elements, bed placement, mirrors and wealth corners.',
    'blog-50-vastu-questions-indians-ask.html': 'The Vaastu questions Indian homeowners ask most — directions, main door, kitchen, bedroom, pooja room and remedies without demolition.',
    'blog-chaldean-vs-pythagorean-numerology.html': 'Chaldean and Pythagorean numerology turn letters into numbers but differ. Learn the origins, letter charts and best uses to pick your system.',
    'blog-lo-shu-grid-missing-numbers.html': 'The Lo Shu Grid is the 3x3 magic square from your birth date. Learn what an empty cell means, what each missing number suggests, and how to balance.',
    'blog-master-numbers-11-22-33.html': 'Master numbers 11, 22 and 33 carry heightened potential. Learn what makes them master, the pressure they bring, and how to spot a true one.',
    'blog-sade-sati-three-phases.html': 'Sade Sati is the 7.5-year Saturn transit through three signs around your Moon. Understand its three phases and how to move through it calmly.',
    'blog-vastu-pyramid-placement.html': 'Vastu pyramids are a popular remedy, but wrong placement fails. Learn how they work, where to place them per room, and balancing energy.',
    'blog.html': 'In-depth guides on Vedic astrology, numerology, Vastu, tarot and palmistry from GreatOhm — clear, practical articles on kundli and more.',
    'delete-account.html': 'Step-by-step instructions to permanently delete your GreatOhm account from the app or by email, plus what happens to your data under the DPDP Act.',
    'index.html': 'GreatOhm — one Vedic guidance app for astrology, numerology, tarot, Vaastu, palmistry, Nakshatra and calendar tools, with the daily 360° Ohm Score.',
    'kundli-matching.html': 'Check kundli matching for marriage online with Ashtakoot Guna Milan on GreatOhm — compare two charts across 36 gunas for clear compatibility.',
    'lal-kitab.html': 'Find Lal Kitab remedies by zodiac sign with GreatOhm — simple astrological solutions for marriage, health, wealth and planetary doshas.',
    'lo-shu-grid.html': 'Discover your Lo Shu Grid with GreatOhm — the Chinese magic square numerology method mapping your numbers, missing elements and ways to balance.',
    'privacy.html': "How GreatOhm collects, uses, stores and protects your data as a Data Fiduciary under India's DPDP Act 2023 — access, correction and erasure.",
    'services.html': 'Every GreatOhm service — Vedic astrology, kundli matching, numerology, palmistry, tarot, Vaastu, Nakshatra, Vedic calendar and AI tools in one app.',
    'supplement.html': "Global Commerce & Marketplace Supplement to GreatOhm's Terms — Dakshina, consent, payments, refunds, referrals, arbitration and regional notes."
};

var over = 0, wrote = 0;
Object.keys(TRIM).forEach(function (file) {
    var nd = TRIM[file];
    if (nd.length > 160) { over++; console.log('TOO-LONG(' + nd.length + ') ' + file); }
    var full = path.join(REPO, file);
    var src = fs.readFileSync(full, 'utf8');
    var before = src;
    src = src.replace(/(<meta name="description"\s+content=")[^"]*(")/, '$1' + nd + '$2');
    src = src.replace(/(<meta property="og:description" content=")[^"]*(")/, '$1' + nd + '$2');
    src = src.replace(/(<meta name="twitter:description" content=")[^"]*(")/, '$1' + nd + '$2');
    if (src !== before) { fs.writeFileSync(full, src, 'utf8'); wrote++; console.log('WROTE ' + file + ' (' + nd.length + ')'); }
    else { console.log('SAME  ' + file); }
});
console.log('trim done: wrote ' + wrote + ', over-length new: ' + over);