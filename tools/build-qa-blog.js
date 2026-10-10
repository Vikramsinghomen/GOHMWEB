/**
 * Generates two data-backed astrology Q&A blog posts in GOHMWEB-Repo:
 *
 *   1. "The 50 Questions Indians Ask Astrologers Most (Answered)"
 *   2. "The 50 Astrology Questions People Search For Worldwide (Answered)"
 *
 * Questions are drawn from real 2026 demand studies (GrahAI 10,432 questions,
 * Ishvaram 351,000 conversations, Kundli.me 1,400), VedicFeed's 75+ list,
 * AstroAsk's 109 questions, and British Vogue's most-googled-per-sign data.
 * Answers are written in a calm, plain-English, white-hat tone consistent with
 * the rest of the site — no fear-mongering, no fake promises.
 *
 * Reuses the site's shared header nav, footer, and .sub-page / .page-body /
 * .faq-list conventions, plus BlogPosting + BreadcrumbList + FAQPage JSON-LD.
 * Safe to re-run (deterministic output).
 *
 * Usage: node tools/build-qa-blog.js
 */
const fs = require('fs');
const path = require('path');

const REPO = path.resolve(__dirname, '..', 'GOHMWEB-Repo');
const PLAY = 'https://play.google.com/store/apps/details?id=com.greatohm.mobileapp';
const ORG_ID = 'https://www.greatohm.com/#organization';

const NAV_ITEMS = [
    ['Home', 'index.html#home'],
    ['What is GreatOhm?', 'index.html#what'],
    ['Our Services', 'services.html'],
    ['Why use it?', 'index.html#why'],
    ['Screenshots', 'index.html#screenshots'],
    ['Features', 'index.html#features'],
    ['Sciences', 'index.html#sciences'],
    ['FAQ', 'index.html#faq'],
    ['Blog', 'blog.html'],
    ['Download', 'index.html#download'],
    ['Join Us', 'join.html'],
    ['Contact', 'index.html#contact'],
];

function nav() {
    const items = NAV_ITEMS.map(([l, h]) => `                <li><a href="${h}">${l}</a></li>`).join('\n');
    return `    <header class="site-header">
        <nav class="nav container">
            <ul class="nav-links" id="navLinks">
${items}
            </ul>
            <a href="index.html#home" class="nav-brand">
                <span class="nav-logo">
                    <img src="assets/logo1-trim.png" alt="GreatOhm logo" class="nav-logo-a">
                </span>
                <span class="nav-tagline">A product of GREATOHM (OPC) PRIVATE LIMITED</span>
            </a>
            <button class="nav-toggle" id="navToggle" aria-label="Menu" aria-expanded="false" aria-controls="navLinks"><span></span><span></span><span></span></button>
        </nav>
    </header>`;
}

