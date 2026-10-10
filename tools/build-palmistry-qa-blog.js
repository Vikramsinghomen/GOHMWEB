/**
 * Generates two data-backed palmistry Q&A blog posts in GOHMWEB-Repo:
 *
 *   1. "The 50 Palmistry Questions Indians Ask Most — Answered"
 *   2. "The 50 Palmistry Questions People Search For Worldwide — Answered"
 *
 * Content draws on the widely-read palmistry references: wikiHow's complete
 * palm-reading guide (the four major lines + sun line + hand/finger reading),
 * Wikipedia's palmistry overview (Sāmudrika Śāstra / Hast-rekhā roots,
 * dermatoglyphics, the pseudoscience framing), and AstroSage's Vedic palmistry
 * guide. Answers are calm, plain-English and white-hat — no "your life line is
 * broken, you will die young" fear-mongering, and honest notes that palmistry
 * is for reflection, not prediction or medical advice.
 *
 * Reuses the site's shared header nav, footer, and .sub-page / .page-body /
 * .faq-list conventions, plus BlogPosting + BreadcrumbList + FAQPage JSON-LD.
 * Safe to re-run (deterministic output).
 *
 * Usage: node tools/build-palmistry-qa-blog.js
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
                        <p>Get an AI palm reading from a photo, plus astrology, numerology, Vaastu, tarot and more — all in one app.</p>
                        <a class="btn btn-primary" href="${PLAY}" target="_blank" rel="noopener">Get the Free App</a>
                        <a class="btn btn-outline" href="palmistry.html">Palmistry Tools</a>
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
        slug: 'blog-50-palmistry-questions-indians-ask',
        category: 'Palmistry',
        title: 'The 50 Palmistry Questions Indians Ask Most — Answered',
        date: '2026-10-10',
        description: 'The palmistry questions Indian readers ask most — the major lines, mounts, hand shapes, marriage and fate lines, lucky signs, left vs right hand, and whether lines can change — answered plainly, without fear.',
        keywords: 'palmistry questions, hast rekha, palm reading in india, life line meaning, heart line, head line, fate line, marriage line, mount of venus, lucky signs on palm, do palm lines change',
        intro: `In India, palmistry — Hast Rekha Shastra, a branch of the ancient Sāmudrika Śāstra — is often
                    the first thing family elders check. Does a short life line really mean a short life? Which hand do
                    women read? Is a broken line a bad omen? Drawing on the questions readers ask most (from the
                    classical line-and-mount teachings to the everyday worries about marriage, money and health), here
                    are the 50 that come up again and again — answered calmly. A quick, honest note: palmistry is a
                    symbolic, reflective art, not a proven science, and nothing here replaces medical, financial or legal
                    advice.`,
        sections: [
            {
                heading: 'Palmistry Basics & Common Fears',
                blurb: `What palmistry is, how it is read in India, and the worries that come up first.`,
                qa: [
                    ['What is palmistry (Hast Rekha Shastra)?',
                        `Palmistry is the study of the lines, mounts and shape of the hands to understand personality and
                        life tendencies. In India it is called Hast Rekha Shastra and is treated as part of the broader
                        Sāmudrika Śāstra, the science of bodily marks.`],
                    ['Which hand should I read — left or right?',
                        `A common Indian convention: the passive/left hand shows inherited potential and the active/right
                        hand shows what you have made of it. Many read the dominant hand as primary, but studying both
                        together gives the fullest picture.`],
                    ['Do palm lines really change over time?',
                        `Yes — lines can fade, deepen or shift as your habits, choices and health change. Many palmists read
                        this as a hopeful sign: your hands reflect your present, not a fixed destiny.`],
                    ['Does a short life line mean a short life?',
                        `No. This is the most common and most unfair fear. A "life line" reflects vitality and major life
                        changes, not a countdown. Length has no proven link to longevity.`],
                    ['Is a broken life line a bad omen?',
                        `Traditionally a break can indicate a major change or disruption, not death. Modern palmists read it
                        as a transition point, often alongside supporting lines that soften it.`],
                    ['Is palmistry scientific?',
                        `Palmistry is widely regarded as a pseudoscience because interpretations conflict and predictions
                        are not supported by evidence. Many people still value it as a fun, reflective tool for
                        self-awareness.`],
                    ['Can palmistry predict my exact future?',
                        `No serious palmist claims exact predictions. It points to tendencies and themes; your choices and
                        circumstances shape what actually happens.`],
                    ['Is palmistry connected to astrology?',
                        `In the Vedic view, yes — palmistry is grouped with astrology and face reading under Sāmudrika
                        Shastra, and a good reader may cross-check it with your birth chart.`],
                    ['Does palmistry work the same for men and women?',
                        `The lines mean the same things, though the traditional left/right-hand convention often differs by
                        gender. The hand\u2019s shape and lines matter more than gender rules.`],
                    ['Can I read my own palm?',
                        `Yes — you can learn the major lines and mounts on your own hand. Many apps, including GreatOhm, can
                        guide a beginner through reading their dominant hand from a photo.`],
                ],
            },
            {
                heading: 'The Four Major Lines',
                blurb: `The heart, head, life and fate lines — the backbone of every palm reading.`,
                qa: [
                    ['What does the heart line reveal?',
                        `The heart line (near the top of the palm, under the fingers) relates to emotions and relationships.
                        Its curve, length and breaks are read as your approach to love, feelings and connection.`],
                    ['What does a long heart line mean?',
                        `A long heart line that curves up is often read as expressive and warm in relationships; one that is
                        straight may suggest a more practical, guarded approach to emotions.`],
                    ['What does the head line show?',
                        `The head line (across the middle of the palm) relates to thinking, learning and decision-making. Its
                        length and slope are read as your mental style — analytical, creative or intuitive.`],
                    ['Does a long head line mean high intelligence?',
                        `Not literally. A longer head line is traditionally linked to a more analytical, detail-oriented mind,
                        but intelligence has no proven link to any line\u2019s length.`],
                    ['What does a short head line mean?',
                        `A shorter head line is often read as a quick, instinctive thinker who prefers action over long
                        analysis — a style, not a limitation.`],
                    ['What does the life line indicate?',
                        `The life line curves around the thumb and relates to vitality, energy and major life changes — not
                        lifespan. A strong, clear line suggests robustness and stability.`],
                    ['What is the fate line and what does it mean?',
                        `The fate line (running up the centre toward a finger) relates to career, purpose and how much life is
                        shaped by duty versus choice. A clear line suggests focus; a faint one suggests a more self-directed
                        path.`],
                    ['What if I don\u2019t have a fate line?',
                        `Many people have a faint or absent fate line, and it is not a bad sign. It is often read as someone
                        who changes direction in life and carves their own path rather than following a set career.`],
                    ['What does a forked line mean?',
                        `A fork at the end of a line is often read as multiple possibilities or a talent used in more than one
                        direction — for example a forked head line suggesting broad interests.`],
                    ['What does a chained or island on a line mean?',
                        `Traditionally, chains or small islands are read as periods of stress, confusion or health worries to
                        be aware of. Modern readers treat them as prompts for self-care, not fixed misfortune.`],
                ],
            },
            {
                heading: 'Marriage, Sun Line, Mounts & Health',
                blurb: `The specific lines and mounts Indian readers ask about most — love, fame and vitality.`,
                qa: [
                    ['What do the marriage lines show?',
                        `The small horizontal lines under the little finger (the "relationship lines") are traditionally read
                        for significant relationships and commitments. Their number and clarity are interpreted as
                        meaningful bonds, not a count of marriages.`],
                    ['Do many marriage lines mean many marriages?',
                        `Not necessarily. Palmists usually read strong relationship lines as deep attachments; extra or faint
                        lines are often seen as important relationships rather than multiple marriages.`],
                    ['What is the sun line and what does it indicate?',
                        `The sun line (also called the Apollo line) runs parallel to the fate line toward the ring finger. It
                        is traditionally linked to creativity, recognition, fame and good fortune.`],
                    ['What does a strong sun line mean?',
                        `A clear sun line is often read as a sign of public recognition, creative success or a fortunate
                        reputation — though success still depends on your effort.`],
                    ['What are the mounts of the palm?',
                        `Mounts are the fleshy pads at the base of each finger and the thumb, each named after a planet:
                        Venus, Jupiter, Saturn, Sun (Apollo), Mercury, Mars and the Moon. Their development is read as the
                        strength of those qualities.`],
                    ['What does a strong mount of Venus mean?',
                        `The mount of Venus (at the thumb base) relates to love, affection and vitality. A well-developed one
                        is read as warmth, passion and robust energy.`],
                    ['What does the mount of Jupiter represent?',
                        `The mount of Jupiter (below the index finger) relates to ambition, leadership and confidence. A strong
                        one suggests drive and a sense of purpose.`],
                    ['What does the mount of Saturn indicate?',
                        `The mount of Saturn (below the middle finger) relates to wisdom, discipline and seriousness. A
                        balanced one suggests depth and self-control.`],
                    ['Is there a health line on the palm?',
                        `Some traditions read a "line of health" (the mercury line, toward the little finger) for wellbeing
                        and vitality. It is a reflection to discuss with a doctor, never a diagnosis — palms cannot detect
                        illness.`],
                    ['Can my palm show health problems?',
                        `Palmistry cannot diagnose disease. While some readers look for signs linked to vitality, any real
                        health concern must be checked by a qualified medical professional.`],
                ],
            },
            {
                heading: 'Hand Shape, Fingers, Lucky Signs & Doubts',
                blurb: `The shape of the hand, the fingers, and the special markings people love to look for.`,
                qa: [
                    ['What do the different hand shapes mean?',
                        `Hands are grouped into elements — earth (practical), air (intellectual), water (emotional) and fire
                        (energetic). The shape is read as your general temperament and how you approach life.`],
                    ['What does a square palm indicate?',
                        `A square palm is often read as practical, reliable and methodical — someone who values order and
                        gets things done steadily.`],
                    ['What does the thumb reveal?',
                        `The thumb relates to willpower and logic. How firmly it sits and how flexible it is are read as your
                        drive, self-control and temperament.`],
                    ['What does a flexible thumb mean?',
                        `A flexible thumb is often read as adaptable and generous, while a stiffer thumb suggests
                        determination and strong will.`],
                    ['What do long fingers indicate?',
                        `Longer fingers are traditionally read as detail-oriented and thoughtful; shorter fingers as
                        big-picture, quick-decision people. It is a tendency, not a rule.`],
                    ['Are there "lucky" signs on the palm?',
                        `Some markings — like a triangle, star or fish shape — are traditionally considered auspicious, often
                        linked to talent or fortune. Treat them as encouraging symbols rather than guarantees.`],
                    ['What is a cross or square marking on the palm?',
                        `A cross is often read as a sign of protection or a challenge overcome; a square is sometimes seen as
                        a protective mark. Interpretations vary between teachers.`],
                    ['Does a "money triangle" on the palm mean wealth?',
                        `A triangle formed by certain lines is popularly linked to financial skill. It may reflect a practical
                        money sense, but real wealth depends on effort, choices and circumstances.`],
                    ['Can palmistry tell me when I will marry?',
                        `Some palmists link the timing of the fate or relationship lines to life stages, but no line gives a
                        reliable date. Treat any timing as symbolic, not a schedule.`],
                    ['Should I be worried if a palmist predicts something bad?',
                        `No. Ethical palmists avoid fear-based predictions. If a reading frightens you, treat it as one
                        opinion — your choices, and qualified professional advice, matter far more than any mark on your
                        hand.`],
                ],
            },
            {
                heading: 'Career, Love, Compatibility & Practical Doubts',
                blurb: `How people apply palmistry to real-life questions — and the honest limits.`,
                qa: [
                    ['Can my palm tell me which career suits me?',
                        `Palmists read the fate line, head line and mounts to suggest fields that match your strengths — for
                        example a strong Mercury mount for communication. Use it as one input alongside your skills and
                        interests.`],
                    ['Does a clear fate line mean career success?',
                        `A clear fate line is often linked to focus and a steady path, but success depends on effort,
                        opportunity and choices. The line suggests direction, not a guaranteed outcome.`],
                    ['Can palmistry tell me about my love life?',
                        `The heart line and relationship lines are read for your emotional style and significant bonds. They
                        describe tendencies, not specific people or dates.`],
                    ['Are two people\u2019s palms checked for compatibility?',
                        `Some palmists compare both hands to discuss how two people relate. It is a symbolic conversation
                        starter — real compatibility depends on communication and effort.`],
                    ['What does it mean if my heart line and head line are joined?',
                        `When the heart and head lines merge into one, it is sometimes called a "simian line." It is often read
                        as someone whose thinking and feeling are closely linked — intense and wholehearted.`],
                    ['Is having a simian line rare or special?',
                        `A simian line (a single line across the palm) appears in a small percentage of people. It is read as a
                        distinctive, passionate nature, not a defect.`],
                    ['Can palm reading help me make a big decision?',
                        `It can be a reflective prompt — many people use a reading to think about their strengths and
                        direction. But major decisions about health, money or law should rely on qualified professionals.`],
                    ['How often should I get my palm read?',
                        `There is no need to read often. Because lines can shift, a reading a year or at a life crossroads is
                        enough for reflection.`],
                    ['Should I pay a lot for a palm reading?',
                        `Be cautious of anyone who charges heavily or uses fear to push expensive remedies. A good reading
                        focuses on your strengths and possibilities, not dread.`],
                    ['How is palmistry different from astrology?',
                        `Astrology maps the planets at your birth across a full chart; palmistry reads the lines and shape of
                        your hands. Palmistry needs only your hand, while astrology needs your exact birth time and place.`],
                ],
            },
/* WORLD_PALM_POST */
        ],
    },
    {
        slug: 'blog-50-palmistry-questions-worldwide',
        category: 'Palmistry',
        title: '50 Palmistry Questions the World Asks — Answered',
        date: '2026-10-10',
        description: 'The palm-reading questions people google most worldwide — the four major lines, mounts, hand shapes, dominant hand, whether lines change and "is palm reading real?" — answered in plain, friendly language.',
        keywords: 'palmistry questions, how to read palms, what is palmistry, heart line meaning, head line, life line, fate line, dominant hand, do palm lines change, is palm reading real, palm reading for beginners',
        intro: `Palm reading — also called palmistry or chiromancy — is one of the world's most-searched
                    divination topics, with roots in Indian astrology and Roman fortune-telling. Most searches are
                    refreshingly simple: What does my heart line mean? Which hand do I read? Can my lines really change?
                    Is it real? Drawing on the most-read beginner guides, here are the 50 questions people look up most
                    — answered clearly, with the honest reminder that palmistry is a symbolic, reflective art rather than
                    proven science.`,
        sections: [
            {
                heading: 'Palmistry Basics & the Big Questions',
                blurb: `What palmistry is, which hand to read, and the honest "is it real?" question.`,
                qa: [
                    ['What is palmistry?',
                        `Palmistry (also called palm reading, chiromancy or cheirology) is the practice of interpreting the
                        lines, mounts and shape of the hands to reflect on personality and life themes.`],
                    ['What are the four major lines?',
                        `The four major lines are the heart line, head line, life line and fate line. Each relates to a
                        different area: emotions, thinking, vitality and life direction.`],
                    ['Which hand should I read — dominant or non-dominant?',
                        `A common view: the dominant hand reflects your present and future (what you've made of your
                        potential), while the non-dominant reflects inherited traits. Many readers focus on the dominant
                        hand.`],
                    ['What is the difference between palmistry and chiromancy?',
                        `They are essentially the same thing. "Chiromancy" and "cheirology" are older or more formal names for
                        palm reading; "palmistry" is the most common modern term.`],
                    ['Is palm reading real?',
                        `Palmistry is widely regarded as a pseudoscience, since interpretations conflict and predictions lack
                        evidence. Many people still find it a fun, insightful tool for self-reflection.`],
                    ['Can your palm lines change?',
                        `Yes. Lines can fade, deepen or shift over time as your habits and experiences change, which many
                        palmists see as a hopeful, empowering sign.`],
                    ['Does palmistry predict the future?',
                        `It points to tendencies and themes rather than fixed events. Most ethical palmists frame it as a
                        mirror for reflection, not a crystal-ball prediction.`],
                    ['Where does palmistry come from?',
                        `It has ancient roots across India, China, Tibet and the Mediterranean. In India it sits within
                        Sāmudrika Śāstra; in Europe it grew through medieval and Romani traditions.`],
                    ['Is palmistry connected to astrology?',
                        `They are sister divination arts. Some readers combine a palm reading with a birth chart, using each
                        to add nuance to the other.`],
                    ['How do I start learning to read palms?',
                        `Begin with the four major lines, then learn the mounts and hand shapes. Reading your own dominant
                        hand first is the easiest way to practice.`],
                    ['What does "palmistry" literally mean?',
                        `It comes from the palm of the hand — the practice of reading it. "Chiromancy" combines the Greek for
                        "hand" and "divination," and "cheirology" means the study of the hand.`],
                    ['Do both hands matter, or just one?',
                        `Many readers compare both — the dominant for your current self, the non-dominant for inherited
                        traits. Reading both together gives the richest picture.`],
                    ['Is palmistry a religion?',
                        `No. It is a divination and self-reflection practice found across many cultures and faiths. People of
                        any belief — or none — read palms for fun and insight.`],
                    ['Can children have their palms read?',
                        `Yes, gently — many read a child's palm to discuss their personality. Keep it light and encouraging,
                        with no scary predictions.`],
                ],
            },
            {
                heading: 'The Four Major Lines Explained',
                blurb: `The heart, head, life and fate lines — what each one is read to mean.`,
                qa: [
                    ['Where is the heart line and what does it mean?',
                        `The heart line runs across the top of the palm, under the fingers. It relates to emotions,
                        relationships and how you give and receive love.`],
                    ['What does a curved heart line mean?',
                        `A heart line that curves upward is often read as expressive and warm; a straighter one suggests a
                        more logical, cautious approach to feelings.`],
                    ['What does the head line tell you?',
                        `The head line runs across the middle of the palm and relates to your thinking style — how you learn,
                        decide and solve problems.`],
                    ['What does a long head line mean?',
                        `A longer head line is traditionally linked to a thoughtful, analytical mind that considers many
                        angles before deciding.`],
                    ['What does a short head line mean?',
                        `A shorter head line is often read as a decisive, action-oriented thinker who trusts instinct and
                        moves quickly.`],
                    ['Where is the life line and what does it show?',
                        `The life line curves around the base of the thumb and relates to vitality, energy and major life
                        changes — not how long you will live.`],
                    ['Does a short life line mean a short life?',
                        `No. This is a persistent myth. The life line reflects energy and life changes, and its length has
                        no proven connection to lifespan.`],
                    ['What does the fate line represent?',
                        `The fate line runs vertically up the centre of the palm and relates to career, purpose and how much
                        your path is shaped by duty versus free choice.`],
                    ['What if I don\u2019t have a fate line?',
                        `It is common and not negative. It is often read as a self-directed person who changes course and
                        builds their own way rather than following a fixed path.`],
                    ['What does it mean if a line is broken?',
                        `A break is traditionally read as a significant change or disruption in that area — a transition
                        rather than an ending. Nearby supporting lines often show recovery.`],
                    ['What does a faint line mean?',
                        `A faint line is often read as a weaker or less-developed quality in that area — something you can
                        strengthen, rather than a flaw.`],
                    ['What does a deep, clear line indicate?',
                        `A deep, clear line is generally read as strength in that area — for example a strong heart line
                        suggesting emotional depth and commitment.`],
                    ['Can palmistry tell me about money?',
                        `Some readers look at the fate line, sun line and certain markings for financial tendencies. It may
                        reflect a practical money sense, but real wealth depends on effort and circumstances — never rely on
                        a palm for financial decisions.`],
                    ['Does palmistry work for career guidance?',
                        `It can be a reflective prompt — the fate line, head line and mounts may suggest fields that suit
                        your strengths. Treat it as one input alongside your skills and real-world options.`],
                ],
            },
            {
                heading: 'Mounts, the Sun Line & Special Marks',
                blurb: `The fleshy mounts, the "sun line" of fame, and the markings people love to spot.`,
                qa: [
                    ['What are the mounts on the palm?',
                        `Mounts are the padded areas at the base of each finger and thumb, each named after a planet —
                        Venus, Jupiter, Saturn, Sun, Mercury, two Mars mounts and the Moon — and read as different
                        strengths.`],
                    ['What does the mount of Venus mean?',
                        `At the base of the thumb, it relates to love, affection and vitality. A well-developed mount is read
                        as warmth and passion.`],
                    ['What does the mount of the Moon represent?',
                        `At the base of the palm opposite the thumb, it relates to imagination, intuition and travel. A
                        developed mount suggests a creative, dreamy nature.`],
                    ['What is the sun line?',
                        `Also called the Apollo line, it runs up the palm toward the ring finger and is traditionally linked
                        to creativity, recognition and good fortune.`],
                    ['What does a strong sun line indicate?',
                        `A clear sun line is often read as a sign of creative success, fame or a lucky reputation — though
                        effort still does the real work.`],
                    ['What does a star or triangle on the palm mean?',
                        `These markings are traditionally considered lucky, often linked to talent or a fortunate moment.
                        Treat them as encouraging symbols, not guarantees.`],
                    ['What does a cross on the palm mean?',
                        `A cross is often read as protection or a challenge that was overcome. Interpretations vary between
                        different palmistry traditions.`],
                    ['What is a "simian line"?',
                        `When the heart and head lines merge into a single line across the palm, it is called a simian line.
                        It is read as someone whose thoughts and feelings are deeply intertwined.`],
                    ['What do the relationship or marriage lines show?',
                        `The small horizontal lines beneath the little finger are read for significant relationships and
                        commitments — meaningful bonds rather than a count of marriages.`],
                    ['Can palmistry reveal health issues?',
                        `No — palms cannot diagnose illness. Some readers look for vitality-related signs, but any real
                        health concern must be checked by a qualified doctor.`],
                ],
            },
            {
                heading: 'Hand Shapes, Fingers, Thumb & Getting Started',
                blurb: `The shape of your hand, your fingers and thumb, and how to begin reading.`,
                qa: [
                    ['What are the different hand shapes?',
                        `Hands are grouped by element — earth (practical), air (intellectual), water (emotional) and fire
                        (energetic). The shape is read as your general temperament.`],
                    ['What does an earth hand mean?',
                        `An earth hand (square palm, shorter fingers) is often read as grounded, reliable and practical —
                        someone who values stability and results.`],
                    ['What does an air hand indicate?',
                        `An air hand (square palm, long fingers) is read as curious, communicative and mentally active — a
                        thinker who loves ideas and conversation.`],
                    ['What does a water hand mean?',
                        `A water hand (oval palm, long fingers) is read as sensitive, intuitive and creative — someone guided
                        by feeling and imagination.`],
                    ['What does a fire hand represent?',
                        `A fire hand (rectangular palm, short fingers) is read as energetic, adventurous and enthusiastic —
                        a natural doer and risk-taker.`],
                    ['What does the thumb reveal?',
                        `The thumb relates to willpower, logic and self-control. Its position and flexibility are read as your
                        drive and temperament.`],
                    ['What does a flexible thumb mean?',
                        `A flexible thumb is often read as adaptable and spontaneous; a stiffer thumb suggests determination
                        and strong resolve.`],
                    ['What do long fingers mean?',
                        `Longer fingers are traditionally read as detail-oriented and observant; shorter fingers as big-picture,
                        fast-moving. It is a tendency, not a rule.`],
                    ['How do I read my own palm for the first time?',
                        `Start with your dominant hand in good light. Find the four major lines, then the mounts at each finger
                        base. Read one feature at a time and keep it light-hearted.`],
                    ['Can an app read my palm from a photo?',
                        `Yes — apps like GreatOhm use AI to analyse a photo of your palm, identify the major lines and mounts,
                        and give a beginner-friendly interpretation in seconds.`],
                    ['Should I be worried by a negative palm reading?',
                        `No. Ethical palmists avoid fear-based predictions. A reading is one reflective opinion — your choices
                        and professional advice matter far more than any line.`],
                    ['Is palmistry the same as fingerprint analysis?',
                        `No. Fingerprints (dermatoglyphics) are a genuine scientific field used for identification and some
                        medical research; palmistry is a symbolic divination art. The two are unrelated.`],
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
