"""Generate branded 1200x630 OG cards for the blog pages.
Matches tools/generate-og-images.ps1 style: dark teal gradient,
turquoise glow, top accent bar, logo card, headline, subline,
greatohm.com footer. Pure ASCII text (Pillow default font).
Usage: python tools/gen-blog-og.py
"""
import os
from PIL import Image, ImageDraw, ImageFont

REPO = os.path.join(os.path.dirname(__file__), '..', 'GOHMWEB-Repo')
OUT = os.path.join(REPO, 'assets', 'og')
W, H = 1200, 630

BLACK = (17, 17, 17)
TEAL_DK = (6, 78, 74)
TURQ = (20, 184, 166)
TURQ_LT = (94, 234, 212)
TURQ_SOFT = (204, 251, 241)
WHITE = (255, 255, 255)

try:
    F_HEAD = ImageFont.truetype('segoeui.ttf', 64)
    F_SUB = ImageFont.truetype('segoeui.ttf', 32)
    F_EYE = ImageFont.truetype('segoeuib.ttf', 24)
    F_FOOT = ImageFont.truetype('segoeuib.ttf', 28)
except OSError:
    F_HEAD = ImageFont.load_default()
    F_SUB = ImageFont.load_default()
    F_EYE = ImageFont.load_default()
    F_FOOT = ImageFont.load_default()

PAGES = [
    ('blog', 'GREATOHM BLOG', 'Guides and Insights', 'Occult Sciences, Explained Calmly', 'G'),
    ('blog-chaldean-vs-pythagorean-numerology', 'NUMEROLOGY', 'Chaldean vs Pythagorean', 'Which System Is Right for You', '7'),
    ('blog-lo-shu-grid-missing-numbers', 'NUMEROLOGY', 'Lo Shu Missing Numbers', 'Meanings and Balancing Remedies', '#'),
    ('blog-master-numbers-11-22-33', 'NUMEROLOGY', 'Master Numbers 11, 22, 33', 'Power, Pressure and Purpose', 'M'),
    ('blog-reversed-tarot-cards', 'TAROT AND ORACLE', 'Reversed Tarot Cards', 'A Calm Beginners Guide', 'R'),
    ('blog-sade-sati-three-phases', 'VEDIC ASTROLOGY', 'Sade Sati: Three Phases', 'Saturns 7.5-Year Transit', 'S'),
    ('blog-vastu-pyramid-placement', 'VASTU SHASTRA', 'Vastu Pyramid Placement', 'Where to Put Them and Why', 'V'),
    ('blog-50-questions-indians-ask-astrologers', 'ASTROLOGY QA', '50 Questions Indians Ask', 'Career, Marriage, Doshas and Timing', 'A'),
    ('blog-50-astrology-questions-worldwide', 'ASTROLOGY QA', '50 Astrology Questions', 'What the World Asks Most', 'A'),
    ('blog-50-numerology-questions-indians-ask', 'NUMEROLOGY QA', '50 Numerology Questions', 'What India Asks Most', '7'),
    ('blog-50-numerology-questions-worldwide', 'NUMEROLOGY QA', '50 Numerology Questions', 'What the World Asks Most', '7'),
    ('blog-50-vastu-questions-indians-ask', 'VASTU QA', '50 Vaastu Questions', 'What India Asks Most', 'V'),
    ('blog-50-vastu-fengshui-questions-worldwide', 'VASTU QA', '50 Vaastu and Feng Shui Qs', 'What the World Asks Most', 'V'),
    ('blog-50-palmistry-questions-indians-ask', 'PALMISTRY QA', '50 Palmistry Questions', 'What India Asks Most', 'P'),
    ('blog-50-palmistry-questions-worldwide', 'PALMISTRY QA', '50 Palmistry Questions', 'What the World Asks Most', 'P'),
    ('blog-50-tarot-questions-indians-ask', 'TAROT QA', '50 Tarot Questions', 'What India Asks Most', 'T'),
    ('blog-50-tarot-questions-worldwide', 'TAROT QA', '50 Tarot Questions', 'What the World Asks Most', 'T'),
]


def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def make(slug, eyebrow, head, sub, icon):
    img = Image.new('RGB', (W, H), BLACK)
    px = img.load()
    for y in range(H):
        for x in range(W):
            t = (x / W * 0.7 + y / H * 0.3)
            px[x, y] = lerp(BLACK, TEAL_DK, t)
    d = ImageDraw.Draw(img, 'RGBA')
    # glow top-right
    for r in range(320, 0, -8):
        alpha = int(60 * (1 - r / 320))
        d.ellipse([760 + 320 - r, -220 + 320 - r, 760 + 320 + r, -220 + 320 + r],
                  fill=(20, 184, 166, max(alpha, 0)))
    # top accent bar
    d.rectangle([0, 0, W, 8], fill=TURQ)
    # icon roundel
    d.ellipse([1000, 52, 1128, 180], fill=(20, 184, 166, 40), outline=TURQ_LT, width=3)
    d.text((1064, 116), icon, font=F_HEAD, fill=TURQ_SOFT, anchor='mm')
    # eyebrow / headline / sub
    d.text((72, 194), eyebrow, font=F_EYE, fill=TURQ_LT)
    d.text((72, 250), head, font=F_HEAD, fill=WHITE)
    d.text((72, 442), sub, font=F_SUB, fill=TURQ_SOFT)
    # footer rule + domain
    d.line([72, 522, 1128, 522], fill=(94, 234, 212, 90), width=2)
    d.text((72, 542), 'greatohm.com', font=F_FOOT, fill=WHITE)
    d.text((1128, 546), 'Vedic guidance, numerology, Vaastu and more', font=F_SUB, fill=TURQ_SOFT, anchor='ra')
    # logo card
    logo_path = os.path.join(REPO, 'assets', 'logo1-trim.png')
    if os.path.exists(logo_path):
        logo = Image.open(logo_path).convert('RGBA')
        card = Image.new('RGBA', (262, 112), (255, 255, 255, 242))
        img.paste(card, (60, 44), card)
        logo.thumbnail((226, 82))
        img.paste(logo, (60 + (262 - logo.width) // 2, 44 + (112 - logo.height) // 2), logo)
    out = os.path.join(OUT, slug + '-og.png')
    img.convert('RGB').save(out)
    print('generated: ' + out)


for p in PAGES:
    make(*p)
print('total: %d images' % len(PAGES))
