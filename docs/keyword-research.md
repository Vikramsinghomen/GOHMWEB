# Keyword Research — GreatOhm

Research compiled to target the same search demand that Astrosage, AstroGuru, GrahaGuru
and similar sites compete for. Every keyword below was integrated into a real, on-page FAQ
answer and the matching `FAQPage` JSON-LD, so the page genuinely answers the query rather
than just containing the phrase.

## Methodology & sources

| Source | Used for | Notes |
| --- | --- | --- |
| SEOpital — *The Best Astrology SEO Keywords* | Astrology volumes | Vendor-published estimates |
| Astro Logyic — *Astrology Search Trends* (KeySearch data) | Astrology volumes, cross-check | Attributes figures to KeySearch |
| KeySearch — *Top Numerology Keywords* | Numerology volumes | Vendor-published estimates |
| GrahaGuru — Kundli & Birth Chart FAQ | Question phrasing / search-intent shape | Competitor FAQ structure |
| Grihafy — *Vastu Remedies* | Vastu questions and remedy vocabulary | Competitor FAQ + remedy taxonomy |

**Important caveat:** the volumes below are *modelled estimates* from third-party keyword
tools, not measured analytics data. They rank relative demand, they are not exact counts,
and they change continuously. Treat them as directional.

## Astrology

| Keyword | Est. monthly searches | Integrated into |
| --- | --- | --- |
| horoscope | 5,000,000 | `astrology.html` |
| astrology | 3,350,000 | `astrology.html` |
| zodiac signs | 2,740,000 | `astrology.html` |
| horoscope today | 1,500,000 | `astrology.html` |
| daily horoscope | 823,000 | `astrology.html` |
| birth chart | 673,000 | `astrology.html`, `kundli.html` |
| natal chart | 246,000 | `astrology.html` |
| kundali matching | 368,000 | `kundli-matching.html` |
| kundli matching | 201,000 | `kundli-matching.html` |
| kundali online | 135,000 | `astrology.html` |
| free birth chart | 110,000 | `astrology.html` |
| rising sign | 74,000 | `astrology.html` |
| vedic astrology | 60,500 | `astrology.html` |
| moon sign | 60,500 | `astrology.html`, `sade-sati.html` |
| zodiac compatibility | 60,500 | `kundli-matching.html`, `nakshatra.html` |
| horoscope by date of birth | 60,500 | `astrology.html` |
| sun sign | 49,500 | `astrology.html` (Big 3) |
| janam kundali | 49,500 | `kundli.html` |
| janam kundli | 40,500 | `kundli.html` |
| free kundali | 40,500 | `astrology.html` |
| big 3 astrology | 4,400 | `astrology.html` |

### Supporting topics covered
- **Kundli:** 12 houses, Lagna/ascendant, Navamsa (D-9), Vimshottari dasha, divisional charts, Navagraha
- **Matching:** Ashtakoota Guna Milan (36 gunas), Nadi dosha, Bhakoot dosha, Manglik dosha
- **Doshas:** Manglik/Kuja dosha and cancellation factors, Kaal Sarp Dosha, Sade Sati three phases
- **Timing:** Shubh Mahurat, Rahu Kaal, Abhijit Muhurat, Yamaganda, Gulika


## Numerology

| Keyword | Est. monthly searches | Integrated into |
| --- | --- | --- |
| numerology | 368,000 | `numerology.html` |
| numerology calculator | 201,000 | `numerology.html` |
| life path number | 165,000 | `numerology.html` |
| numerology name calculator | 110,000 | `numerology.html` |
| numerology birth date | 18,100 | `numerology.html` |
| numerology calculator by date of birth | 14,800 | `numerology.html` |
| numerology compatibility | 9,900 | `numerology.html` |
| life path calculator | 60,500 | `numerology.html` |
| numerology predictions | 5,400 | `numerology.html` |
| my numerology number | 2,900 | `numerology.html` |

### Supporting topics covered
- Life Path vs Destiny/Expression number, Destiny number calculation method
- Chaldean vs Pythagorean numerology, master numbers (11, 22, 33)
- Mobile / phone number numerology, lucky numbers
- Personal year, personal month, personal day cycles
- Lo Shu Grid / Chinese magic square, missing numbers, numbers 5 / 7 / 8

## Vastu

Vendor keyword lists for Vastu were not publicly accessible, so targets were derived from
the questions and remedy vocabulary used by a current-ranking Vastu competitor.

| Target | Integrated into |
| --- | --- |
| what is Vastu Shastra / five elements (Panchachhuta) | `vastu.html` |
| eight directions / Ashtadikpal | `vastu.html` |
| Vastu Purusha Mandala, Brahmasthan | `vastu.html` |
| north facing house Vastu | `vastu.html` |
| Vastu dosha, how to check Vastu at home | `vastu.html` |
| Vastu remedies | `vastu-remedies.html` |
| free Vastu remedy, most powerful remedy | `vastu-remedies.html` |
| Vastu without demolition | `vastu-remedies.html` |
| how long do Vastu remedies take | `vastu-remedies.html` |
| Vastu pyramid placement | `vastu-remedies.html` |
| plants and crystals as Vastu remedies | `vastu-remedies.html` |


## Tarot

| Target | Integrated into |
| --- | --- |
| tarot card reading / tarot card meanings | `tarot.html` |
| Major and Minor Arcana | `tarot.html` |
| reversed tarot card meaning | `tarot.html` |
| Celtic Cross spread | `tarot.html` |
| three card Past Present Future spread | `tarot.html` |
| free tarot card reading online | `tarot.html` |

## Palmistry

| Target | Integrated into |
| --- | --- |
| palmistry / palm reading | `palmistry.html` |
| major palm lines (life, head, heart, fate) | `palmistry.html` |
| mounts of the palm | `palmistry.html` |
| hand shape and personality (air/earth/water/fire) | `palmistry.html` |
| marriage and career palmistry | `palmistry.html` |
| AI palm reading from photo | `palmistry.html` |

## What was changed

- 53 new keyword-targeted FAQs across 14 pages (`tools/faq-keywords.js` is the source of truth).
- Each new FAQ was injected into **both** the visible `.faq-list` accordion and the
  `FAQPage` JSON-LD, so structured data always matches visible content.
- The injection is idempotent — re-running `tools/inject-faq-keywords.js` skips anything
  already present.
- Verified: visible question count == JSON-LD question count on every page.

## Deliberate restraint

No keyword stuffing was applied. Head terms like "horoscope" and "numerology calculator"
are not viable head-term wins for a new domain against Astrosage and AstroGuru, so the
strategy targets the long tail ("Chaldean vs Pythagorean numerology", "Vastu pyramid
placement", "what do reversed tarot cards mean") where intent is specific and a small
site can realistically rank.

Also avoided: auto-generated doorway pages for sign-by-sign horoscopes (e.g. 12 separate
Gemini/Leo/Aries pages). That pattern works short-term and is explicitly targeted by
Google's scaled-content-abuse policy, which would put the whole domain at risk.
