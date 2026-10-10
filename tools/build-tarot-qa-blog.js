/**
 * Generates two data-backed tarot Q&A blog posts in GOHMWEB-Repo:
 *
 *   1. "The 50 Tarot Questions Indians Ask Most — Answered"
 *   2. "The 50 Tarot Questions People Search For Worldwide — Answered"
 *
 * Content draws on widely-read references: Wikipedia's tarot overview (the
 * 78-card structure, Major/Minor Arcana, the pseudoscience framing), wikiHow's
 * complete reading guide, and India tarot FAQs (Astroyogi, GaneshaSpeaks)
 * covering yes/no readings, love/career tarot, deck choice and the "is tarot
 * black magic?" worry. Answers are calm, plain-English and white-hat — no
 * fear-mongering, and honest notes that tarot is for reflection, not prediction.
 *
 * Reuses the site's shared header nav, footer, and .sub-page / .page-body /
 * .faq-list conventions, plus BlogPosting + BreadcrumbList + FAQPage JSON-LD.
 * Safe to re-run (deterministic output).
 *
 * Usage: node tools/build-tarot-qa-blog.js
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
                        <p>Pull your daily card, explore spreads and get calm tarot guidance — plus astrology, numerology, Vaastu and palmistry in one app.</p>
                        <a class="btn btn-primary" href="${PLAY}" target="_blank" rel="noopener">Get the Free App</a>
                        <a class="btn btn-outline" href="tarot.html">Tarot Tools</a>
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
        slug: 'blog-50-tarot-questions-indians-ask',
        category: 'Tarot',
        title: 'The 50 Tarot Questions Indians Ask Most — Answered',
        date: '2026-10-10',
        description: 'The tarot questions Indian seekers ask most — how tarot works, Major and Minor Arcana, reversed cards, yes/no readings, love and career tarot, choosing a deck, cleansing cards, and whether tarot is safe — answered plainly.',
        keywords: 'tarot questions in india, tarot card reading, is tarot accurate, can i read tarot for myself, which tarot deck for beginners, how to cleanse tarot cards, is tarot black magic, yes or no tarot, love tarot, tarot vs astrology',
        intro: `Tarot has become hugely popular in India, both through online readers and the cards people buy to
                    try at home. But it comes with real worries: Is tarot accurate? Can I read it for myself? Which
                    deck should I buy? Is tarot connected to black magic or bad luck? Drawing on the questions Indian
                    seekers ask most (from the popular tarot FAQs to the everyday concerns about love, career and
                    safety), here are the 50 that come up again and again — answered calmly. Remember: tarot is a
                    reflective tool, not a proven predictor, and nothing here replaces professional medical, financial
                    or legal advice.`,
        sections: [
            {
                heading: 'Tarot Basics & Common Worries',
                blurb: `What tarot is, how it works, and the fears that come up first.`,
                qa: [
                    ['What is tarot card reading?',
                        `Tarot is a divination practice that uses a deck of symbolic cards to offer insight and prompt
                        reflection. You focus on a question, draw cards, and interpret their imagery and meaning to explore
                        a situation.`],
                    ['How accurate is tarot?',
                        `Tarot is widely regarded as a pseudoscience — its predictions are not supported by evidence. Many
                        people still find readings accurate-feeling because the cards prompt honest self-reflection. Treat
                        it as guidance, not fact.`],
                    ['Can tarot really predict my future?',
                        `No. Tarot does not give exact predictions. It reflects your current situation, patterns and
                        possible directions, helping you think more clearly — your choices shape what actually happens.`],
                    ['Is tarot connected to black magic or evil?',
                        `No. Tarot is a tool for reflection used by people of many faiths and none. It has no inherent link
                        to black magic, and the "evil" idea is a cultural myth, not part of the practice.`],
                    ['Is tarot against my religion?',
                        `Tarot itself is secular, though some religious traditions discourage divination. This is a personal
                        choice — many people use tarot purely as a journaling and self-reflection tool.`],
                    ['Can tarot be dangerous or negative?',
                        `The cards are not dangerous. The only risk is becoming anxious or dependent on readings — so use
                        them for reflection, and avoid readers who use fear to sell expensive remedies.`],
                    ['Does tarot work only for believers?',
                        `You do not need to "believe" for a reading to be a useful prompt. Whether or not you see it as
                        mystical, the reflection it encourages can still be helpful.`],
                    ['Is tarot the same as astrology?',
                        `They are different tools. Astrology maps the planets at your birth; tarot draws cards for a
                        present question. Both aim at insight, and some readers combine them.`],
                    ['How many cards are in a tarot deck?',
                        `A standard deck has 78 cards: 22 Major Arcana (big life themes) and 56 Minor Arcana (everyday
                        situations, in four suits).`],
                    ['Is online tarot as good as in-person?',
                        `A thoughtful reading depends on the interpretation, not the format. Online and app-based readings
                        can be just as reflective, and are often more private and convenient.`],
                ],
            },
            {
                heading: 'The Deck: Arcana, Suits & Reversed Cards',
                blurb: `Understanding the 78 cards before you read them.`,
                qa: [
                    ['What is the difference between Major and Minor Arcana?',
                        `The 22 Major Arcana cards mark big life themes and turning points (like The Fool, The Lovers, Death).
                        The 56 Minor Arcana cover everyday situations across four suits.`],
                    ['What do the four tarot suits mean?',
                        `Cups relate to emotions and relationships; Pentacles to money, work and material matters; Swords to
                        thoughts, communication and conflict; Wands to passion, creativity and action.`],
                    ['Which element does each suit represent?',
                        `Cups = water, Pentacles = earth, Swords = air, Wands = fire. Many readers use these elements to
                        understand how a suit's energy behaves.`],
                    ['What are court cards?',
                        `The 16 court cards (Page, Knight, Queen and King in each suit) represent personalities, roles or
                        stages of maturity — sometimes an actual person, sometimes an aspect of you.`],
                    ['What does a reversed tarot card mean?',
                        `A reversal is not bad luck. It usually means the card's energy is blocked, delayed or turned inward —
                        a nuance to explore, not a curse.`],
                    ['Is a reversed card always negative?',
                        `No. Reversals often show inner processing, hesitation or a lesson still unfolding. They add depth
                        rather than predicting misfortune.`],
                    ['Do I have to use reversals?',
                        `It is optional. Many beginners start with upright-only readings and add reversals once comfortable.
                        Both approaches are valid.`],
                    ['Which tarot deck is best for beginners in India?',
                        `The Rider-Waite-Smith deck is the most widely recommended for beginners because its imagery matches
                        most guidebooks, making it easy to learn.`],
                    ['Are there Indian-themed tarot decks?',
                        `Yes — many artists create decks with Indian deities, mythology or festivals. Choose imagery that
                        resonates with you, as connection makes reading more intuitive.`],
                    ['What is the most famous tarot card?',
                        `Cards like Death, The Tower and The Lovers are the best known. Death rarely means literal death — it
                        usually signals transformation and an ending that makes way for something new.`],
                ],
            },
            {
                heading: 'How to Read, Daily Pulls & Yes/No Tarot',
                blurb: `The practical "how do I actually do this?" questions.`,
                qa: [
                    ['Can I read tarot for myself?',
                        `Yes — many people read for themselves, especially for reflection. It can be harder to stay
                        objective about your own situation, so keep questions focused and honest.`],
                    ['How do I ask a good tarot question?',
                        `Ask open, empowering questions like "What can I do to improve this situation?" rather than "Will X
                        happen?" Open questions give the cards room to offer guidance instead of a yes/no.`],
                    ['What is a one-card daily pull?',
                        `Drawing a single card each morning as a theme or focus for the day. It is the simplest, most popular
                        practice and a gentle way to learn the cards.`],
                    ['How often should I pull a tarot card?',
                        `A daily one-card pull is fine, but for bigger questions avoid repeating the same question obsessively.
                        Give situations time to unfold between readings.`],
                    ['What is a three-card spread?',
                        `A simple spread often read as past-present-future or situation-action-outcome. It is a great step up
                        from a one-card pull and very beginner-friendly.`],
                    ['What is the Celtic Cross spread?',
                        `A classic ten-card spread that explores a situation in depth — the core issue, influences, hopes,
                        fears and likely outcome. It is best once you know the cards well.`],
                    ['How does a yes/no tarot reading work?',
                        `A focused pull to clarify a decision. Rather than a rigid answer, it examines the energy around your
                        situation so you can make your own informed choice.`],
                    ['How do I shuffle and draw cards properly?',
                        `There is no single right way. Shuffle while focusing on your question, then cut and draw the number
                        of cards your spread needs — what matters most is your intention.`],
                    ['Do I need to cleanse my tarot deck?',
                        `Many readers like to cleanse a new or heavily-used deck to "reset" it — with smoke, moonlight,
                        crystals or simply shuffling. It is a personal ritual, not a requirement.`],
                    ['Where should I keep my tarot cards?',
                        `Store them somewhere clean and special — a box or cloth. Many readers believe handling them with
                        respect keeps the practice meaningful.`],
                ],
            },
            {
                heading: 'Love, Career, Money Tarot & Choosing a Reader',
                blurb: `How Indians apply tarot to real questions — and how to choose wisely.`,
                qa: [
                    ['Can tarot help with my love life?',
                        `Tarot is often used to reflect on relationships. Cards like The Lovers, Two of Cups or Ace of Cups
                        highlight connection and new romance — but the reading is a prompt for reflection, not a guarantee.`],
                    ['Which tarot card is lucky for love?',
                        `The Lovers, Two of Cups and Ace of Cups are traditionally seen as positive love cards, symbolising
                        attraction, harmony and new beginnings.`],
                    ['Can tarot guide my career choice?',
                        `Yes — many use tarot to explore career options and mindset. The Pentacles suit especially relates to
                        work and money. Use it to think clearly, alongside practical planning.`],
                    ['Can tarot tell me about money and wealth?',
                        `Tarot can prompt reflection on your money habits and options, but it cannot predict wealth. Never
                        rely on a reading for financial or investment decisions.`],
                    ['Will tarot tell me when I will get married?',
                        `It will not give a date. Tarot can help you reflect on what you want and what is blocking you, but
                        marriage timing is shaped by real-life choices, not cards.`],
                    ['Can tarot tell me about my health?',
                        `No — tarot cannot diagnose or predict health outcomes. For any medical concern, always consult a
                        qualified doctor. Tarot may help you reflect on stress or self-care.`],
                    ['Should I consult a professional tarot reader?',
                        `It can be helpful for a fresh perspective. Choose someone ethical who empowers you rather than
                        frightening you or pushing costly remedies.`],
                    ['How do I know if a tarot reader is genuine?',
                        `A genuine reader is compassionate, does not guarantee exact outcomes, avoids fear tactics, and
                        encourages your own decision-making rather than dependence.`],
                    ['Can I learn tarot on my own?',
                        `Absolutely. Start with a beginner-friendly deck and its guidebook, learn one card a day, and keep a
                        tarot journal. Many self-taught readers become very skilled.`],
                    ['How is tarot different from numerology or astrology?',
                        `All are reflective tools, but tarot draws cards for a present question, numerology uses your birth
                        date and name, and astrology maps the planets at your birth. Tarot needs no birth details at all.`],
                ],
            },
            {
                heading: 'Card Meanings, Spreads & Everyday Doubts',
                blurb: `Popular cards, common spreads, and the questions that come up as you practise.`,
                qa: [
                    ['What does The Fool tarot card mean?',
                        `The Fool symbolises new beginnings, spontaneity and a leap of faith. It often appears when you are
                        starting something new and trusting the journey.`],
                    ['What does The Tower card mean?',
                        `The Tower represents sudden change or a revelation that shakes things up. It is uncomfortable but
                        often clears the way for a more honest foundation.`],
                    ['What does The Star card mean?',
                        `The Star is a hopeful card of healing, renewal and guidance after difficulty — a sign that calm and
                        inspiration are returning.`],
                    ['What does The Lovers card represent?',
                        `Beyond romance, The Lovers is about meaningful choices, alignment and union — a significant
                        relationship or an important decision of the heart.`],
                    ['Are there oracle cards as well as tarot?',
                        `Yes. Oracle decks have their own themes and varying card counts, often simpler than tarot. Many
                        people use both — tarot for structure, oracle for inspiration.`],
                    ['What are runes and I-Ching in tarot apps?',
                        `They are other divination tools sometimes bundled with tarot: runes are ancient symbols cast for
                        guidance, and the I-Ching uses coins or yarrow sticks for wisdom on change.`],
                    ['Can two people get a couples tarot reading?',
                        `Yes — many readers do relationship spreads to explore how two people relate. It is a conversation
                        starter for reflection, not a verdict on the relationship.`],
                    ['Does the time of day matter for tarot?',
                        `It is a personal preference. Some readers feel calmer at night; others read in the morning. Choose a
                        time when you can focus without distraction.`],
                    ['Why do I keep drawing the same card?',
                        `Repeated cards often highlight a lesson or theme you have not yet addressed. Readers see it as the
                        deck emphasising something important in your life right now.`],
                    ['Can I mix tarot with my other spiritual practices?',
                        `Yes — many people combine tarot with meditation, journaling, astrology or prayer. It works well as a
                        reflective companion to almost any practice.`],
                ],
            },
/* WORLD_TAROT_POST */
        ],
    },
    {
        slug: 'blog-50-tarot-questions-worldwide',
        category: 'Tarot',
        title: '50 Tarot Questions the World Asks — Answered',
        date: '2026-10-10',
        description: 'The tarot questions people google most worldwide — what tarot is, Major and Minor Arcana, the four suits, reversed cards, spreads, how to read your own cards and "is tarot real?" — answered in plain language.',
        keywords: 'tarot questions, what is tarot, how to read tarot, major arcana, minor arcana, tarot suits, reversed tarot, tarot spread, can you read your own tarot, is tarot real, tarot for beginners',
        intro: `Tarot is one of the world's most-searched spiritual topics, with roots going back to 15th-century
                    Italy. Most searches are refreshingly simple: What is tarot? What do the cards mean? How do I read
                    them? Can I read my own? Is it real? Drawing on the most-read beginner guides, here are the 50
                    questions people look up most — answered clearly, with the honest reminder that tarot is a symbolic,
                    reflective practice rather than proven prediction.`,
        sections: [
            {
                heading: 'Tarot Basics & the Big Questions',
                blurb: `What tarot is, how the deck is structured, and the honest "is it real?" question.`,
                qa: [
                    ['What is tarot?',
                        `Tarot is a deck of 78 illustrated cards used for reflection and insight. You focus on a question,
                        draw cards, and interpret their symbols and meanings to explore a situation.`],
                    ['What is the difference between tarot and a normal card deck?',
                        `A tarot deck has 78 cards including 22 extra "trump" cards (the Major Arcana) with rich symbolism,
                        unlike the 52-card deck used for games.`],
                    ['What are the Major Arcana?',
                        `The 22 Major Arcana cards (The Fool through The World) represent big life themes, lessons and
                        turning points — the "heart" of the tarot deck.`],
                    ['What are the Minor Arcana?',
                        `The 56 Minor Arcana cards deal with everyday matters. They are divided into four suits — Wands,
                        Cups, Swords and Pentacles — much like a regular playing deck.`],
                    ['What do the four suits represent?',
                        `Wands = passion and action (fire); Cups = emotions and relationships (water); Swords = thoughts and
                        communication (air); Pentacles = money and material life (earth).`],
                    ['What are court cards?',
                        `The 16 court cards — Page, Knight, Queen and King in each suit — represent people, personalities or
                        stages of maturity within a reading.`],
                    ['Is tarot real?',
                        `Tarot is widely viewed as a pseudoscience, since its predictions lack evidence. Many people still
                        find it valuable as a tool for reflection, creativity and self-understanding.`],
                    ['Can tarot predict the future?',
                        `It does not give exact predictions. Tarot reflects your present situation and possible directions,
                        helping you think more clearly — the future is shaped by your choices.`],
                    ['Is tarot connected to religion or the occult?',
                        `Tarot has been used in various spiritual and esoteric traditions, but it is not tied to any one
                        religion. Many people use it purely as a reflective, creative tool.`],
                    ['Is tarot evil or dangerous?',
                        `No. The cards are simply printed images. Tarot is not inherently dangerous — the only risk is
                        anxiety or over-dependence, which comes from how you use it, not the cards themselves.`],
                    ['Where did tarot come from?',
                        `Tarot decks first appeared in 15th-century Italy as playing cards, and were later adopted for
                        divination in France from the 18th century onward.`],
                    ['What is cartomancy?',
                        `Cartomancy is fortune-telling with cards in general. Tarot reading is one popular form of it, but
                        cartomancy can also use ordinary playing cards.`],
                    ['Do different tarot decks have different meanings?',
                        `The core structure and traditional meanings are shared, but each deck's artwork adds its own flavour.
                        Beginners do best sticking to one deck's guidebook while learning.`],
                    ['What is a "significator" in tarot?',
                        `A significator is a card chosen to represent you (or the person asking) in a reading, often selected
                        based on age and personality.`],
                ],
            },
            {
                heading: 'Reversed Cards & Popular Card Meanings',
                blurb: `The two most-searched details: what a reversed card means, and what the famous cards say.`,
                qa: [
                    ['What does a reversed tarot card mean?',
                        `A reversal usually means the card's energy is blocked, delayed or turned inward. It is a nuance to
                        explore, not a sign of bad luck.`],
                    ['Are reversed cards bad?',
                        `No. Reversals often show inner processing or a lesson still developing. Many readers find them
                        deeper and more insightful than upright cards.`],
                    ['Do I have to read reversals?',
                        `It is optional. Beginners often start with upright-only and add reversals later once they know the
                        cards well.`],
                    ['What does The Fool mean?',
                        `The Fool symbolises new beginnings, spontaneity and taking a leap of faith — the start of a journey
                        with unknown but exciting possibilities.`],
                    ['What does The Magician represent?',
                        `The Magician is about manifestation, focus and using your skills to turn ideas into reality — a card
                        of empowered action.`],
                    ['What does The Lovers card mean?',
                        `Beyond romance, The Lovers is about meaningful choices, harmony and alignment — a significant
                        relationship or an important decision of the heart.`],
                    ['What does Death mean in tarot?',
                        `Death almost never means literal death. It signals transformation, endings and the close of one
                        chapter so a new one can begin.`],
                    ['What does The Tower card mean?',
                        `The Tower represents sudden upheaval or a revelation that shakes your foundations — uncomfortable,
                        but often clearing the way for something more honest.`],
                    ['What does The Star card mean?',
                        `The Star is a hopeful card of healing, renewal and quiet inspiration after a difficult time — calm
                        and guidance are returning.`],
                    ['What does The World card represent?',
                        `The World signals completion, achievement and wholeness — the successful end of a cycle and
                        readiness for the next.`],
                    ['What does the Ace of Cups mean?',
                        `The Ace of Cups symbolises new love, emotional beginnings and an overflowing of feeling — a fresh
                        start in the heart.`],
                    ['What does the Three of Swords mean?',
                        `The Three of Swords often points to heartbreak, painful truth or difficult news — but it also marks
                        the honesty needed to heal and move on.`],
                    ['What does the Ten of Pentacles represent?',
                        `The Ten of Pentacles is about lasting abundance, family legacy and long-term security — wealth that
                        is shared and endures.`],
                    ['What does the Eight of Wands mean?',
                        `The Eight of Wands signals swift movement, messages and things finally falling into place quickly
                        after a period of waiting.`],
                ],
            },
            {
                heading: 'How to Read, Spreads & Daily Pulls',
                blurb: `The practical "how do I actually do this?" questions.`,
                qa: [
                    ['Can you read tarot for yourself?',
                        `Yes — self-readings are common and great for reflection. It can be harder to stay objective, so
                        keep your questions focused and honest.`],
                    ['How do I do a tarot reading?',
                        `Calm your mind, hold a question, shuffle, then draw cards into a spread and interpret them together.
                        Intention matters more than a rigid procedure.`],
                    ['What is a tarot spread?',
                        `A spread is a set layout of positions, each with a meaning. Common ones include the one-card pull,
                        three-card spread and the ten-card Celtic Cross.`],
                    ['What is a three-card tarot spread?',
                        `A simple three-card layout often read as past-present-future or situation-action-outcome — a great
                        beginner spread.`],
                    ['What is the Celtic Cross spread?',
                        `A classic ten-card spread that explores a situation in depth — the core issue, influences, hopes,
                        fears and likely outcome.`],
                    ['What is a daily one-card pull?',
                        `Drawing a single card each day as a theme or focus. It is the simplest practice and a gentle way to
                        learn the deck.`],
                    ['How often should I read tarot?',
                        `A daily one-card pull is fine, but avoid repeating the same big question obsessively. Give things
                        time to unfold between deeper readings.`],
                    ['How do I ask a good tarot question?',
                        `Ask open, empowering questions — "What can I do to improve this?" rather than "Will X happen?" Open
                        questions give richer, more useful guidance.`],
                    ['Do I need to cleanse my tarot deck?',
                        `Many readers like to reset a new or heavily-used deck using smoke, moonlight, crystals or shuffling.
                        It is a personal ritual, not a requirement.`],
                    ['How should I store my tarot cards?',
                        `Keep them somewhere clean and special, like a box or cloth. Treating them with care keeps the
                        practice meaningful to you.`],
                ],
            },
            {
                heading: 'Choosing a Deck, Getting Started & Doubts',
                blurb: `Picking your first deck, learning fast, and the honest limits.`,
                qa: [
                    ['Which tarot deck should a beginner choose?',
                        `The Rider-Waite-Smith deck is the most recommended for beginners — its imagery matches most
                        guidebooks, making it easy to learn.`],
                    ['Are there other beginner-friendly decks?',
                        `Yes — many modern decks are designed for beginners with plain-language guidebooks. Choose art that
                        resonates with you, since connection makes reading more intuitive.`],
                    ['What is the difference between tarot and oracle cards?',
                        `Tarot follows a set 78-card structure; oracle decks are more freeform with their own themes and
                        varying counts. Many people use both.`],
                    ['How long does it take to learn tarot?',
                        `You can start reading simple spreads within days by learning one card at a time. Fluency grows over
                        months of regular practice.`],
                    ['Do I need psychic abilities to read tarot?',
                        `No. Tarot relies on learning the card meanings and using intuition and reflection — skills anyone
                        can develop with practice.`],
                    ['Can tarot help with anxiety or decisions?',
                        `It can be a reflective tool to organise your thoughts, but it is not therapy. For persistent
                        anxiety, seek support from a qualified mental-health professional.`],
                    ['Is it bad to pull a "scary" card like Death or The Tower?',
                        `No. These cards signal change and transformation, not disaster. Readers see them as challenging but
                        ultimately clearing the way for growth.`],
                    ['Can I get a tarot reading online or from an app?',
                        `Yes — online and app readings can be just as reflective as in-person ones, and are often more
                        private, instant and convenient.`],
                    ['Should I pay for a professional tarot reading?',
                        `It can offer a fresh perspective. Choose an ethical reader who empowers you rather than frightening
                        you or pushing costly extras.`],
                    ['How can I start learning tarot today?',
                        `Get a beginner deck, learn one card a day, and keep a tarot journal. Apps like GreatOhm also let you
                        practise daily pulls and spreads digitally while you learn.`],
                    ['Can tarot and astrology be used together?',
                        `Yes — many readers pair a tarot pull with a birth chart, using astrology for timing and tarot for a
                        focused question. They complement each other nicely.`],
                    ['What is a "pull" versus a full "spread"?',
                        `A pull is one or a few cards for a quick check-in; a spread is a structured layout for a deeper
                        question. Beginners can get a lot from simple pulls.`],
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
