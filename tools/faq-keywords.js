// Keyword-targeted FAQ additions, derived from SEO keyword research (see docs/keyword-research.md).
// Each entry is appended to BOTH the visible .faq-list accordion and the FAQPage JSON-LD
// so on-page content and structured data never drift apart.
module.exports = {
  'astrology.html': [
    {
      q: 'What is a horoscope and how is it different from a birth chart?',
      a: 'A horoscope is a general prediction based mainly on your Sun sign (and sometimes Moon sign) for a given period. A birth chart, also called a natal chart, is the complete map of every planet\u2019s position at the exact moment, day and place you were born. In short: a horoscope tells you what is happening this month, while a birth chart tells you who you are and what your chart fundamentally favours. GreatOhm gives you both.'
    },
    {
      q: 'How do I find my rising sign or ascendant?',
      a: 'Your rising sign, also called the Lagna or ascendant, is the zodiac sign that was rising on the eastern horizon at your exact time of birth. Because the ascendant changes roughly every two hours, you need your precise birth time to find it accurately. In the GreatOhm app, enter your date, time and place of birth and the rising sign is calculated automatically alongside your full kundli.'
    },
    {
      q: 'Can I get a free kundali online and a free birth chart?',
      a: 'Yes. GreatOhm generates your Janam Kundli, or free online kundali, instantly in the app from your date, time and place of birth. You can view your lagna, planetary placements, divisional charts and navagraha positions, then explore deeper readings such as planetary dasha timelines, nakshatra and dosha analysis without a separate paid consultation for the basic chart.'
    },
    {
      q: 'What are the Sun sign, Moon sign and rising sign (the Big 3)?',
      a: 'The Big 3 in astrology is your Sun sign, Moon sign and rising sign together. Your Sun sign shows your core identity and conscious intent, your Moon sign shows your emotional nature and inner world, and your rising sign shows how you come across to others and how you start things. Reading all three gives a far more complete picture than any one sign alone, which is why GreatOhm surfaces all three in your birth chart.'
    },
    {
      q: 'What is Vedic astrology and how is it different from Western astrology?',
      a: 'Vedic astrology, also called Jyotish, is the traditional Indian system of astrology. It uses sidereal astronomy, meaning it measures actual planetary positions against the zodiac rather than the tropical zodiac used in Western astrology, so your Vedic sign can differ from your Sun sign. Vedic astrology places deep emphasis on the Moon sign, nakshatra, planetary periods called dashas, and remedial measures, all of which GreatOhm covers in detail.'
    }
  ],
  'kundli.html': [
    {
      q: 'What information do I need to generate a Kundli or Janam Kundli?',
      a: 'To generate an accurate Kundli you need three things: your date of birth, your time of birth, and your place of birth. The date gives the day, month and year, the place identifies the geographic coordinates needed for the local sunrise and time correction, and the time determines your ascendant and therefore the entire house layout. Without an accurate birth time, a Kundli can be off by several degrees or even a whole sign.'
    },
    {
      q: 'What are the 12 houses of a Kundli?',
      a: 'The 12 houses divide the zodiac into life areas. The 1st is self and body, the 2nd wealth and family, the 3rd courage and siblings, the 4th home and mother, the 5th children and education, the 6th health and enemies, the 7th marriage and partnerships, the 8th longevity and transformation, the 9th fortune and dharma, the 10th career and status, the 11th gains and networks, and the 12th losses, expenses and liberation. GreatOhm interprets each house in your chart.'
    },
    {
      q: 'What is a Navamsa or D-9 chart?',
      a: 'The Navamsa, also called the D-9 or ninth division chart, is the single most important divisional chart in Vedic astrology. It is derived from your birth chart by dividing each sign into nine parts, and it reveals the deeper dharmic strength of your planets. Traditionally it is the chart used to assess marriage and spouse character, which is why GreatOhm includes a Navamsa with your Kundli and pairs it with kundli matching reports.'
    },
    {
      q: 'What is a Vimshottari dasha?',
      a: 'A Vimshottari dasha is a planetary period in Vedic astrology, usually lasting 120 years across the nine navagraha in sequence, of which your chart activates a slice based on your Moon sign at birth. Each mahadasha and its antardashas runs for years and highlights a particular theme such as career, marriage, health or finance. GreatOhm lays out your dasha timeline visually so you can see which periods are favourable.'
    }
  ],
  'kundli-matching.html': [
    {
      q: 'How does kundli matching for marriage work?',
      a: 'Kundli matching for marriage compares two birth charts to see how their planetary placements interact. GreatOhm performs Ashtakoota Guna Milan, a traditional system scoring the charts across 36 gunas, and separately reports Nadi dosha, Bhakoot dosha and Manglik dosha. The result is a compatibility score with a clear breakdown of where the charts agree, where they clash, and what remedies can soften the difficult areas.'
    },
    {
      q: 'What is a good Guna Milan score for marriage?',
      a: 'Out of a maximum of 36 gunas, 18 or more is generally considered a good match and 25 or above is considered very good. Many families treat 18 as the minimum acceptable threshold. That said, guna score is only one input, so GreatOhm also weighs Nadi dosha, Bhakoot dosha, planetary strengths and the actual dasha periods running at the proposed marriage date before giving a recommendation.'
    },
    {
      q: 'What is Nadi dosha and why does it matter in kundli matching?',
      a: 'Nadi dosha occurs when the Nadi (a subtle pulse value) of both charts falls in the same of eight nadi groups. Traditional matching treats this as a significant mismatch because it is traditionally linked to health and progeny concerns after marriage. It is also the single most common reason a high Guna Milan score still gets flagged, so GreatOhm reports Nadi dosha separately instead of hiding it inside the total score.'
    },
    {
      q: 'Should I get kundli matching done before or after fixing the wedding date?',
      a: 'Do the matching first, then pick the date. A compatible chart pair can still be undermined by an unlucky marriage muhurat, which is why GreatOhm pairs kundli matching with a Shubh Mahurat search. The ideal order is: match the charts, fix the doshas that need remedies, then choose a wedding date and time that both charts support.'
    }
  ],
  'numerology.html': [
    {
      q: 'What is a numerology calculator and how does it work?',
      a: 'A numerology calculator reduces your date of birth, full name or phone number to a small set of core numbers. It works by adding the digits of your birth date to derive your Life Path number, your full birth-date total for the Destiny or Expression number, and the letters of your name for Name or Soul Urge numbers. The GreatOhm numerology calculator does all of this instantly and explains the meaning of every number it derives.'
    },
    {
      q: 'What is the difference between Life Path number and Destiny number?',
      a: 'Your Life Path number is the single most important number in numerology. It is calculated from your full date of birth and describes your core life lesson, natural talent and the direction your path is pulling you toward. Your Destiny or Expression number is also date-based but reflects how you express your abilities to the outside world and what you are meant to build. Many people read both together for a fuller picture.'
    },
    {
      q: 'What is Chaldean numerology and how is it different from Pythagorean numerology?',
      a: 'Pythagorean numerology, the more common Western system, assigns numbers 1 to 9 to letters and works with Life Path, Destiny and Name numbers. Chaldean numerology is the older Babylonian system and assigns numbers 1 to 8 only, which means compound numbers like 19, 27 and 36 are given their own direct meaning and are not reduced to a single digit. GreatOhm supports both systems so you can see where the two readings agree and where they differ.'
    },
    {
      q: 'How do I calculate my destiny number or expression number?',
      a: 'Write out your full date of birth in digits and add every digit together, then keep reducing the total to a single digit or a master number such as 11, 22 or 33. That final figure is your Destiny, or Expression, number. For example, a date adding to 33 keeps 33 rather than reducing to 6, because master numbers carry amplified meaning. GreatOhm performs this reduction automatically and shows the working.'
    },
    {
      q: 'Is mobile number or phone number numerology accurate?',
      a: 'Mobile number numerology is based on the idea that you interact with your phone so constantly that its number shapes your daily vibrations. It is not scientific, and in numerology it is treated as a corrective tool rather than a destiny factor: if your personal numbers repeatedly clash with your phone number, many practitioners suggest changing it. GreatOhm offers phone number and lucky number analysis as guidance for reflection rather than prediction.'
    },
    {
      q: 'What is a personal year, personal month and personal day in numerology?',
      a: 'Personal cycles run alongside your Life Path number. Your personal year is calculated from your birth month and day plus the current calendar year, and runs from your birthday to your next birthday. Your personal month refines that for a given month, and your personal day refines it further for a specific date. GreatOhm calculates all three so you can see which themes a coming period is likely to emphasise.'
    }
  ],
  'lo-shu-grid.html': [
    {
      q: 'What is the Lo Shu Grid or Chinese Magic Square?',
      a: 'The Lo Shu Grid is a 3x3 Chinese magic square containing the digits 1 to 9, used in Chinese metaphysics to map the numbers derived from a birth date onto a grid. Every row, column and diagonal adds up to 15, which is what makes it a true magic square. Numerology practitioners use the Lo Shu to show which numbers are strong, which are missing in a life area, and how to balance them.'
    },
    {
      q: 'What does it mean if I have missing numbers in my Lo Shu Grid?',
      a: 'Each Lo Shu number corresponds to a life area, such as wealth, relationships, health, career or creativity. A missing number does not mean something bad is absent, but it signals an area that may need deliberate attention and balancing in your life. The usual recommendation is to bring the missing quality in through your chosen career, relationship or physical environment rather than worrying about the gap itself.'
    },
    {
      q: 'What does number 5, number 7 or number 8 mean in the Lo Shu Grid?',
      a: 'In the Lo Shu layout, number 5 sits at the centre and represents balance, flexibility and the driving force of the whole grid. Number 7 relates to intuition, spiritual depth and analytical withdrawal. Number 8 is the number of wealth, authority and material success, and sits in a cardinal position linked to career and finances. GreatOhm explains the meaning and the balancing remedies for every number in your grid.'
    }
  ],
  'vastu.html': [
    {
      q: 'What is Vastu Shastra and what are the five elements?',
      a: 'Vastu Shastra is the traditional Indian science of architecture and spatial arrangement. It works on the principle that space carries directional energy, and it maps that energy through the five elements or Panchachhuta: Earth, Water, Fire, Air and Space. Each element governs a direction, so balancing the element associated with each part of your home is the core Vastu practice.'
    },
    {
      q: 'What are the eight directions or Ashtadikpal in Vastu?',
      a: 'Vastu assigns qualities to eight directions, which together form the Vastu Purusha Mandala. North (Kuber) rules wealth, East (Indra) rules health and vitality, South (Yama) rules strength and family, and West (Varuna) rules gains and relationships. The four corners rule stability, learning, travel and overall fortune, while Brahmasthan, the exact centre of the home, distributes energy to every zone.'
    },
    {
      q: 'What is a north facing house and why is it considered auspicious?',
      a: 'A north facing house is considered auspicious because North is the direction of Kubera, the deity of wealth in Vastu, and is linked to the element of water and to magnetic north. Homes facing north generally receive steadier, cooler light throughout the day, which is why the tradition treats them as favourable for finances and long-term stability.'
    },
    {
      q: 'What is a Vastu dosha and how do I check my home?',
      a: 'A Vastu dosha is a defect created when a zone of the home clashes with its directional energy, such as a toilet in the north-east or a heavy structure in the centre. In the GreatOhm app you can upload a floor plan and its AI scanner identifies the doshas present, ranks them by severity, and maps each one to a specific, non-destructive remedy.'
    },
    {
      q: 'What is Vastu Purusha Mandala and Brahmasthan?',
      a: 'The Vastu Purusha Mandala is the grid of 45 directional energy cells that underlies traditional Vastu design, with the eight directions and the centre forming its core. Brahmasthan is the central cell of that grid and the geometric middle of the property. Vastu holds that Brahmasthan should stay light and open so energy can distribute evenly, which is why heavy furniture in the centre is considered a dosha.'
    }
  ],
  'vastu-remedies.html': [
    {
      q: 'What is the most powerful free Vastu remedy?',
      a: 'The single most cited free Vastu remedy is keeping the north-east zone of the home completely clear, because North-East is the primary energy entry point and blocking it is considered the most common serious defect. Beyond that, decluttering, opening up the central Brahmasthan area, correcting your sleep direction and keeping toilet lids closed are all zero-cost remedies with immediate effect.'
    },
    {
      q: 'Can Vastu doshas be corrected without demolition?',
      a: 'Yes, the vast majority of Vastu doshas can be corrected without demolition or major construction. The usual approach is balancing rather than rebuilding: repainting a wall, repositioning a bed or desk, adding a metal or colour element, or clearing a heavy zone. Structural changes are only ever considered for the most serious defects, and a qualified Vastu consultant should assess those in person.'
    },
    {
      q: 'How long do Vastu remedies take to show results?',
      a: 'Most practitioners recommend giving a change time to work, with a common observation window of four to six weeks before adding further remedies. Very light remedies such as decluttering or repositioning can feel different within days, while remedies tied to a dosha tied to an ongoing planetary period may take longer. Applying many changes at once also makes it hard to tell what actually helped, so two or three changes at a time is the better approach.'
    },
    {
      q: 'What are Vastu pyramids and where should they be placed?',
      a: 'A Vastu pyramid is a small geometric copper or brass structure used to energise a specific zone of the home. Placed in the north-east it supports growth and divine energy, above a north-east toilet door it neutralises that strong dosha, and near the bed or in a south-west corner it supports rest and stability. GreatOhm indicates the correct placement for each remedy based on the dosh detected in your floor plan.'
    },
    {
      q: 'Can plants and crystals be used as Vastu remedies?',
      a: 'Yes. Tulsi in the north-east is one of the most traditional Vastu remedies, while lucky bamboo supports the north and east, sea salt bowls are used to clear heavy energy in a zone, and quartz clusters are placed in the north-east living or prayer area. These are non-destructive and inexpensive, which makes them a common first step before considering metal or yantra remedies.'
    }
  ],
  'tarot.html': [
    {
      q: 'What do the Major and Minor Arcana cards mean in tarot?',
      a: 'The Major Arcana are the 22 trumps, from The Fool through The World, and they describe the big arc of your life: beginnings, challenges, transformation and completion. The Minor Arcana are the remaining 56 cards, split into the suits of Cups (emotions), Wands (creativity and drive), Swords (mind and conflict) and Pentacles (money, work and material life). Reading both together is what gives a tarot spread its detail.'
    },
    {
      q: 'What does a reversed tarot card mean?',
      a: 'A reversed card usually signals that the energy of the upright card is blocked, inverted or internalised rather than missing entirely. For example, the upright Eight of Swords points to feeling trapped, while the reversed Eight of Swords points to the beginning of seeing your way out. Reversals are best read as a modifier of the upright meaning rather than as a separate, negative verdict.'
    },
    {
      q: 'What is the Celtic Cross tarot spread used for?',
      a: 'The Celtic Cross is a ten-card layout and the most thorough classic tarot spread. It is generally used for a deep read on a specific question or situation, showing the core of the matter, the forces at play, the conscious and unconscious position, the near past and near future, and the final outcome or advice. Because it covers so much, GreatOhm recommends it for focused questions rather than a general daily check-in.'
    },
    {
      q: 'How does a three card Past Present Future tarot spread work?',
      a: 'The three card Past, Present and Future spread is the simplest and most popular layout. The first card shows what has just passed or the root of the situation, the second shows your current position, and the third points to the likely direction ahead. It is ideal for a quick daily pull or a clear single question, where the Celtic Cross would be far more than the situation requires.'
    },
    {
      q: 'Can I get a free tarot card reading online?',
      a: 'Yes. GreatOhm lets you draw a daily tarot card free in the app and explore upright and reversed meanings for every card, then move to guided spreads such as Past Present Future, Love Compatibility and Celtic Cross. For Yes or No questions there is a dedicated quick draw, and a full 78 card deck is included alongside Runes, Lenormand and I-Ching readings.'
    }
  ],
  'palmistry.html': [
    {
      q: 'What is palmistry and what can a palm reading tell me?',
      a: 'Palmistry is the practice of interpreting character and life patterns from the shape of the hand and the lines on the palm. A palm reading typically covers the major lines for life events, relationships, thinking and career, the mounts for personal qualities, and the shape and size of the hand for temperament. GreatOhm offers AI palm reading from a photo of your hand alongside a full guide to every line and mount.'
    },
    {
      q: 'What do the major palm lines mean?',
      a: 'There are three principal lines. The Heart line across the palm shows how you feel and express emotion, the Head line shows how you think, communicate and process information, and the Life line curving around the thumb shows your vitality, health and major life changes. A fourth line, the Fate or Apollo line, running across the centre, is read for career direction and public reputation.'
    },
    {
      q: 'What are the mounts of the palm?',
      a: 'The mounts are the raised areas of the palm named after classical planets, and each governs a set of traits. The Mount of Jupiter indicates confidence and leadership, Saturn seriousness and discipline, Apollo or the Sun creativity and recognition, Venus love and aesthetics, Mercury communication and intellect, and Mars courage and drive. The Moon mount is associated with intuition and imagination.'
    },
    {
      q: 'Does the shape of the hand reveal personality in palmistry?',
      a: 'Yes. Palmistry reads four hand shapes: Air hands with long, slender fingers are associated with intellectual and communicative traits, Earth hands with broad palms with practicality and reliability, Water hands with deep palms and long middle fingers with emotional and intuitive sensitivity, and Fire hands with shorter fingers and a wide palm with energy and assertiveness.'
    },
    {
      q: 'What is marriage and career palmistry?',
      a: 'Marriage palmistry reads the Venus mount at the base of the thumb along with the Heart line to indicate how you express affection and what you seek in a relationship. Career palmistry looks at the Apollo or Fate line, the mounts of Jupiter, Saturn and Sun, and the shape of the fingers, which together indicate where you direct professional ambition. GreatOhm covers both in its palm reading guides.'
    }
  ],
  'nakshatra.html': [
    {
      q: 'How do I find my Nakshatra by date of birth?',
      a: 'Your nakshatra is the lunar mansion your Moon occupied at birth. To find it, you need your date, exact time and place of birth, because the Moon moves through a nakshatra roughly every one day and twenty minutes. GreatOhm calculates it instantly and shows your pada, your ruling planet, your deity and the Deity-tattva it belongs to.'
    },
    {
      q: 'What are the 27 Nakshatras and 9 Navamsas?',
      a: 'There are 27 nakshatras spanning the zodiac, and each one is divided into four padas, giving 108 padas in total. The 27 nakshatras are grouped into nine sets of three called Navamsas, each ruled by a sign and a planet. Nakshatras are the finer zodiac division used for dasha timing, Prana Pada and compatibility.'
    },
    {
      q: 'What is Nakshatra compatibility or Kuta matching?',
      a: 'Nakshatra compatibility, also called Kuta matching, checks the padas of both Moon signs in a chart pair. Traditionally it compares three kutas: Varna for spiritual compatibility, Vashya for mutual attraction, and Tara for wellbeing, with a fourth, Yoni, checking physical and temperament compatibility. GreatOhm combines this with Guna Milan so you see both the broad and the fine-grained view.'
    }
  ],
  'sade-sati.html': [
    {
      q: 'How long does Sade Sati last and which Moon signs are affected?',
      a: 'Sade Sati is a roughly seven and a half year period made up of three phases of about two and a half years each: rise, peak and setting. It is experienced by the sign opposite your Moon sign, so everyone passes through it, but the intensity and the specific phase vary considerably by Moon sign. GreatOhm shows your exact dates and your current phase.'
    },
    {
      q: 'What are the three phases of Sade Sati?',
      a: 'The rise is the entry phase where Saturn transits the sign just before your Moon sign, and it often feels like pressure building with unclear cause. The peak is the transit over your Moon sign, generally the most intense phase affecting emotions, health and relationships. The setting phase follows as Saturn moves to the next sign and the pressure begins to ease.'
    },
    {
      q: 'Is Sade Sati always negative?',
      a: 'No. Saturn transits are traditionally described as both the great teacher and the great burden, and most of the classic literature treats Sade Sati as a period of hard work, maturity and restructuring rather than pure misfortune. Difficulties that occur during the period are often attributed to Saturn, and the traditional advice is to use the period for discipline, honest effort and remedy.'
    }
  ],
  'manglik-dosha.html': [
    {
      q: 'What is Manglik Dosha or Mangal Dosha?',
      a: 'Manglik Dosha, also called Mangal Dosha or Kuja Dosha, is a planetary condition in Vedic astrology caused by the placement of Mars in certain houses of the birth chart. It is traditionally associated with aggression, conflict or delays in marriage, which is why kundli matching reports it separately. GreatOhm checks Mars from the Lagna, the Moon and the Venus positions.'
    },
    {
      q: 'How do I cancel or cure Manglik Dosha?',
      a: 'Traditional texts describe several cancellation factors, and checking them is the most reliable route, which is why GreatOhm reports them explicitly. They include Mars being cancelled by another planet such as Saturn or Jupiter, Mars sitting in its own sign or exalted sign, the degree of Mars being weak, and the presence of Manglik Dosha in both charts during matching, which balances the effect between the two people. Remedies such as Kumbh Vivah are also described in the tradition.'
    },
    {
      q: 'What is Kaal Sarp Dosha?',
      a: 'Kaal Sarp Dosha is a condition where all seven of the other planets are positioned on one side or the other of Rahu, with no planet in the 2nd, 4th or 10th house from Rahu. It is considered a significant dosha in many traditions because of the absence of a supporting house for Rahu. GreatOhm detects it from the chart and lists the specific classical remedies.'
    }
  ],
  'lal-kitab.html': [
    {
      q: 'How is Lal Kitab different from traditional Vedic astrology?',
      a: 'Lal Kitab is a later tradition that favours practical, day-to-day remedies over the heavier classical prescriptions, and is known for its emphasis on behavioural and timing-based corrections. Where classical Jyotish may call for a gemstone or a specific ritual, Lal Kitab commonly prescribes a simple change of habit, a routine shift or a remedy repeated over a set period, which is why it is often described as the practical astrology of everyday life.'
    },
    {
      q: 'What are the most common Lal Kitab remedies for money and marriage?',
      a: 'Common money remedies include keeping a square piece of silver or a coin in the wallet, watering the money plant on specific days, and donating or maintaining a cow-related charity depending on the sign. Marriage remedies commonly include offering milk to a cow, keeping a silver square, or performing a specific correction on a Tuesday or Thursday. GreatOhm maps the correct remedy and timing to your zodiac sign and dosha.'
    }
  ],
  'shubh-mahurat.html': [
    {
      q: 'What is the best Shubh Mahurat for marriage in 2026?',
      a: 'A Shubh Mahurat for marriage must satisfy several conditions together: the Moon and Mars should favour the seventh house of the bride and groom, the Navamsa of both charts must support marriage, and the day and time must avoid Rahu Kaal, Yamaganda, Gulika Kaal and other inauspicious windows. GreatOhm checks all of these against both charts and returns the best dates and time windows rather than a single date.'
    },
    {
      q: 'What is Rahu Kaal and why should it be avoided?',
      a: 'Rahu Kaal is an inauspicious time period that occurs every day for about 90 minutes, calculated from the Sun\u2019s position on that particular day. Because its length and timing change daily, it has to be looked up for the specific date rather than assumed. GreatOhm lists Rahu Kaal along with Abhijit Muhurat, Yamaganda and Gulika for every date it evaluates.'
    },
    {
      q: 'What is Abhijit Muhurat and is it the best time for everything?',
      a: 'Abhijit Muhurat is a short window of about 48 minutes in the late afternoon that falls in the middle of the day and is traditionally considered free from major malefic influence. It is often recommended for auspicious beginnings because it is relatively free of Rahu Kaal. However, classical texts still caution that general midday timings are not suitable for all purposes, and some muhurat traditions still recommend consulting a detailed chart.'
    }
  ]
};
