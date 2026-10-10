/**
 * Generates two data-backed Vaastu Q&A blog posts in GOHMWEB-Repo:
 *
 *   1. "The 50 Vaastu Questions Indians Ask Most — Answered"
 *   2. "The 50 Vaastu & Feng Shui Questions People Search For Worldwide — Answered"
 *
 * India questions are drawn from Vastu Shastra Guru's 51 FAQs, VastuEssentials'
 * 30+ beginner FAQ, and Vedic Vastu Living's practitioner FAQ. Worldwide
 * questions draw on the feng-shui side (qi, bagua, five elements, form vs
 * compass branch) plus the widely-read feng-shui-vs-vastu comparisons. Answers
 * are calm, plain-English and white-hat — no fear-mongering, and reminders that
 * local building rules and safety come first.
 *
 * Reuses the site's shared header nav, footer, and .sub-page / .page-body /
 * .faq-list conventions, plus BlogPosting + BreadcrumbList + FAQPage JSON-LD.
 * Safe to re-run (deterministic output).
 *
 * Usage: node tools/build-vastu-qa-blog.js
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
                "headline": ${JSON.stringify(p.title)},
                "description": ${JSON.stringify(p.description)},
                "datePublished": "${p.date}",
                "dateModified": "${p.date}",
                "author": { "@id": "${ORG_ID}" },
                "publisher": { "@id": "${ORG_ID}" },
                "mainEntityOfPage": "${url}",
                "inLanguage": "en",
                "articleSection": "${p.category}",
                "keywords": ${JSON.stringify(p.keywords)}
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
                        <p>Scan your floor plan and get personalised, non-destructive Vaastu guidance — alongside astrology, numerology, tarot and more in one app.</p>
                        <a class="btn btn-primary" href="${PLAY}" target="_blank" rel="noopener">Get the Free App</a>
                        <a class="btn btn-outline" href="vastu.html">Vastu Tools</a>
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
        slug: 'blog-50-vastu-questions-indians-ask',
        category: 'Vastu',
        title: 'The 50 Vaastu Questions Indians Ask Most — Answered',
        date: '2026-10-10',
        description: 'The Vaastu questions Indian homeowners ask most — directions, main door, kitchen, bedroom, pooja room, water tank, staircase and remedies without demolition — answered plainly, with safety first.',
        keywords: 'vastu questions, vastu shastra faq, vastu for home, main door direction vastu, bedroom vastu, kitchen vastu, vastu remedies without demolition, south facing house vastu, pooja room vastu, water tank vastu',
        intro: `Vaastu is the question Indian families ask the moment they buy, build or rent a home. Which
                    direction should the main door face? Is a south-facing plot really bad? Where should the kitchen,
                    bedroom and water tank go — and can any of it be fixed without breaking walls? Drawing on the
                    questions practitioners answer most often (from Vastu Shastra Guru's 51 FAQs to the beginner guides
                    and classical Vedic Vastu texts), here are the 50 that come up again and again — answered calmly,
                    with the important reminder that local building rules, budget and safety always come before any
                    traditional guideline.`,
        sections: [
            {
                heading: 'Vaastu Basics & Common Myths',
                blurb: `What Vaastu is, who it applies to, and the worries that come up first.`,
                qa: [
                    ['What is Vaastu Shastra?',
                        `Vaastu Shastra is the ancient Indian science of architecture and spatial harmony. It guides how
                        a home is designed and arranged so that it feels balanced with nature and the five elements,
                        supporting wellbeing and prosperity.`],
                    ['What are the five elements of Vaastu?',
                        `Earth, water, fire, air and space (ether). Vaastu aims to keep these five elements balanced in
                        every part of a home, since each direction and room is associated with one of them.`],
                    ['Is Vaastu only for India, or does it work worldwide?',
                        `Vaastu is applied all over the world, and its directional rules stay the same regardless of
                        country — only the local climate and building codes change.`],
                    ['Is Vaastu specific to any religion?',
                        `No. Vaastu is a secular science of space and direction. People of any religion follow it, since
                        it deals with architecture and energy rather than worship.`],
                    ['Does Vaastu affect children too?',
                        `Practitioners say Vaastu affects everyone in the home, regardless of age, because it is about the
                        energy of the space itself rather than any one person.`],
                    ['I live in a rented house — does its Vaastu affect me?',
                        `Yes, traditionally. Vaastu is believed to affect whoever occupies a space, so tenants can apply
                        simple, non-destructive remedies just as owners do.`],
                    ['How long does it take to see Vaastu results?',
                        `There is no fixed timeline. Practitioners usually say it depends on the defects and the changes
                        made — and that good habits (cleanliness, light, airflow) improve a home's feel almost
                        immediately.`],
                    ['Can Vaastu remedies remove a defect completely?',
                        `A remedy is meant to reduce the ill-effect of a defect, not erase it. Serious structural issues
                        are best corrected during construction or renovation.`],
                    ['Is Vaastu scientific?',
                        `Many of its principles overlap with good design — sunlight, ventilation, ventilation of stale air,
                        clutter control and sensible room placement. The traditional "energy" explanations are not
                        scientifically proven, but the practical outcomes often feel genuinely better.`],
                    ['Is Vaastu the same as feng shui?',
                        `They share a goal — harmonious space — but differ in origin and method. Vaastu is Indian and
                        direction/element-based, tied to construction; feng shui is Chinese and focuses on the flow of
                        "chi" and adjusting an existing space.`],
                ],
            },
            {
                heading: 'Main Door, Directions & Plot',
                blurb: `The first things buyers check: which facing is good, and where the entrance should be.`,
                qa: [
                    ['Which direction should the main door face?',
                        `East and North entrances are generally preferred in Vaastu because they invite morning sunlight
                        and are linked to prosperity. The exact auspicious position depends on the house facing and a
                        grid-based calculation.`],
                    ['Is a south-facing house really bad in Vaastu?',
                        `No — a south-facing home is not automatically bad. It is treated as a "stronger" exposure, so the
                        focus is on keeping the south and south-west heavier (storage, staircase, master bedroom) and the
                        north and north-east lighter and open.`],
                    ['Is a west-facing plot good or bad?',
                        `West-facing homes can be fine when planned well. The key is balancing the zones rather than
                        avoiding the direction — many successful homes face west.`],
                    ['Which facing is considered the most auspicious?',
                        `East-facing is traditionally the most favoured for the main entrance, associated with the rising
                        sun, health and new beginnings. But a well-balanced home of any facing can work well.`],
                    ['What should I keep near the main entrance?',
                        `Keep it clean, bright, clutter-free and welcoming — good lighting, a smooth-working door, and a
                        pleasant first view. Avoid shoe clutter, broken items and damp corners at the threshold.`],
                    ['Should I place a mirror facing the main door?',
                        `Many traditions advise against a big mirror directly facing the main door, as it is thought to
                        push entering energy back out. If you want a mirror, place it on a side wall instead.`],
                    ['Is a plot with roads on all four sides good?',
                        `Yes — a plot with roads on all four sides is traditionally considered the best, since it allows
                        light and air from every direction.`],
                    ['Is it bad to buy a plot lower than the road?',
                        `A plot lower than the surrounding ground tends to collect water and damp, so practitioners advise
                        raising it to the surrounding level to avoid practical and Vaastu problems.`],
                    ['What does it mean if my plot slopes north to south?',
                        `A north-high, south-low slope is traditionally seen as a defect linked to financial strain. If you
                        already own such a plot, practitioners suggest correcting the level with proper drainage.`],
                    ['How many doors should a house have?',
                        `Tradition favours an even number of doors, and it is best to keep the total modest and balanced,
                        with the main door clearly the most prominent.`],
                ],
            },
            {
                heading: 'Kitchen, Bedroom & Sleeping Direction',
                blurb: `The two rooms people worry about most after the entrance.`,
                qa: [
                    ['Where should the kitchen be placed?',
                        `The south-east (the fire zone, ruled by Agni) is the ideal spot for the kitchen, so the cook can
                        face east while cooking. North-east and north-west are alternatives in some traditions.`],
                    ['Which direction should I face while cooking?',
                        `Facing east while cooking is traditionally considered best, as it is linked to health and
                        nourishment. The key is also keeping the cooking area clean, ventilated and well-lit.`],
                    ['Can the kitchen and toilet be next to each other?',
                        `Vaastu advises against a kitchen sharing a common wall with a toilet or bathroom, both for
                        hygiene and traditional reasons. If your flat is fixed, keep the shared wall sealed and
                        ventilated.`],
                    ['Where should the master bedroom be?',
                        `The south-west is traditionally best for the master bedroom, as it is the heaviest, most stable
                        zone and supports rest and authority. Children's rooms suit the north-west or west.`],
                    ['Which direction should I sleep in?',
                        `Sleeping with your head to the south is traditionally considered most restful, followed by the
                        east. Practitioners usually advise against sleeping with the head to the north.`],
                    ['Should the bed be against a wall?',
                        `Yes — a solid wall behind the bed (your headboard side) is recommended for a sense of support and
                        stability, rather than having the bed under a window or beam.`],
                    ['Is it bad to have a beam over the bed?',
                        `A beam directly over the bed is traditionally avoided as it is felt to create pressure. If you
                        cannot move the bed, a false ceiling is the usual practical remedy.`],
                    ['Can I keep a mirror in the bedroom?',
                        `Mirrors are fine in a bedroom, but traditionally they should not directly face the bed. Place them
                        on a wardrobe or a wall to the side instead.`],
                    ['Where should children study?',
                        `A study in the east or north zone with the desk facing east or north is traditionally recommended
                        for focus. Keep it bright, organised and away from distractions.`],
                    ['Is it okay to have a bedroom in the north-east?',
                        `The north-east is best kept light and open, so it is not ideal for the master bedroom. It suits a
                        study, prayer space or an infrequently used guest room instead.`],
                ],
            },
            {
                heading: 'Pooja Room, Water Tank, Toilet & Staircase',
                blurb: `The specific placements Indian families ask about most.`,
                qa: [
                    ['Where should the pooja (prayer) room be?',
                        `The north-east is the traditional spot for the pooja room, as it is the calmest, most sacred zone.
                        Keep it clean, well-lit and free of clutter, with the idols facing west or east so you face them
                        while praying.`],
                    ['Which direction should the idols face?',
                        `Idols are generally placed so that they face west or east, allowing worshippers to face east or
                        west respectively. Keep them off the floor and away from the bathroom wall.`],
                    ['Where should the overhead water tank be?',
                        `The overhead tank is best placed in the south-west, west or south, since it is heavy and should sit
                        over the heavier zones. An underground tank suits the north-east.`],
                    ['Where should the underground water tank go?',
                        `An underground water tank is traditionally placed in the north-east, keeping the light, open zones
                        above it free of heavy storage.`],
                    ['Which direction is best for the toilet and bathroom?',
                        `Toilets and bathrooms are best in the west or north-west, or the south of south-west. Vaastu
                        advises keeping the north-east free of toilets, as it is the sacred zone.`],
                    ['Does a toilet in the north-east create a dosha?',
                        `Many consider a toilet in the north-east a defect to correct if possible. If the flat is fixed,
                        keep the door closed, the area dry and well-ventilated, and use simple remedies like salt or a
                        mirror.`],
                    ['Where should the staircase be?',
                        `Staircases are traditionally placed in the south, west or south-west — the heavy zones. A staircase
                        in the exact centre (Brahmasthan) is usually avoided.`],
                    ['Is a staircase in the centre really bad?',
                        `A central staircase is traditionally discouraged because it is felt to disturb the Brahmasthan, the
                        calm heart of the home. If you cannot move it, keep the area around it bright and uncluttered.`],
                    ['Can I keep a safe or locker for valuables?',
                        `The locker is traditionally placed in the north (the zone of Kuber, god of wealth) or the
                        south/south-west, opening towards the north to symbolise inflow of abundance.`],
                    ['Where is the best place for an aquarium?',
                        `An aquarium or water feature is traditionally placed in the north or north-east, as water in the
                        wealth zone is considered auspicious. Keep it clean and well-maintained.`],
                ],
            },
            {
                heading: 'Remedies Without Demolition & Common Doubts',
                blurb: `Most people already live in a built home — so the practical question is what can be fixed
                    without breaking walls.`,
                qa: [
                    ['Can Vaastu defects be fixed without demolition?',
                        `Yes. Many defects can be reduced with non-destructive remedies — better lighting and ventilation,
                        rearranging furniture, using mirrors, plants, salt, and clearing the Brahmasthan (centre) — without
                        breaking any walls.`],
                    ['What is the Brahmasthan and why keep it clear?',
                        `The Brahmasthan is the central zone of the home, considered its energetic heart. Vaastu advises
                        keeping it open, light and clutter-free, and avoiding heavy objects, toilets or pillars there.`],
                    ['Do pyramids and crystals really fix Vaastu?',
                        `Some people use pyramids, crystals and yantras as symbolic remedies. They can support a positive
                        mindset, but practical fixes — light, airflow, decluttering and repair — always come first.`],
                    ['My flat has a cut in the north-east corner. What now?',
                        `A cut or missing corner is traditionally seen as a defect. If you cannot rebuild it, practitioners
                        often symbolically "complete" it with a suitable remedy or by placing a representation of the
                        missing element.`],
                    ['Is an extended south-west good or bad?',
                        `An extended south-west is generally considered favourable, since the south-west is the zone of
                        stability. An extended north-east, by contrast, is usually seen as a defect to correct.`],
                    ['Which plants are good for the home in Vaastu?',
                        `Tulsi (holy basil), money plant and other healthy green plants are considered auspicious, especially
                        in the north and east. Avoid thorny plants (except roses) indoors and remove dead plants.`],
                    ['Should I place a wall clock or photos as per Vaastu?',
                        `Small items like clocks are best kept running and away from the sacred north-east. Family photos suit
                        the south-west or west, the zones of relationships and stability.`],
                    ['How do I find which direction my house faces?',
                        `Stand at the main entrance facing outwards with a compass, or use a compass app. The direction you
                        face is your house's facing, which anchors the whole Vaastu grid.`],
                    ['Should I consult a Vaastu expert or use an app?',
                        `For major construction, an experienced consultant is valuable. For an existing home, apps like
                        GreatOhm can scan your floor plan and flag issues quickly, then you can seek expert help for
                        anything serious.`],
                    ['Will following Vaastu guarantee wealth or success?',
                        `No. Vaastu is a traditional framework, not a guarantee. What it reliably offers is a cleaner, better
                        lit, better ventilated home — and those genuinely support comfort, focus and wellbeing.`],
                ],
            },
/* WORLD_VASTU_POST */
        ],
    },
    {
        slug: 'blog-50-vastu-fengshui-questions-worldwide',
        category: 'Vastu',
        title: 'The 50 Vaastu & Feng Shui Questions People Search For Worldwide — Answered',
        date: '2026-10-10',
        description: 'The spatial-harmony questions people search for worldwide — what is Vaastu, what is feng shui, chi, bagua, the five elements, bed placement, mirrors, wealth corners and more — answered clearly.',
        keywords: 'what is vastu, what is feng shui, vastu vs feng shui, bagua map, five elements, chi energy, feng shui bedroom, feng shui for beginners, wealth corner, front door feng shui',
        intro: `Around the world, people search for the same thing Indian families ask a Vaastu consultant: how do
                    I make my home feel calm, balanced and lucky? In the West this often arrives as "feng shui," while in
                    India it is "Vaastu Shastra." Drawing on the most-searched beginner questions (what is chi, what is the
                    bagua map, where should my bed and front door be) and the widely-read comparisons between the two
                    traditions, here are the 50 questions people look up most — answered plainly, with the reminder that
                    good design, light and safety always come first.`,
        sections: [
            {
                heading: 'Vaastu & Feng Shui: The Basics',
                blurb: `The two great traditions of arranging space, and what they actually are.`,
                qa: [
                    ['What is Vaastu Shastra?',
                        `Vaastu is the ancient Indian science of architecture and spatial harmony, over 5,000 years old and
                        rooted in the Vedas. It guides how buildings are designed and rooms placed to align with nature,
                        direction and the five elements.`],
                    ['What is feng shui?',
                        `Feng shui is a Chinese practice around 3,000 years old, based on Taoist philosophy. Its name means
                        "wind and water," and it focuses on arranging a space so that energy — "chi" — flows freely.`],
                    ['What is the difference between Vaastu and feng shui?',
                        `A popular analogy: Vaastu is like baking a cake — you get the ingredients right from the start,
                        during construction. Feng shui is like decorating a cake — adjusting an existing space to improve
                        its energy. Vaastu is direction/element-based; feng shui centres on the flow of chi.`],
                    ['Which is better, Vaastu or feng shui?',
                        `Neither is "better." Vaastu suits those building or wanting fixed, directional rules; feng shui suits
                        those adjusting an existing home and working with energy flow. Choose what fits your beliefs and
                        home.`],
                    ['Are the five elements the same in both?',
                        `Not exactly. Vaastu uses earth, water, fire, air and space. Feng shui uses wood, fire, earth, metal
                        and water. Both aim to balance these elements within a space.`],
                    ['Does feng shui use a compass like Vaastu?',
                        `Some feng shui schools (the "compass" branch) use a luopan compass to read directions, much like
                        Vaastu uses directions. Other schools focus on the "form" of the space rather than the compass.`],
                    ['What is "chi" or "qi" in feng shui?',
                        `Chi is the vital energy or life force that feng shui seeks to balance. The goal is to let chi flow
                        smoothly through a space — not too fast, not too stagnant — for wellbeing and good fortune.`],
                    ['What is the bagua map?',
                        `The bagua ("eight areas") is a feng shui energy map that overlays a floor plan, linking each area of
                        your home to a life area such as career, relationships, wealth or health.`],
                    ['Are Vaastu and feng shui religions?',
                        `No. Both are secular systems of arranging space, though they grew out of spiritual traditions.
                        People of any faith — or none — use them as design philosophies.`],
                    ['Can I use both Vaastu and feng shui together?',
                        `Many people blend them, taking Vaastu's directional logic for a new build and feng shui's flow-based
                        tweaks for an existing room. The key is intention and comfort, not strict adherence.`],
                    ['What are the five elements in feng shui?',
                        `Wood, fire, earth, metal and water. Feng shui balances these through colours, shapes and materials —
                        for example, plants for wood, candles for fire, and a small fountain for water.`],
                    ['What does "wind and water" mean?',
                        `The name feng shui literally translates to "wind and water," symbolising the two invisible natural
                        forces that shape a landscape — and, by extension, the energy of a home.`],
                    ['Does Vaastu apply to offices and shops too?',
                        `Yes. Vaastu is used for homes, offices, shops and factories. The same directional logic applies — for
                        example keeping reception in the north-east and the owner in the south-west.`],
                    ['Is Vaastu only about directions?',
                        `Directions are central, but Vaastu also considers the five elements, the shape of the plot, room
                        proportions and the placement of features like the well, tank and entrance.`],
                ],
            },
            {
                heading: 'Front Door, Bedroom & Bed Placement',
                blurb: `The two areas people search about most: how energy enters the home, and where to sleep.`,
                qa: [
                    ['Why is the front door important in feng shui?',
                        `The front door is called the "mouth of chi" — the main entry point for energy. It is traditionally
                        kept clean, well-lit, unblocked and able to open fully so positive energy can flow in.`],
                    ['Which direction should my front door face?',
                        `In Vaastu, east and north are favoured. In feng shui, the "best" direction depends on your personal
                        kua number and the bagua, so there is no single universally lucky facing.`],
                    ['What should I avoid near the front door?',
                        `Avoid clutter, a blocked swing, broken items and a mirror directly facing the door. Keep the entry
                        bright, welcoming and clear in both traditions.`],
                    ['Where should my bed be placed for good feng shui?',
                        `The "command position" is key: place the bed so you can see the door but are not directly in line
                        with it, with a solid wall behind the headboard for support and stability.`],
                    ['Should the bed face a certain direction?',
                        `Feng shui focuses more on the command position than a strict compass direction. Vaastu traditionally
                        favours sleeping with the head to the south or east and avoiding the north.`],
                    ['Is it bad to have the bed under a window?',
                        `Both traditions generally prefer a solid wall behind the bed rather than a window, as it is felt to
                        give less support and a less restful sleep.`],
                    ['Can I have a mirror in the bedroom?',
                        `Yes, but avoid a mirror that directly reflects the bed — both traditions feel it can disturb rest.
                        Place it inside a wardrobe or on a side wall instead.`],
                    ['What does my bedroom colour mean?',
                        `Calm, soft tones are recommended for rest in both traditions, drawing on the five elements and the
                        bagua. Save bold, energetic colours for living or work spaces.`],
                    ['How do I feng shui a small bedroom?',
                        `Keep it clutter-free, ensure the bed has wall support, use soft lighting, and avoid storing items
                        under the bed so energy can move. Even a small room benefits from a clear command position.`],
                    ['Where should a couple\u2019s photos go?',
                        `Relationship photos suit the south-west (Vaastu, zone of stability) or the relationship area of the
                        bagua. Keep them in pairs and in good condition.`],
                    ['What is a feng shui "cure" or enhancement?',
                        `A cure is a symbolic object — a mirror, plant, crystal, wind chime or light — used to adjust energy in
                        a space. Practical fixes like light and airflow are usually more effective than decorative cures.`],
                    ['Is a home office good in the bedroom?',
                        `Both traditions advise keeping work out of the bedroom where possible, since the bedroom is for rest.
                        If you must, use a screen or place the desk out of direct view of the bed.`],
                    ['Should the living room be in a certain direction?',
                        `Vaastu places the living room in the north, east or north-east — the open, social zones. Keep it
                        clutter-free and welcoming, with good seating that faces inward rather than backing the door.`],
                    ['How does natural light affect home energy?',
                        `Both traditions prize natural light and fresh air, which are linked to positive energy and health.
                        Brighten dark rooms and ventilate stale ones as a first, powerful step.`],
                ],
            },
            {
                heading: 'Wealth, Colours, Plants & Home Office',
                blurb: `The most-searched practical questions about attracting prosperity and arranging work.`,
                qa: [
                    ['What is the wealth corner and how do I activate it?',
                        `In feng shui, the wealth area sits in the far-left corner of your home from the entrance (part of the
                        bagua). Keep it clean, add symbols of abundance, healthy plants and colours like purple, gold or
                        green.`],
                    ['Where should I keep a safe or important documents?',
                        `Vaastu places the locker in the north or south-west; feng shui puts valuables in the wealth corner.
                        Both agree it should be sturdy, closed and in good condition.`],
                    ['Which colours attract money and calm?',
                        `Purple, green and gold are linked to wealth in feng shui, while Vaastu uses element-based colours by
                        direction. Choose colours that also genuinely feel calm and clean to you.`],
                    ['Are plants good for feng shui?',
                        `Yes — healthy, lush plants are considered very auspicious, symbolising growth. Avoid dead or dying
                        plants, and keep thorny varieties out of main living areas.`],
                    ['Should I add a water fountain or aquarium?',
                        `Moving water is considered auspicious in both traditions, especially in the north or north-east.
                        Keep it clean and well-maintained, since stagnant water has the opposite effect.`],
                    ['Which direction should my home office desk face?',
                        `Feng shui favours a "command position" desk — you can see the door, with a wall behind you. Vaastu
                        traditionally favours facing east or north while working.`],
                    ['Where should the kitchen stove go?',
                        `Vaastu places the kitchen in the south-east (fire zone). Feng shui advises the cook should be able to
                        see the door and not have the stove directly opposite the sink (fire-water clash).`],
                    ['Is it bad to have the toilet in a certain area?',
                        `Both traditions prefer toilets away from the sacred/wealth zones — Vaastu avoids the north-east, and
                        feng shui avoids the centre and wealth corner. Keep them clean, closed and ventilated.`],
                    ['How important is decluttering for energy?',
                        `Very — both traditions see clutter as blocked, stagnant energy. Clearing it is the single most
                        recommended first step, and it also genuinely makes a home feel calmer.`],
                    ['Does the shape of my home matter?',
                        `A regular shape (square or rectangle) is easiest in both systems. Irregular or missing corners are
                        "balanced" with plants, lights, mirrors or symbolic remedies where rebuilding is not possible.`],
                ],
            },
            {
                heading: 'Remedies, Doubts & Getting Started',
                blurb: `The honest questions — does it work, and where do I begin?`,
                qa: [
                    ['Can I improve my home\u2019s energy without renovating?',
                        `Absolutely. Lighting, airflow, decluttering, repair, plants and rearranging furniture are the most
                        powerful and cheapest "remedies" in every tradition, and need no construction.`],
                    ['Do Vaastu and feng shui actually work?',
                        `Their traditional energy explanations are not scientifically proven. But the practices promote
                        cleaner, brighter, better-ventilated, more organised homes — and those measurably feel better to live
                        in.`],
                    ['How do I find my feng shui kua number?',
                        `Your kua number comes from your birth year and gender, and it points to your lucky and unlucky
                        directions. Many feng shui practitioners and apps calculate it for you.`],
                    ['What is the command position and why does it matter?',
                        `It is the spot in a room diagonally opposite the door, with your back to a solid wall. Placing your
                        bed or desk here is meant to give a sense of security and control.`],
                    ['Should I hire a consultant or learn myself?',
                        `You can start with the basics yourself — declutter, fix lighting, position your bed well. For a new
                        build or a serious concern, an experienced consultant can offer personalised guidance.`],
                    ['Is feng shui expensive to apply?',
                        `Not at all. The highest-impact changes — decluttering, cleaning, lighting and moving furniture — are
                        free. Expensive "cures" are rarely necessary.`],
                    ['Can Vaastu or feng shui help me sell my home?',
                        `A clean, bright, well-staged home photographs and shows better, which genuinely helps selling. The
                        spiritual "energy" is a bonus; the practical staging does most of the work.`],
                    ['What is the single best thing I can do today?',
                        `Declutter your entrance and let in more light and fresh air. In every tradition this is the most
                        recommended, most effective first step — and it works immediately.`],
                    ['Do I have to believe in it for it to help?',
                        `The practical benefits — tidiness, light, airflow, calm — work regardless of belief. Intention and
                        consistent habits matter more than faith.`],
                    ['How can I learn more about my home\u2019s Vaastu?',
                        `Start by mapping your home's directions and checking each room's placement. Apps like GreatOhm can
                        scan your floor plan and give personalised, non-destructive guidance in one place.`],
                    ['Can Vaastu help with a rented apartment?',
                        `Yes — tenants can apply the non-destructive principles: declutter, brighten the entrance, position the
                        bed and desk well, and keep the sacred zones clean, all without altering the structure.`],
                    ['Is a north-east extension or cut important to fix?',
                        `The north-east is the most sensitive zone in Vaastu. An extension there is usually seen as a defect;
                        if you cannot rebuild, practitioners balance it with light, plants or symbolic remedies.`],
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