function footer() {
    return `    <footer class="site-footer">
        <div class="container footer-inner">
            <div class="footer-grid">
                <div class="footer-brand">
                    <img src="assets/logo1-trim.png" alt="GreatOhm" class="footer-logo">
                    <p>World's first Omni app for all Occult Sciences.</p>
                </div>
            <div class="footer-col">
                <h4 class="footer-col-title">Explore</h4>
                <ul class="footer-links">
                    <li><a href="index.html#home">Home</a></li>
                    <li><a href="about.html">About Us</a></li>
                    <li><a href="services.html">Our Services</a></li>
                    <li><a href="join.html">Join Us</a></li>
                </ul>
            </div>
            <div class="footer-col">
                <h4 class="footer-col-title">Sciences</h4>
                <ul class="footer-links">
                    <li><a href="astrology.html">Astrology</a></li>
                    <li><a href="numerology.html">Numerology</a></li>
                    <li><a href="tarot.html">Tarot</a></li>
                    <li><a href="vastu.html">Vastu</a></li>
                    <li><a href="palmistry.html">Palmistry</a></li>
                    <li><a href="kundli.html">Kundli</a></li>
                </ul>
            </div>
            <div class="footer-col">
                <h4 class="footer-col-title">Legal</h4>
                <ul class="footer-links">
                    <li><a href="privacy.html">Privacy Policy</a></li>
                    <li><a href="terms.html">Terms &amp; Conditions</a></li>
                    <li><a href="supplement.html">Commerce Supplement</a></li>
                    <li><a href="delete-account.html">Delete Account</a></li>
                </ul>
            </div>
            </div>
            <p class="footer-copy">&copy; 2026 GreatOhm. All rights reserved.<br><span class="footer-tagline">A product of GREATOHM (OPC) PRIVATE LIMITED</span></p>
        </div>
    </footer>

        <div class="disclaimer-tab" role="note" aria-label="Entertainment disclaimer">Strictly for entertainment, educational, self-reflection purposes only</div>

<script src="js/ohm-buddy.js"></script>
<script src="js/main.min.js"></script>`;
}
function head(p, faqJson) {
    const url = `https://www.greatohm.com/${p.slug}.html`;
    return `<!DOCTYPE html>
<html lang="en">

<head>

    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-9K6LV7CN4N"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        gtag('js', new Date());
        gtag('config', 'G-9K6LV7CN4N');
    </script>


    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${p.title} | GreatOhm</title>
    <meta name="description" content="${p.description}">
    <meta name="keywords" content="${p.keywords}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="icon" type="image/png" sizes="32x32" href="assets/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="assets/favicon-16x16.png">
    <link rel="apple-touch-icon" href="assets/apple-touch-icon.png">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap"
        rel="stylesheet">
    <link rel="stylesheet" href="css/styles.min.css">
    <link rel="stylesheet" href="css/ohm-buddy.css">
    <link rel="sitemap" type="application/xml" title="Sitemap" href="sitemap.xml">
    <link rel="canonical" href="${url}">
    <meta property="og:type" content="article">
    <meta property="og:site_name" content="GreatOhm">
    <meta property="og:title" content="${p.title} | GreatOhm">
    <meta property="og:description" content="${p.description}">
    <meta property="og:url" content="${url}">
    <meta property="og:image" content="https://www.greatohm.com/assets/og/${p.slug}-og.png">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="GreatOhm — ${p.title}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${p.title} | GreatOhm">
    <meta name="twitter:description" content="${p.description}">
    <meta name="twitter:image" content="https://www.greatohm.com/assets/og/${p.slug}-og.png">
    <meta name="twitter:image:alt" content="GreatOhm — ${p.title}">

    <!-- JSON-LD: BlogPosting + BreadcrumbList + FAQPage (AI-search visibility) -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "BlogPosting",
                "@id": "${url}#posting",
                "headline": ${JSON.stringify(p.title)},
                "description": ${JSON.stringify(p.description)},
                "datePublished": "${p.date}",
                "dateModified": "${p.date}",
                "author": { "@id": "${ORG_ID}" },
                "publisher": { "@id": "${ORG_ID}" },
                "mainEntityOfPage": "${url}",
                "inLanguage": "en",
                "articleSection": "${p.category}",
                "keywords": ${JSON.stringify(p.keywords)},
                "speakableSpecification": {
                    "@type": "SpeakableSpecification",
                    "cssSelector": [".page-title", ".faq-q"]
                }
            },
            {
                "@type": "BreadcrumbList",
                "@id": "${url}#breadcrumb",
                "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.greatohm.com/" },
                    { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://www.greatohm.com/blog.html" },
                    { "@type": "ListItem", "position": 3, "name": ${JSON.stringify(p.title)}, "item": "${url}" }
                ]
            },
            {
                "@type": "FAQPage",
                "@id": "${url}#faq",
                "mainEntity": ${faqJson}
            }
        ]
    }
    </script>
</head>`;
}
function renderBody(p) {
    let body = `                    <p>${p.intro}</p>\n`;
    for (const sec of p.sections) {
        body += `\n                    <h2>${sec.heading}</h2>\n`;
        if (sec.blurb) body += `                    <p>${sec.blurb}</p>\n`;
        for (const [q, a] of sec.qa) {
            body += `                    <h3>${q}</h3>\n                    <p>${a}</p>\n`;
        }
    }
    return body;
}

function faqJson(p) {
    const all = [];
    for (const sec of p.sections) for (const qa of sec.qa) all.push(qa);
    return JSON.stringify(all.map(([q, a]) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: a },
    })), null, 8).split('\n').map((l, i) => (i === 0 ? l : '    ' + l)).join('\n');
}

function faqList(p) {
    let out = `                    <h2>Quick Answers: The Questions at a Glance</h2>\n                    <div class="faq-list">\n`;
    for (const sec of p.sections) {
        for (const [q, a] of sec.qa) {
            out += `                        <div class="faq-item">\n                            <button class="faq-q">${q}<span class="faq-toggle">+</span></button>\n                            <div class="faq-a">\n                                <p>${a}</p>\n                            </div>\n                        </div>\n`;
        }
    }
    out += `                    </div>`;
    return out;
}

