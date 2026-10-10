/**
 * Generates the GreatOhm blog article pages in GOHMWEB-Repo from the POSTS
 * data below. This mirrors the repo's existing "tool builds HTML" pattern
 * (see build-css.js, unify-nav.js, inject-faq-keywords.js): content lives in
 * one place and the HTML is regenerated, so styling/markup stay consistent.
 *
 * Usage: node tools/build-blog-posts.js
 *
 * Each article reuses the site's shared header nav, footer, .sub-page /
 * .page-body / .science-grid / .faq-list conventions and adds BlogPosting +
 * BreadcrumbList + FAQPage JSON-LD. Safe to re-run: it overwrites the same
 * deterministic output.
 */
const fs = require('fs');
const path = require('path');

const REPO = path.resolve(__dirname, '..', 'GOHMWEB-Repo');
const PLAY = 'https://play.google.com/store/apps/details?id=com.greatohm.mobileapp';
const ORG_ID = 'https://www.greatohm.com/#organization';

// The identical 11-item nav used across the site (see tools/unify-nav.js).
const NAV_ITEMS = [
    ['Home', 'index.html#home'],
    ['What is GreatOhm?', 'index.html#what'],
    ['Our Services', 'services.html'],
    ['Why use it?', 'index.html#why'],
    ['Screenshots', 'index.html#screenshots'],
    ['Features', 'index.html#features'],
    ['Sciences', 'index.html#sciences'],
    ['FAQ', 'index.html#faq'],
    ['Download', 'index.html#download'],
    ['Join Us', 'join.html'],
    ['Contact', 'index.html#contact'],
];

function nav() {
    const items = NAV_ITEMS.map(([l, h]) => `                <li><a href="${h}">${l}</a></li>`).join('\n');
    return `    <header class="site-header">
        <nav class="nav container">
            <!-- Row 1: page links (full width, wraps instead of clipping) -->
            <ul class="nav-links" id="navLinks">
${items}
            </ul>
            <!-- Row 2: logo + company name, right corner -->
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
    return `    <!-- FOOTER -->
    <footer class="site-footer">
        <div class="container footer-inner">
            <div class="footer-grid">
            <!-- 📝 EDIT HERE: Footer brand + tagline -->
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
function head(p) {
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
    <meta property="og:image" content="https://www.greatohm.com/assets/og/index-og.png">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="GreatOhm — ${p.title}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${p.title} | GreatOhm">
    <meta name="twitter:description" content="${p.description}">
    <meta name="twitter:image" content="https://www.greatohm.com/assets/og/index-og.png">
    <meta name="twitter:image:alt" content="GreatOhm — ${p.title}">

    <!-- JSON-LD: BlogPosting + BreadcrumbList + FAQPage (AI-search visibility) -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "BlogPosting",
                "@id": "${url}#posting",
                "headline": "${p.title}",
                "description": "${p.description}",
                "datePublished": "${p.date}",
                "dateModified": "${p.date}",
                "author": { "@id": "${ORG_ID}" },
                "publisher": { "@id": "${ORG_ID}" },
                "mainEntityOfPage": "${url}",
                "inLanguage": "en",
                "articleSection": "${p.category}",
                "keywords": "${p.keywords}"
            },
            {
                "@type": "BreadcrumbList",
                "@id": "${url}#breadcrumb",
                "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.greatohm.com/" },
                    { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://www.greatohm.com/blog.html" },
                    { "@type": "ListItem", "position": 3, "name": "${p.title}", "item": "${url}" }
                ]
            },
            {
                "@type": "FAQPage",
                "@id": "${url}#faq",
                "mainEntity": [
${p.faqs.map(([q, a]) => `                    {
                        "@type": "Question",
                        "name": ${JSON.stringify(q)},
                        "acceptedAnswer": { "@type": "Answer", "text": ${JSON.stringify(a)} }
                    }`).join(',\n')}
                ]
            }
        ]
    }
    </script>
</head>`;
}

function faqList(faqs) {
    return `                    <h2>Frequently Asked Questions</h2>
                    <div class="faq-list">