function render(p) {
    const url = `https://www.greatohm.com/${p.slug}.html`;
    return `${head(p, faqJson(p))}

<body>

    <!-- Floating stars -->
    <div class="stars" id="stars" aria-hidden="true"></div>

${nav()}

    <main>
        <section class="sub-page">
            <div class="container">
                <p class="breadcrumb"><a href="index.html">Home</a> &rsaquo; <a href="blog.html">Blog</a> &rsaquo; ${p.category}</p>
                <h1 class="page-title">${p.title}</h1>
                <p class="post-meta"><span class="post-tag">${p.category}</span> By GreatOhm &middot; Updated ${p.date}</p>

                <div class="page-body">
${renderBody(p)}
                    <div class="post-cta">
                        <p>Get clear, calm answers from your own birth chart — astrology, numerology, Vastu, tarot and more in one app.</p>
                        <a class="btn btn-primary" href="${PLAY}" target="_blank" rel="noopener">Get the Free App</a>
                        <a class="btn btn-outline" href="blog.html">More Guides</a>
                    </div>

${faqList(p)}

                    <div class="back-home">
                        <a href="blog.html">&larr; Back to the Blog</a>
                    </div>
                </div>
            </div>
        </section>
    </main>

${footer()}
</body>

</html>
`;
}
const POSTS = [
    {
        slug: 'blog-50-questions-indians-ask-astrologers',
        category: 'Astrology',
        title: '50 Questions Indians Ask Astrologers — Answered',
        date: '2026-10-10',
        description: 'Real questions Indian seekers ask astrologers, drawn from studies of hundreds of thousands of consultations. Clear, calm answers on career, marriage timing, doshas, muhurat, money and health.',
        keywords: 'questions to ask astrologer, what to ask astrologer in india, when will i get married astrology, when will i get a job astrology, career astrology questions, marriage timing kundli, dosha remedies',
        intro: `Across 2026, several studies analysed hundreds of thousands of real questions people in India
                    put to astrologers and AI Jyotish tools — 10,432 typed questions at GrahAI, 351,000
                    conversations at Ishvaram, and over 1,400 at Kundli.me. The findings are striking: career now
                    edges ahead of marriage, one question in four is really about <em>when</em>, and doshas like
                    Mangal Dosh and Pitra Dosh dominate people's worries. Below are the 50 questions that come up
                    again and again, grouped by theme, each answered plainly and without fear-mongering. Remember:
                    astrology is used for guidance and self-reflection, never as a substitute for professional
                    medical, financial or legal advice.`,
        sections: [
            {
                heading: 'Career & Work (India\u2019s #1 concern today)',
                blurb: `Career now leads marriage in the data — around 39% of first questions are about work, and
                    career is where "when" questions cluster most (nearly 39% of career questions ask about timing).`,
                qa: [
                    ['When will I get a job?',
                        `Astrologers look at your 10th house (karma bhava, career), its ruling planet, the current
                        dasha and Saturn\u2019s transit. A favourable dasha of the 10th lord or a supportive
                        Jupiter/Saturn transit often marks an opening. Use that period as a window to apply, upskill
                        and network actively.`],
                    ['Will I get a government (sarkari naukri) job?',
                        `Government-job "yoga" is linked to a strong Sun, the 6th house (service and competition) and
                        Saturn. Studies show about 15% of career questions mention government jobs or exams like UPSC,
                        SSC and banking. Astrologers usually suggest timing your attempt to a favourable dasha while
                        you keep preparing steadily.`],
                    ['Business or job — which is better for me?',
                        `A strong 7th house and Mercury favour independent business; a strong 10th and 6th favour
                        structured employment. Many charts show both, so the choice often comes down to your current
                        dasha: a Mercury or Venus period can favour starting something of your own.`],
                    ['Is this the right time to change my job?',
                        `Astrologers compare the running dasha with that of your 10th lord. A change during a weak or
                        afflicted period for your career lord is usually advised against; a supportive Jupiter transit
                        over your 10th or ascendant is considered a good window.`],
                    ['Will I get a promotion or recognition at work?',
                        `The 11th house (gains) and the strength of the Sun matter here. A favourable Sun dasha or a
                        Jupiter transit to the 10th/11th is traditionally seen as a period of visibility and reward for
                        effort already put in.`],
                    ['Is working or settling abroad indicated in my chart?',
                        `"Videsh yoga" is read from the 12th house (foreign lands), the 9th (long journeys) and the
                        influence of Rahu and Saturn. If present, a favourable period for the 12th lord or Rahu is
                        often pointed to as the timing to pursue it.`],
                    ['Why do I keep getting rejected despite working hard?',
                        `Astrologers may look at afflictions to the 10th house or a difficult Saturn period, which
                        classically tests patience. The traditional advice is to use the period to build skill and
                        resilience, since Saturn rewards sustained effort over time.`],
                    ['Which career field suits me best?',
                        `Planets map to fields: Mercury to communication and commerce, Mars to engineering and defence,
                        Venus to arts, Jupiter to teaching and law, Saturn to research. The strongest planet in your
                        10th house or as your 10th lord is usually the starting point.`],
                    ['Will my business succeed?',
                        `The 7th house (partnerships), 11th (profits) and Mercury (trade) are examined with the current
                        dasha. A strong Mercury in a supportive period is considered favourable — paired with practical
                        planning rather than a promise.`],
                ],
            },
            {
                heading: 'Marriage & Relationships',
                blurb: `Still the dominant theme for people in their 20s — about 24–29% of questions, and around
                    35% of marriage questions are really "when will it happen?"`,
                qa: [
                    ['When will I get married?',
                        `Marriage timing is read from the 7th house, its lord, Venus (for men) / Jupiter (for women) and
                        the Venus dasha. Astrologers point to a dasha or transit of the 7th lord or Venus as the most
                        likely window rather than a fixed date.`],
                    ['Is there a delay in my marriage, and why?',
                        `Delays are attributed to Saturn afflicting the 7th house or its lord, a weak Venus, or a dosha
                        like Mangal Dosh. Astrologers then look for when the affliction eases — usually the start of a
                        favourable Venus or 7th-lord period.`],
                    ['Will it be a love marriage or an arranged marriage?',
                        `A strong 5th house (romance) with Rahu's influence often indicates love marriage; a strong 7th
                        with traditional benefic influence leans arranged. About 11% of marriage questions weigh love
                        versus arranged specifically.`],
                    ['Is my partner and I compatible (kundli matching)?',
                        `Kundli Milan compares the Moon signs of both partners using the Ashtakoota system — 36 points
                        across eight factors. Astrologers look at the overall score plus specific factors like Mangal
                        Dosh, Nadi and Bhakoot.`],
                    ['Does Mangal Dosh mean I can\u2019t get married?',
                        `No. Mangal Dosh (Mars in the 1st, 4th, 7th, 8th or 12th house) is common and often cancels out
                        — for example if Mars is in its own sign, or if both partners are Manglik. It is the single
                        biggest dosha worry in the data, but it is rarely a real barrier.`],
                    ['Will my marriage be happy?',
                        `The condition of the 7th house, its lord and benefic aspects (especially from Jupiter) are
                        examined. A well-placed 7th lord with Jupiter's blessing is considered a strong indicator of a
                        stable, supportive marriage.`],
                    ['When will I meet my life partner?',
                        `Astrologers look at the dasha of the 7th lord, Venus, or the lord of the 5th/11th to time a
                        meeting, often linking it to a period when Venus or the Moon is strongly activated.`],
                    ['Is a second marriage indicated in my chart?',
                        `This is read from afflictions to the 7th house, the influence of Rahu or a afflicted Venus, and
                        the Navamsa (D9) chart. Astrologers treat it as a possibility to understand, not a certainty.`],
                    ['My relationship is struggling — will it survive?',
                        `Astrologers compare both charts (synastry) and the current dasha affecting the 7th house.
                        Difficult transits are often seen as temporary phases to work through, with remedies and
                        patience suggested.`],
                    ['How do I improve my relationship with my spouse?',
                        `Beyond chart analysis, astrologers suggest strengthening Venus (for harmony), observing simple
                        remedies, and using favourable periods for important conversations. Practical communication
                        always matters more than any gemstone.`],
                ],
            },
            {
                heading: 'Doshas & Remedies (India\u2019s #3 concern)',
                blurb: `Around 22% of first questions are about doshas. Mangal Dosh leads (25%), followed by Pitra
                    Dosh (23%), Shani Dosh / Sade Sati (19%), Rahu (13%), Kaal Sarp (10%) and Ketu (9%).`,
                qa: [
                    ['Do I have Mangal Dosh, and how do I cancel it?',
                        `Check Mars' placement from the Moon, ascendant and Venus. It is considered cancelled if Mars
                        is in its own or exaltation sign, after age 28, or if both partners are Manglik. Astrologers
                        also suggest Kumbh Vivah, Hanuman Chalisa or Tuesday charity as traditional remedies.`],
                    ['What is Kaal Sarp Dosh and is it affecting me?',
                        `Formed when all seven planets fall between Rahu and Ketu. Many astrologers consider it
                        influential rather than always harmful. Remedies include Shiva worship, Rahu-Ketu mantras and
                        charity — but a full-chart reading matters more than the label.`],
                    ['What is Pitra Dosh and how do I remove it?',
                        `Linked to the Sun, Saturn and the 9th house, and to rites for ancestors. It is the
                        second-biggest dosha worry. Traditional remedies include Shraddh ceremonies, feeding the needy,
                        and worshipping Lord Shiva or Vishnu on specific days.`],
                    ['Am I going through Sade Sati right now?',
                        `Sade Sati is Saturn transiting the sign before, on, and after your Moon sign — about 7.5
                        years. Astrologers check where Saturn currently sits relative to your Janma Rashi to tell you
                        which of the three phases you are in.`],
                    ['How do I reduce the effects of Shani (Saturn)?',
                        `Discipline, honesty and helping the underprivileged are the classic Shani remedies, along with
                        Saturday charity, Shani mantra and wearing blue or black. Saturn rewards effort and patience
                        above all else.`],
                    ['Does Rahu/Ketu Dosh affect my life?',
                        `Rahu and Ketu (the lunar nodes) are linked to sudden changes, obsession and karmic lessons.
                        Astrologers read their house placement and aspects rather than treating the presence alone as
                        bad.`],
                    ['Which gemstone should I wear?',
                        `Gemstones are chosen to strengthen a weak but benefic planet — for example blue sapphire for
                        Saturn, yellow sapphire for Jupiter. Astrologers always recommend a trial period and warn
                        against wearing a stone for an already-strong or malefic planet.`],
                    ['Are remedies really necessary, or is effort enough?',
                        `Most ethical astrologers say effort, timing and self-awareness come first; remedies are
                        supportive. This is why a good reading focuses on your strengths and timing rather than fear.`],
                    ['Can my dosha be fixed completely?',
                        `Rather than "fixing," astrologers speak of reducing a dosha's impact through timing, lifestyle
                        and traditional remedies, while you work on the practical side of the same problem.`],
                ],
            },
            {
                heading: 'Timing & Muhurat',
                blurb: `One question in four is really about "when" — and timing lookups (panchang, muhurat,
                    choghadiya) peak on Saturdays, Shani\u2019s day.`,
                qa: [
                    ['What is a shubh muhurat?',
                        `A muhurat is an auspicious time window chosen from the Panchang, when the tithi, nakshatra,
                        yoga and weekday align favourably. It is used for weddings, Griha Pravesh, business launches
                        and vehicle purchases.`],
                    ['When is the best muhurat for my wedding?',
                        `Astrologers check the compatibility of both charts, then find a window when Venus and the
                        7th-lord are strong and no inauspicious transit (like Rahu Kaal) falls in the ceremony.`],
                    ['When should I buy a house or start construction?',
                        `The 4th house (property), its lord and a favourable Moon period are considered, along with a
                        muhurat free of Rahu Kaal and other inauspicious periods from the Panchang.`],
                    ['When is a good time to start a new business?',
                        `A strong Mercury, a favourable 10th/11th-lord dasha and a muhurat aligned with your
                        ascendant's favourable periods are traditionally chosen for a launch.`],
                    ['What is Rahu Kaal and should I avoid it?',
                        `Rahu Kaal is a roughly 90-minute inauspicious period each day, varying by weekday. Tradition
                        advises avoiding starting new ventures or ceremonies during it.`],
                    ['What is the difference between a muhurat and panchang?',
                        `The Panchang is the daily Vedic calendar of five elements (tithi, nakshatra, yoga, karana and
                        weekday). A muhurat is a specific auspicious window chosen from it for a particular event.`],
                ],
            },
            {
                heading: 'Money, Education, Health & Life',
                blurb: `Money is a steady undercurrent (2–7% of questions), alongside education and, rising with
                    age, health.`,
                qa: [
                    ['When will my financial situation improve?',
                        `The 2nd house (savings), 11th (gains) and their lords, plus the dasha of the wealth-giving
                        planets, are examined. A favourable Jupiter or Venus period is often linked to improvement.`],
                    ['Should I invest in the stock market?',
                        `Astrologers may check the strength of Mercury, Rahu and the 5th/11th houses (speculation and
                        gains). But this is for reflection only — never a substitute for qualified financial advice.`],
                    ['Will I become wealthy?',
                        `Dhana yogas are combinations of the 2nd, 5th, 9th and 11th houses and their benefic lords.
                        Their presence suggests potential; effort and smart decisions still do the work.`],
                    ['Which subject or stream should I choose?',
                        `Mercury favours commerce and communication, Mars engineering, Venus arts, Jupiter law and
                        philosophy. The strongest planet in the 4th/5th house usually guides the choice.`],
                    ['Will I do well in my exams?',
                        `The 4th/5th houses, Moon and Mercury are examined along with the transit during the exam
                        period. Astrologers pair this with a reminder that preparation is the real variable.`],
                    ['What does my chart say about my health?',
                        `The 6th house (illness), ascendant (vitality) and afflicted planets are studied. This is for
                        self-awareness only — always consult a qualified doctor for any health concern.`],
                    ['Will I have children, and when?',
                        `The 5th house (children), Jupiter and the Putra Karaka are examined, with the dasha of the
                        5th lord often used for timing.`],
                    ['What is my life purpose?',
                        `Read from the Sun (soul), the ascendant lord and the Nodes (Rahu/Ketu) which point to karmic
                        growth areas. Many astrologers frame this as a direction, not a fixed destiny.`],
                    ['Will my parents support my career choice?',
                        `The 9th house (father/fortune), 4th (mother/home) and the Moon are checked. If supportive
                        planets aspect the 10th, astrologers read it as a sign family will come around with
                        communication.`],
                    ['How do I improve my relationship with my parents?',
                        `The Sun (father) and Moon (mind/emotions) condition, plus the 4th/9th houses, are examined.
                        The 9th house also relates to the 4th, so strengthening one often eases the other.`],
                    ['When will I own my own house?',
                        `The 4th house, its lord, Mars (property) and a favourable Mars or Moon dasha are examined,
                        with timing tied to a supportive period for the 4th lord.`],
                    ['Should I buy a vehicle now?',
                        `A vehicle is read from Venus and the 4th house, timed to a favourable Venus dasha and a muhurat
                        free of Rahu Kaal and other inauspicious windows.`],
                    ['Will my court case or dispute be resolved?',
                        `The 6th house (litigation, enemies) and its lord are studied; astrologers look for when the 6th
                        lord's difficult period eases. This is for reflection only — always follow your lawyer's
                        advice.`],
                    ['When will my health improve?',
                        `The 6th house (disease), ascendant and the dasha of the affected planet are examined, with
                        timing tied to the easing of an affliction. A doctor's care always comes first.`],
                    ['What does this year hold for me?',
                        `This is the annual Varshphal reading — comparing the Sun's return chart and the year's
                        transits (especially Saturn, Jupiter and Rahu) against your birth chart.`],
                    ['How do I know if I am on the right path?',
                        `Astrologers compare your current dasha and transits to your chart's strengths, using the Nodes
                        as a compass. The honest answer is usually a direction to test, not a certainty to wait for.`],
                ],
            },
/* WORLD_POST */
        ],
    },
    {
        slug: 'blog-50-astrology-questions-worldwide',
        category: 'Astrology',
        title: '50 Astrology Questions the World Asks — Answered',
        date: '2026-10-10',
        description: 'The astrology questions people google most around the world, from "what is my rising sign" to "is astrology real." Clear, friendly answers on charts, compatibility, Mercury retrograde and more.',
        keywords: 'what is my rising sign, is astrology real, birth chart meaning, zodiac compatibility, mercury retrograde, sun moon rising sign, most searched astrology questions, astrology for beginners',
        intro: `Around the world, astrology is no niche hobby: roughly 5 million people search the single word
                    "horoscope" every month, about 30% of US adults consult astrology or tarot at least once a year, and
                    Google's most-searched astrology questions are remarkably consistent across countries. Below are
                    the 50 questions that dominate global search — the identity questions ("what is my rising sign?"),
                    the reality checks ("is astrology real?") and the practical ones (compatibility, Mercury retrograde,
                    charts) — each answered in plain, calm language.`,
        sections: [
            {
                heading: 'The "Big Three" & Chart Basics',
                blurb: `The most common identity questions are about the Sun, Moon and Rising signs — the "Big Three."`,
                qa: [
                    ['What is my rising sign (ascendant)?',
                        `Your rising sign is the zodiac sign that was on the eastern horizon at the exact moment you were
                        born. It changes roughly every two hours, so you need your birth time to know it. Many astrologers
                        consider it the "mask" you show the world and a strong influence on your appearance and first
                        impressions.`],
                    ['What is the difference between my sun, moon and rising sign?',
                        `Think of them as three layers: the Sun sign is your core self and ego, the Moon sign is your
                        emotional inner world, and the Rising sign is how you come across to others. Together they are
                        called the "Big Three."`],
                    ['How do I find my birth chart?',
                        `You need three things: your date of birth, exact time of birth and place of birth. Enter them into
                        a birth-chart calculator and it maps where every planet sat in the zodiac at that moment.`],
                    ['What is a natal chart?',
                        `A natal (or birth) chart is a snapshot of the sky at the moment you were born. It shows the
                        positions of the Sun, Moon and planets across the 12 zodiac signs and 12 houses, and is the
                        foundation of most astrological readings.`],
                    ['What are astrological houses?',
                        `The 12 houses are sectors of the chart that represent areas of life — self, money, communication,
                        home, creativity, work, relationships, transformation, travel, career, friendships and the
                        subconscious. A planet "in" a house colours that area of life.`],
                    ['What do the planets mean in astrology?',
                        `Each planet represents an energy: the Sun (ego/vitality), Moon (emotions), Mercury (communication),
                        Venus (love/values), Mars (drive), Jupiter (growth/luck), Saturn (discipline), and the outer
                        planets (Uranus, Neptune, Pluto) for generational themes.`],
                    ['What are aspects in a birth chart?',
                        `Aspects are the angles between planets — for example a trine (harmonious, 120°) or a square
                        (tense, 90°). They describe how the different parts of your personality interact.`],
                    ['What if I don\u2019t know my exact birth time?',
                        `You can still read your Sun, Moon (if the Moon didn't change sign that day) and planets. But your
                        Rising sign and houses need a birth time. Some astrologers can "rectify" a chart from major life
                        events.`],
                    ['What is a cusp sign?',
                        `If you were born right as the Sun moved from one sign to the next, you may feel traits of both.
                        Astronomically you belong to one sign, but the neighbouring sign's influence can be felt.`],
                    ['What are the four elements (fire, earth, air, water)?',
                        `The 12 signs group into four elements: Fire (Aries, Leo, Sagittarius) is passionate; Earth
                        (Taurus, Virgo, Capricorn) is practical; Air (Gemini, Libra, Aquarius) is intellectual; Water
                        (Cancer, Scorpio, Pisces) is emotional.`],
                ],
            },
            {
                heading: 'Zodiac Signs: The "Why Are They So\u2026?" Questions',
                blurb: `Google's most-searched question per sign is often a playful stereotype — "why are Leos so
                    dramatic?", "why are Scorpios so intense?" Here is a kinder, astrological take on each.`,
                qa: [
                    ['Why are Aries so impulsive?',
                        `Aries is the first sign, ruled by Mars — the planet of action. That fiery drive makes them quick
                        to start things, but it can also mean acting before thinking. Channelled well, it is courage and
                        initiative.`],
                    ['Why are Tauruses so stubborn?',
                        `Taurus is a fixed earth sign ruled by Venus. "Stubborn" is really steadiness — once committed,
                        they see things through. The same trait makes them loyal and reliable.`],
                    ['Why do Geminis have "two sides"?',
                        `Gemini is an air sign ruled by Mercury, symbolised by the Twins. Their duality is mental
                        flexibility — they can hold two viewpoints at once, which makes them adaptable and curious.`],
                    ['Why are Cancers so emotional?',
                        `Cancer is ruled by the Moon, which changes every 2.5 days. That lunar influence makes them deeply
                        feeling, nurturing and protective — their sensitivity is their strength.`],
                    ['Why are Leos so dramatic?',
                        `Leo is ruled by the Sun and thrives in the spotlight. What looks like drama is often a generous,
                        warm-hearted nature that wants to celebrate life and be seen.`],
                    ['Why are Virgos such perfectionists?',
                        `Virgo is an earth sign ruled by Mercury, detail-oriented and service-driven. Their "perfectionism"
                        is really a desire to be genuinely useful and get things right.`],
                    ['Why are Libras so indecisive?',
                        `Libra is an air sign ruled by Venus, obsessed with fairness. They weigh every side carefully,
                        which can look like indecision but is actually a search for balance.`],
                    ['Why are Scorpios so intense?',
                        `Scorpio is a fixed water sign ruled by Mars and Pluto. They feel everything deeply and commit
                        fully — that intensity is loyalty and passion rather than drama.`],
                    ['Why are Sagittariuses so restless?',
                        `Sagittarius is a fire sign ruled by Jupiter, the planet of expansion. Their restlessness is a
                        hunger for meaning, travel and new ideas.`],
                    ['Why are Capricorns so ambitious?',
                        `Capricorn is an earth sign ruled by Saturn, the taskmaster planet. Their ambition is really
                        patience and a long-term vision — they build things that last.`],
                    ['Why are Aquariuses so unconventional?',
                        `Aquarius is a fixed air sign ruled by Saturn and Uranus. They are visionaries who question the
                        status quo, which can read as distant or eccentric but is genuinely forward-thinking.`],
                    ['Why are Pisces so dreamy?',
                        `Pisces is a water sign ruled by Neptune, the planet of imagination. Their "dreaminess" is deep
                        empathy, creativity and intuition.`],
                ],
            },
            {
                heading: 'Compatibility, Love & Relationships',
                blurb: `After identity questions, compatibility is the most-searched practical topic worldwide.`,
                qa: [
                    ['Which zodiac signs are most compatible?',
                        `Signs of the same element (fire with fire, water with water) often flow easily, and signs of
                        compatible elements (fire with air, earth with water) tend to balance each other. But the whole
                        chart matters far more than sun signs alone.`],
                    ['Are opposite signs compatible?',
                        `Signs opposite each other (like Aries and Libra) are often magnetic — they offer what the other
                        lacks. This "opposites attract" dynamic can be complementary or challenging, depending on both
                        charts.`],
                    ['Which sign is the best match for me?',
                        `There is no single "best" sign. Astrologers compare full birth charts (synastry), especially the
                        Moon, Venus and Mars placements, rather than judging by sun sign alone.`],
                    ['When will I meet my soulmate?',
                        `Astrologers look to Venus and Jupiter transits, and the progressions of your chart, for timing
                        around relationships. Treat it as a window to stay open, not a promise of a date.`],
                    ['What does Venus in my chart say about love?',
                        `Venus shows how you give and receive affection, what you find beautiful and what you value in
                        relationships. Its sign and house reveal your romantic style.`],
                    ['Why do I keep attracting the same type of partner?',
                        `Repeating patterns are often linked to your 7th house, Venus/Mars placements and the Lunar Nodes,
                        which astrologers read as karmic lessons to work through consciously.`],
                ],
            },
            {
                heading: 'Mercury Retrograde, Transits & Skeptics',
                blurb: `"Mercury retrograde" is one of astrology's most reliable search spikes, and "is astrology
                    real?" is the world's biggest reality check.`,
                qa: [
                    ['What is Mercury retrograde?',
                        `A few times a year Mercury appears to move backwards in the sky. Astrologers associate it with
                        miscommunication, travel hiccups and tech glitches, and suggest double-checking plans.`],
                    ['How often does Mercury retrograde happen?',
                        `About three to four times a year, each lasting roughly three weeks. Searches for it spike sharply
                        on Google Trends at the start of each one.`],
                    ['Is astrology real?',
                        `Astrology is a symbolic and reflective system, not a science that makes testable predictions the
                        way physics does. Many people find it genuinely useful for self-reflection — and research mostly
                        treats it as entertainment. You can value it as a tool for insight without treating it as proven
                        fact.`],
                    ['Is there any scientific evidence for astrology?',
                        `Controlled studies have not found reliable evidence that star positions predict personality or
                        events. Believers tend to value astrology for meaning and reflection rather than empirical proof —
                        and that is a fair way to use it.`],
                    ['What is the difference between Vedic and Western astrology?',
                        `Western astrology uses the tropical zodiac (tied to seasons); Vedic (Jyotish) uses the sidereal
                        zodiac and the actual constellations, plus tools like dashas and nakshatras. They often give
                        different sun signs.`],
                    ['Why do horoscopes sometimes feel so accurate?',
                        `Horoscopes are written broadly enough to resonate with many situations — a phenomenon psychology
                        calls the Barnum effect. They can still be a useful prompt for reflection.`],
                    ['What is a Saturn return?',
                        `Around ages 29, 58 and 86, Saturn returns to its birth position. Astrologers associate it with
                        major life milestones, responsibility and maturing into a new chapter.`],
                    ['How often should I read my horoscope?',
                        `Daily for a light check-in, or weekly for a broader theme. Astrologers suggest focusing on your
                        rising sign for daily reads, since it changes faster and is more personal.`],
                    ['Can my star sign really predict my future?',
                        `Astrologers describe it as mapping tendencies and timing, not fixed fate. Most see it as a way to
                        make conscious choices, with your own decisions doing most of the work.`],
                ],
            },
            {
                heading: 'Life, Self & Everyday Astrology',
                blurb: `The rest of the world's most-searched questions are about applying astrology to career,
                    money, self-understanding and daily life.`,
                qa: [
                    ['What career suits my zodiac sign?',
                        `Astrologers read your 10th house (Midheaven), its ruling planet and Saturn. Fire signs often
                        thrive in leadership and enterprise; earth in practical, hands-on fields; air in communication
                        and ideas; water in caring and creative roles.`],
                    ['When is the best time to make a big decision?',
                        `Astrologers look for supportive transits — a harmonious Jupiter aspect is considered a growth
                        window, while a Mercury retrograde or tense Mars transit suggests waiting and double-checking.`],
                    ['Why do I feel like I don\u2019t fit my sun sign?',
                        `Your sun sign is only one part of the chart. If your Moon, Rising or a cluster of planets sit in
                        another sign, that can dominate how you actually feel and behave.`],
                    ['What is my "dominant" planet or element?',
                        `Count which element or planet appears most across your chart. A "dominant fire" person, for
                        example, tends to be energetic and enthusiastic regardless of sun sign.`],
                    ['What is a lunar node and the north node?',
                        `The lunar nodes are where the Moon's orbit crosses the Sun's. Astrologers see the North Node as
                        your soul's growth direction and the South Node as comfort zones and past patterns to move
                        beyond.`],
                    ['How can I use astrology for self-improvement?',
                        `Use it as a mirror, not a rulebook. Notice your chart's themes — where you lean, where you
                        resist — and set intentions around them. Astrology works best paired with real-world action.`],
                    ['Does astrology work for pets and objects?',
                        `Some people cast charts for events ("electional astrology") or even pets for fun. Traditional
                        astrology is designed for people and moments, so treat pet charts as playful rather than
                        serious.`],
                    ['What is a solar return chart?',
                        `A chart cast for the moment the Sun returns to its exact birth position each year — your
                        "birthday chart." Astrologers use it to theme the year ahead.`],
                    ['What does it mean if two planets are in the same sign?',
                        `It's called a stellium when three or more gather in one sign or house, concentrating that
                        sign's energy strongly in your personality and life.`],
                    ['Which zodiac sign is the rarest?',
                        `Depending on the year and location, some signs (like Scorpio or Aquarius seasons, which are
                        shorter in some calendars) have fewer births, so they are often called "rare."`],
                    ['Can astrology predict health or money?',
                        `Some traditions map signs to body areas or wealth houses, but responsible astrologers treat these
                        as reflective, not diagnostic — and always defer to doctors and financial professionals.`],
                    ['How do I read my own chart as a beginner?',
                        `Start with the Big Three (Sun, Moon, Rising), then note which house each sits in and the sign on
                        each house cusp. Read one piece at a time rather than trying to interpret everything at once.`],
                    ['Is it bad luck if Venus or Mars is retrograde when I\u2019m born?',
                        `No. Retrograde planets are common and simply describe an inward or reflective style of that
                        planet's energy — for example Venus retrograde often signals a private approach to love.`],
                ],
            },
        ],
    },
];

for (const p of POSTS) {
    const out = path.join(REPO, p.slug + '.html');
    fs.writeFileSync(out, render(p), 'utf8');
    const n = p.sections.reduce((s, sec) => s + sec.qa.length, 0);
    console.log('WROTE ' + p.slug + '.html  (' + n + ' Q&As)');
}
console.log('\n' + POSTS.length + ' Q&A post(s) generated in ' + REPO);