${faqs.map(([q, a]) => `                        <div class="faq-item">
                            <button class="faq-q">${q}<span class="faq-toggle">+</span></button>
                            <div class="faq-a">
                                <p>${a}</p>
                            </div>
                        </div>`).join('\n')}
                    </div>`;
}

function render(p) {
    const url = `https://www.greatohm.com/${p.slug}.html`;
    return `${head(p)}

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
${p.body}
                    <div class="post-cta">
                        <p>Explore this and every other occult science in the GreatOhm app — one account, one place.</p>
                        <a class="btn btn-primary" href="${PLAY}" target="_blank" rel="noopener">Get the Free App</a>
                        <a class="btn btn-outline" href="services.html">See All Sciences</a>
                    </div>

${faqList(p.faqs)}

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
        slug: 'blog-chaldean-vs-pythagorean-numerology',
        category: 'Numerology',
        title: 'Chaldean vs Pythagorean Numerology: Which System Is Right for You?',
        date: '2026-10-10',
        description: 'Chaldean and Pythagorean numerology both turn letters into numbers, but they assign very different values. Learn the origins, letter charts and best uses of each so you pick the right system.',
        keywords: 'chaldean vs pythagorean numerology, chaldean numerology, pythagorean numerology, numerology systems, name numerology',
        body: `                    <p>If you have ever used two different numerology calculators on the same name and gotten two
                        different answers, you have already met the great split in numerology: the <strong>Chaldean</strong>
                        and <strong>Pythagorean</strong> systems. Both convert letters into numbers, but they do it in very
                        different ways — and each has a loyal following for good reasons.</p>

                    <h2>Where each system comes from</h2>
                    <p><strong>Pythagorean numerology</strong> is the more widely used system in the West. It is named
                        after the Greek philosopher Pythagoras (c. 570&ndash;495 BCE), who is credited with proving that
                        reality can be expressed through numbers. Its alphabet chart runs in a clean, logical order
                        from 1 to 9, which makes it intuitive and easy to learn.</p>
                    <p><strong>Chaldean numerology</strong> is older and comes from the ancient Babylonian region of
                        Chaldea (roughly modern-day Iraq). It is considered by many practitioners to be closer to Vedic
                        and mystical traditions. Its letter values are not sequential, and it treats the number 9 as
                        sacred and therefore rarely assigned to letters.</p>

                    <h2>How the letter values differ</h2>
                    <p>The two systems assign different numbers to the same letters, which is why the same name produces
                        different results. Here is the difference at a glance:</p>
                    <ul>
                        <li><strong>Pythagorean:</strong> A=1, B=2, C=3, D=4, E=5, F=6, G=7, H=8, I=9, then the cycle
                            repeats (J=1, K=2, and so on). All 26 letters map cleanly onto 1&ndash;9.</li>
                        <li><strong>Chaldean:</strong> The values follow no simple order &mdash; for example A, I, J, Q and
                            Y all equal 1. The number 9 is treated as holy and is not given to any letter.</li>
                    </ul>

                    <h2>Which name do you use?</h2>
                    <p>There is one more important difference: the Pythagorean system works well with your full birth
                        name <em>as it appears on your birth certificate</em>. The Chaldean system traditionally focuses
                        on the <strong>name you are known by today</strong> &mdash; the name people actually call you
                        &mdash; because Chaldean practitioners believe your current name carries your present-day vibration.</p>

                    <h2>So which one should you use?</h2>
                    <p>Neither system is "right" or "wrong" &mdash; they answer slightly different questions:</p>
                    <ul>
                        <li>Choose <strong>Pythagorean</strong> if you want a clear, structured, easy-to-follow system that
                            is widely documented and great for beginners. It is the standard behind most western
                            "life path number" calculators.</li>
                        <li>Choose <strong>Chaldean</strong> if you are drawn to the more mystical, Vedic-leaning tradition
                            and want an analysis tied to the name you use in daily life.</li>
                    </ul>
                    <p>Many students of numerology learn both and compare the results, treating each as a different lens
                        on the same person.</p>

                    <h2>Let GreatOhm do the maths for you</h2>
                    <p>Calculating compound numbers by hand &mdash; and keeping Chaldean and Pythagorean charts straight
                        &mdash; is where most people make mistakes. The GreatOhm app handles both systems, calculates your
                        life path, destiny, soul-urge and name numbers, and explains what each one means in plain
                        language, all in one place.</p>`,
        faqs: [
            ['Which numerology system is more accurate, Chaldean or Pythagorean?',
                'Neither is objectively more accurate. Pythagorean is more widely used and structured in the West, while Chaldean is older and favoured by those drawn to Vedic and mystical traditions. Many people use both and compare the results.'],
            ['Do Chaldean and Pythagorean use the same letter values?',
                'No. They assign different numbers to the same letters. For example, in the Pythagorean system A=1 and B=2, while the Chaldean chart is non-sequential and treats 9 as sacred, never assigning it to a letter.'],
            ['What name should I use for numerology?',
                'Pythagorean numerology traditionally uses your full birth-certificate name. Chaldean numerology often uses the name you are known by today, since it reflects your current vibration.'],
        ],
    },
    {
        slug: 'blog-master-numbers-11-22-33',
        category: 'Numerology',
        title: 'Master Numbers 11, 22 and 33 Explained',
        date: '2026-10-10',
        description: 'Master numbers 11, 22 and 33 carry heightened potential in numerology. Learn what makes them master numbers, the pressure they bring, and how to tell a true master number from a reduced one.',
        keywords: 'master numbers 11 22 33, master number numerology, life path 11, life path 22, life path 33, numerology master numbers',
        body: `                    <p>In numerology, most two-digit numbers are reduced to a single digit. But three numbers are
                        usually <strong>left unreduced</strong>: <strong>11, 22 and 33</strong>. These are the "master
                        numbers," and they are considered to hold a higher, more demanding potential than the numbers
                        1&ndash;9.</p>

                    <h2>Why are they called master numbers?</h2>
                    <p>The name comes from the idea that these numbers vibrate at a higher octave of the single digits
                        they reduce to. They combine the practicality of a base number with an extra layer of
                        spiritual or large-scale potential:</p>
                    <ul>
                        <li><strong>11 &rarr; reduces to 2 (1 + 1):</strong> the "Intuitive" or "Spiritual Messenger." It
                            pairs the leadership of 1 with the sensitivity and cooperation of 2. It is highly intuitive,
                            inspiring, but can also be anxious and self-critical.</li>
                        <li><strong>22 &rarr; reduces to 4 (2 + 2):</strong> the "Master Builder." It combines the
                            discipline and structure of 4 with a grand, long-term vision. It is the most "practical" of
                            the master numbers &mdash; turning big dreams into real, lasting things.</li>
                        <li><strong>33 &rarr; reduces to 6 (3 + 3):</strong> the "Master Teacher." It blends the
                            creativity of 3 with the nurturing, responsibility of 6. It is rare and is associated with
                            selfless service, compassion and teaching.</li>
                    </ul>

                    <h2>The catch: higher potential, higher pressure</h2>
                    <p>Master numbers are not automatically "better." They often mean a person feels a strong sense of
                        purpose <em>and</em> a heavy sense of pressure to live up to it. Many people with a master number
                        spend years feeling that something bigger is expected of them before they find their footing.
                        Until they do, they may unconsciously "live" the reduced number &mdash; for example, an 11 may
                        behave like a 2, and a 22 like a 4, until they grow into the master number's full expression.</p>

                    <h2>How do I know if I really have a master number?</h2>
                    <p>A master number appears wherever your calculation first lands on 11, 22 or 33 <em>before</em>
                        reduction. The most common place people look is the <strong>Life Path number</strong>, but master
                        numbers can also show up in your Expression, Soul Urge, Personality and Birthday numbers.</p>
                    <p>A quick Life Path check: reduce your full birth date to a single digit, but stop if you hit 11,
                        22 or 33 on the way. For example, someone born on 29 November 1981 reduces to
                        2 + 9 + 1 + 1 + 1 + 9 + 8 + 1 = 32 &rarr; 3 + 2 = <strong>5</strong>. No master number there. But
                        someone whose digits first sum to 29 &rarr; 11 is a <strong>Life Path 11</strong>.</p>

                    <h2>Living with a master number</h2>
                    <p>If you carry a master number, treat it less like a label and more like a direction: 11 asks you to
                        trust your intuition and inspire others, 22 asks you to build something meaningful and lasting,
                        and 33 asks you to teach and uplift with compassion. The "mastery" is something you grow into,
                        not something you are born having mastered.</p>

                    <h2>See your master numbers instantly</h2>
                    <p>The GreatOhm app calculates every core number in your chart, flags true master numbers, and shows
                        both their master expression and the reduced number they can fall back on &mdash; so you always
                        know which potential you are working with.</p>`,
        faqs: [
            ['Are master numbers better than other numbers in numerology?',
                'Not exactly. Master numbers carry higher potential but also higher pressure. They are not automatically better or luckier; they simply point to a bigger, more demanding growth path.'],
            ['Is 11 a master number or just a 2?',
                '11 is a master number that reduces to 2. Many 11s behave like a 2 until they grow into the full, more intuitive and inspirational expression of 11.'],
            ['How do I find my master number?',
                'Check every core calculation — Life Path, Expression, Soul Urge, Personality and Birthday — and note anywhere the sum lands on 11, 22 or 33 before it is reduced to a single digit.'],
        ],
    },
    {
        slug: 'blog-vastu-pyramid-placement',
        category: 'Vastu',
        title: 'Vastu Pyramid Placement: Where to Put Them and Why',
        date: '2026-10-10',
        description: 'Pyramids are a popular Vastu remedy, but placing them wrong does nothing. Learn how Vastu pyramids work, where to place them in each room, and how to balance energy without demolition.',
        keywords: 'vastu pyramid placement, vastu pyramid, pyramid vastu remedy, how to place vastu pyramid, vastu remedies without demolition',
        body: `                    <p>Vastu pyramids are one of the most popular remedies in modern Vastu Shastra — and one of the
                        most misused. Sold everywhere as a quick fix, they are often placed at random with no clear idea
                        of what they are meant to do. This guide explains what a Vastu pyramid actually is, how it is
                        believed to work, and where practitioners place it.</p>

                    <h2>What is a Vastu pyramid?</h2>
                    <p>A Vastu pyramid is a small, hollow or solid pyramid-shaped object, usually made of metal, wood,
                        crystal or stone. In Vastu belief, the pyramid shape acts as an energy collector and balancer:
                        it is said to absorb heavy, stagnant or negative energy at one point and release balanced,
                        positive energy from another. The apex (tip) is considered the point where energy is focused.</p>

                    <h2>What pyramids are believed to help with</h2>
                    <ul>
                        <li>Correcting a <strong>Vastu dosha</strong> (defect) without moving walls or breaking anything.</li>
                        <li>Balancing energy in a room that feels heavy, dull or restless.</li>
                        <li>Improving focus in studies and workspaces.</li>
                        <li>Supporting restful sleep when placed correctly in a bedroom.</li>
                    </ul>
                    <p>Vastu is a traditional science of spatial harmony, and these benefits are understood within that
                        tradition as part of balancing the flow of energy through a space.</p>

                    <h2>The golden rule of placement</h2>
                    <p>The single most important rule is this: <strong>place a pyramid where you want energy to be
                        corrected, and point its apex in the direction you want that energy to flow.</strong> Never place
                        a pyramid expecting it to fix a serious structural defect — a pyramid is a non-invasive remedy,
                        not a substitute for real reconstruction.</p>

                    <h2>Where practitioners commonly place pyramids</h2>
                    <ul>
                        <li><strong>Centre of the home (Brahmasthan):</strong> the heart of the house. Keeping this point
                            light, open and balanced is considered the most important Vastu principle, and a single
                            pyramid here is said to harmonise the whole home.</li>
                        <li><strong>Bedroom corners:</strong> to support calm and restful sleep, placed in a corner rather
                            than directly under the bed or pillow.</li>
                        <li><strong>Study or work desk:</strong> to support concentration, often on a shelf or desk corner.</li>
                        <li><strong>Rooms with a cut corner:</strong> a common non-destructive way to "energetically
                            complete" a missing corner.</li>
                    </ul>

                    <h2>Common mistakes to avoid</h2>
                    <ul>
                        <li><strong>Too many pyramids.</strong> Stacking dozens in one room is believed to create
                            confusion rather than balance. One or two, placed with intention, is the traditional approach.</li>
                        <li><strong>Random placement.</strong> A pyramid in the wrong spot is just a decorative object.</li>
                        <li><strong>Expecting instant miracles.</strong> Remedies are traditionally understood to work
                            gradually, over weeks or months.</li>
                    </ul>

                    <h2>Pyramids work best as part of a bigger picture</h2>
                    <p>A pyramid is a gentle, non-destructive remedy that works best alongside a clear understanding of
                        your home's overall Vastu — its directions, elements and the Brahmasthan. The GreatOhm app helps
                        you map your floor plan, identify genuine doshas, and choose the right remedy for each, from
                        pyramids and crystals to plants and simple rearrangements.</p>`,
        faqs: [
            ['Where should I place a Vastu pyramid in my home?',
                'The most common placement is the centre of the home (Brahmasthan) to harmonise the whole space. Other placements include bedroom corners for restful sleep and a study desk for focus, always following the room purpose and its Vastu directions.'],
            ['How many Vastu pyramids should I use?',
                'Traditional practice favours one or two pyramids placed with clear intention rather than many. Stacking dozens of pyramids in one room is believed to create confusion rather than balance.'],
            ['Do Vastu pyramids work without breaking walls?',
                'Yes. Pyramids are specifically a non-destructive remedy. They are used to energetically balance a space, including a cut or missing corner, without demolition or reconstruction.'],
        ],
    },
    {
        slug: 'blog-reversed-tarot-cards',
        category: 'Tarot',
        title: 'What Do Reversed Tarot Cards Mean? A Calm Beginner\u2019s Guide',
        date: '2026-10-10',
        description: 'A reversed tarot card is not bad luck. Learn what reversals mean, the main ways to read them, and a simple method to interpret them calmly in any spread.',
        keywords: 'reversed tarot card meaning, reversed tarot cards, tarot reversals, what do reversed cards mean, tarot card meanings',
        body: `                    <p>One of the biggest sources of anxiety for new tarot readers is the reversed card. A card
                        flips upside-down and a thousand questions flood in: is it bad? Is it the opposite? Did I do
                        something wrong? Take a breath — a reversal is not bad luck. It is simply another layer of
                        meaning, and once you understand how to read it, reversals become one of the most insightful
                        parts of a spread.</p>

                    <h2>How a card ends up reversed</h2>
                    <p>Most readers shuffle without deliberately orienting the cards, so some naturally land upside-down.
                        That randomness is fine. A reversal is not a punishment — it is a variation, the same way a
                        word can have a softer or more internal meaning depending on how it is used.</p>

                    <h2>The four main ways to read a reversal</h2>
                    <p>There is no single "correct" school of thought. Here are the four most common approaches, and most
                        readers blend them:</p>
                    <ul>
                        <li><strong>Blocked or delayed energy:</strong> the card's energy is present but slowed, internalised
                            or meeting resistance. The Sun reversed might be confidence that is temporarily dimmed, not
                            gone.</li>
                        <li><strong>Inward or subconscious:</strong> the quality is turned inward rather than expressed
                            outwardly. Justice reversed might be an inner sense of fairness you are wrestling with.</li>
                        <li><strong>The shadow side:</strong> the less mature expression of the card — an imbalance of its
                            theme rather than its opposite.</li>
                        <li><strong>The opposite meaning:</strong> the most literal approach, treating the reversal as the
                            direct opposite of the upright meaning. This works, but it can feel harsh and is best used
                            alongside the other approaches.</li>
                    </ul>

                    <h2>A simple method you can use today</h2>
                    <p>When a card is reversed, ask yourself two questions:</p>
                    <ol>
                        <li><strong>What is the upright meaning?</strong> Start from the core theme of the card.</li>
                        <li><strong>How might this theme be blocked, turned inward, or not fully expressed right now?</strong>
                            This single question resolves most reversals without drama.</li>
                    </ol>
                    <p>For example, the Eight of Cups upright is "walking away to seek deeper meaning." Reversed, it might
                        be <em>hesitating to walk away</em>, or returning to something you had left — not a disaster, just
                        a different stage of the same journey.</p>

                    <h2>Reversals are context-dependent</h2>
                    <p>The same reversed card means different things in different positions. In a "what is holding me back"
                        position, a reversal often points directly to the block. In a "what is my potential" position, it
                        may simply describe energy that is still developing. Always read the reversal <em>in the context of
                        the question and its position in the spread</em>.</p>

                    <h2>Practise with a partner: GreatOhm</h2>
                    <p>Reading reversals confidently takes practice, and having clear, calm card meanings at your
                        fingertips helps enormously. The GreatOhm app includes daily tarot pulls, classic spreads like the
                        Celtic Cross, and clear interpretations for both upright and reversed cards — so you can learn the
                        nuance of reversals as you read, without fear.</p>`,
        faqs: [
            ['Do reversed tarot cards mean something bad?',
                'No. A reversal is not bad luck. It usually means the card energy is blocked, delayed, turned inward, or not fully expressed yet. It adds nuance rather than predicting disaster.'],
            ['What is the best way to read reversed tarot cards?',
                'Start from the upright meaning, then ask how that theme might be blocked, internalised, or not fully expressed right now. Read the reversal in the context of the question and its position in the spread.'],
            ['Should I use reversals at all as a beginner?',
                'It is a personal choice. Some beginners start with upright-only readings and add reversals later. Once you are comfortable, reversals add valuable depth and honesty to a spread.'],
        ],
    },
    {
        slug: 'blog-sade-sati-three-phases',
        category: 'Astrology',
        title: 'Sade Sati: Understanding Saturn\u2019s Three 2.5-Year Phases',
        date: '2026-10-10',
        description: 'Sade Sati is the 7.5-year Saturn transit through three signs around your Moon sign. Break it into its three phases to understand what it asks of you and how to move through it calmly.',
        keywords: 'sade sati, sade sati phases, 7.5 year saturn transit, shani sade sati, sade sati remedies, saturn transit',
        body: `                    <p><strong>Sade Sati</strong> (also written Shani Sade Sati) is one of the most talked-about — and
                        most feared — periods in Vedic astrology. The name simply means "seven and a half," because the
                        period lasts about seven and a half years as Saturn (Shani) transits through the sign before
                        your Moon sign, your Moon sign itself, and the sign after it. Once you understand its structure,
                        it becomes far less mysterious.</p>

                    <h2>What actually happens during Sade Sati</h2>
                    <p>Sade Sati begins when Saturn enters the sign immediately before your Moon sign (your Janma Rashi)
                        and ends when it leaves the sign immediately after it. Each of the three signs takes roughly two
                        and a half years, giving the period its famous 7.5-year length. Saturn is the planet of
                        discipline, delay, hard work and life lessons, so this transit is traditionally seen as a time of
                        testing and growth rather than simple misfortune.</p>

                    <h2>The three phases, one by one</h2>
                    <h3>Phase 1 — The Rising (about 2.5 years)</h3>
                    <p>Saturn is in the 12th house from your Moon. This first phase often brings a subtle sense of
                        pressure, increased expenses, or matters related to rest, sleep and the subconscious coming to the
                        surface. It is a preparatory phase — things begin to shift beneath the surface before they become
                        visible.</p>
                    <h3>Phase 2 — The Peak (about 2.5 years)</h3>
                    <p>Saturn transits your Moon sign itself (the 1st from the Moon). This is considered the most intense
                        phase. It commonly brings focus on your health, identity and responsibilities, and asks you to
                        grow up in some area of life. It is demanding, but it is also where the deepest restructuring
                        happens.</p>
                    <h3>Phase 3 — The Release (about 2.5 years)</h3>
                    <p>Saturn moves to the 2nd house from your Moon, touching family, finances, savings and speech. The
                        intensity begins to ease, and the lessons of the first two phases start to settle into practical,
                        lasting changes.</p>

                    <h2>Is Sade Sati always bad?</h2>
                    <p>No — and this is the most important point. In Vedic astrology, Sade Sati affects people very
                        differently depending on Saturn's role in their individual birth chart, the strength of their Moon,
                        and the other planetary periods (dashas) running at the time. For some it is a genuinely
                        challenging time; for others it is a period of remarkable maturity, career-building and focus. It
                        rewards effort and patience, and it punishes shortcuts.</p>

                    <h2>Traditional ways to move through it</h2>
                    <ul>
                        <li><strong>Discipline and routine:</strong> Saturn respects structure. Consistent effort, honest
                            work and patience are traditionally considered the strongest "remedies."</li>
                        <li><strong>Service and humility:</strong> helping those less fortunate and avoiding arrogance is
                            classically advised during Saturn transits.</li>
                        <li><strong>Charity on Saturdays:</strong> a long-standing tradition, offering food or help to the
                            needy.</li>
                        <li><strong>Patience with delays:</strong> Saturn delays but does not deny; rushing during this
                            period usually backfires.</li>
                    </ul>

                    <h2>Know exactly where you are</h2>
                    <p>The first step to moving through Sade Sati calmly is knowing whether you are in it, which phase you
                        are in, and how it interacts with your unique chart. The GreatOhm app maps your Moon sign, tracks
                        Saturn's transit and shows your current Sade Sati phase with personalised, practical guidance —
                        so you always know what this period is asking of you.</p>`,
        faqs: [
            ['What is Sade Sati in Vedic astrology?',
                'Sade Sati is the roughly 7.5-year period when Saturn transits through the sign before your Moon sign, your Moon sign, and the sign after it. It is traditionally a time of discipline, testing and growth.'],
            ['Which Sade Sati phase is the hardest?',
                'The second phase, when Saturn transits your Moon sign itself, is generally considered the most intense, focusing on health, identity and responsibilities. The third phase gradually brings relief.'],
            ['Is Sade Sati always bad?',
                'No. Its effects depend on Saturn role in your birth chart, the strength of your Moon and other planetary periods. For many people it brings maturity, focus and solid progress rather than misfortune.'],
        ],
    },
    {
        slug: 'blog-lo-shu-grid-missing-numbers',
        category: 'Numerology',
        title: 'Lo Shu Grid Missing Numbers: What They Mean &amp; How to Balance',
        date: '2026-10-10',
        description: 'The Lo Shu Grid is the 3x3 magic square built from your birth date. Learn what an empty cell really means, what each missing number suggests, and gentle ways to balance it.',
        keywords: 'lo shu grid, lo shu grid missing numbers, missing numbers in lo shu grid, lo shu grid remedies, numerology grid',
        body: `                    <p>The <strong>Lo Shu Grid</strong> is a beautiful, ancient numerology tool that turns your date
                        of birth into a 3&times;3 magic square. Each cell holds a number from 1 to 9, and the digits of your
                        birth date are placed into the matching cells. Where a number appears many times, and where a cell
                        stays empty, is said to reveal patterns in your personality and life. Here is how to read it —
                        and how to interpret the often-worrying "missing numbers."</p>

                    <h2>How the grid is built</h2>
                    <p>Take your full date of birth in DD-MM-YYYY form and write down every digit. Then place each digit
                        into its cell in the standard Lo Shu layout:</p>
                    <ul>
                        <li>Row 1: <strong>4 &middot; 9 &middot; 2</strong></li>
                        <li>Row 2: <strong>3 &middot; 5 &middot; 7</strong></li>
                        <li>Row 3: <strong>8 &middot; 1 &middot; 6</strong></li>
                    </ul>
                    <p>In this tradition, every row, column and diagonal adds up to 15. The mental plane is the top row
                        (4-9-2), the emotional plane the middle row (3-5-7), and the practical plane the bottom row
                        (8-1-6).</p>

                    <h2>Repeated numbers vs missing numbers</h2>
                    <p>If a number appears more than once, that energy is considered strong or dominant for you. If a cell
                        is empty, that number is "missing." A missing number does <strong>not</strong> mean you lack
                        something you can never have. In this system it simply suggests that the qualities of that number
                        are not automatic for you — you may need to develop them consciously, or borrow their energy from
                        other numbers in your grid.</p>

                    <h2>What each missing number tends to suggest</h2>
                    <ul>
                        <li><strong>Missing 1:</strong> may find it harder to express yourself or stand your ground; can
                            work on independence and self-assertion.</li>
                        <li><strong>Missing 2:</strong> may find emotional sensitivity or cooperation less natural; can
                            practise patience and tact.</li>
                        <li><strong>Missing 3:</strong> creativity and self-expression may need nurturing; can work on
                            joy, communication and imagination.</li>
                        <li><strong>Missing 4:</strong> practical, hands-on stability may feel less innate; can build
                            routine and discipline.</li>
                        <li><strong>Missing 5:</strong> may dislike change or feel restricted; can gently work on freedom,
                            balance and adaptability.</li>
                        <li><strong>Missing 6:</strong> home, family and responsibility may need attention; can cultivate
                            warmth and care.</li>
                        <li><strong>Missing 7:</strong> may be less drawn to introspection or spirituality; can develop
                            inner reflection and learning.</li>
                        <li><strong>Missing 8:</strong> money and material confidence may feel like a stretch; can build
                            abundance mindset and organisation.</li>
                        <li><strong>Missing 9:</strong> compassion and ambition may feel less automatic; can cultivate
                            empathy and a bigger sense of purpose.</li>
                    </ul>

                    <h2>Gentle, traditional ways to balance a missing number</h2>
                    <p>Practitioners often suggest simple, everyday adjustments rather than drastic measures:</p>
                    <ul>
                        <li>Wearing or surrounding yourself with the associated <strong>colour</strong>.</li>
                        <li>Repeating a short <strong>affirmation</strong> that expresses the missing quality.</li>
                        <li>Making small, deliberate <strong>behaviour changes</strong> that build that trait.</li>
                        <li>Using the missing number's <strong>supporting numbers</strong> (its friends in the grid) to
                            borrow the energy you need.</li>
                    </ul>
                    <p>Because numerology is used for self-reflection, these are best treated as gentle prompts for
                        growth, not as fixes or predictions.</p>

                    <h2>Let GreatOhm draw your grid</h2>
                    <p>Working out the planes, repeats and missing numbers by hand takes care and is easy to get wrong. The
                        GreatOhm app builds your Lo Shu Grid instantly from your birth date, highlights your dominant and
                        missing numbers, and explains balanced, practical ways to work with each — alongside your life
                        path and other core numbers.</p>`,
        faqs: [
            ['What does a missing number in the Lo Shu Grid mean?',
                'A missing number does not mean you lack something permanently. It suggests the qualities of that number are not automatic for you and may need to be developed consciously.'],
            ['How do I find the missing numbers in my Lo Shu Grid?',
                'Write out every digit of your birth date (DD-MM-YYYY) and place each into the 3x3 grid using the standard layout. Any cell left empty represents a missing number.'],
            ['How can I balance a missing number in the Lo Shu Grid?',
                'Traditional approaches include using the associated colour, repeating an affirmation for that quality, making small behaviour changes, and drawing on the supporting numbers in your grid.'],
        ],
    },
];

for (const p of POSTS) {
    const out = path.join(REPO, p.slug + '.html');
    fs.writeFileSync(out, render(p), 'utf8');
    console.log('WROTE ' + p.slug + '.html');
}
console.log('\n' + POSTS.length + ' blog post(s) generated in ' + REPO);


