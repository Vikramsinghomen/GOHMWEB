/* ============================================================
   GREATOHM — Ohm Buddy mascot behaviour (part 1: art + helpers)
   Pure CSS/SVG/JS, no dependencies. Brand pink + turquoise.
   ============================================================ */
(function () {
    "use strict";

    if (typeof document === "undefined") return;
    if (document.getElementById("ohmBuddy")) return; // idempotent

    var REDUCED = window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* Mascot artwork (brand pink #e91e63 + turquoise #14b8a6).
       Ganesha-inspired cues, kept tiny and playful: mini mukut crown,
       tilak dot, rounded listening ears, trunk-curve smile. A mascot
       with a blessing — never a depiction of the deity himself. */
    var SVG =
        '<svg viewBox="0 0 120 132" role="img" aria-label="Ohm Buddy, the GreatOhm mascot">' +
        '<g class="ohm-ears">' +
        '<ellipse cx="9" cy="58" rx="14" ry="23" fill="#c2185b"/>' +
        '<ellipse cx="111" cy="58" rx="14" ry="23" fill="#c2185b"/>' +
        '<ellipse cx="9" cy="58" rx="7" ry="12" fill="#e91e63" opacity="0.55"/>' +
        '<ellipse cx="111" cy="58" rx="7" ry="12" fill="#e91e63" opacity="0.55"/>' +
        "</g>" +
        '<g class="ohm-arm-left">' +
        '<rect x="6" y="62" width="16" height="34" rx="8" fill="#14b8a6"/>' +
        "</g>" +
        '<g class="ohm-arm-right">' +
        '<rect x="98" y="62" width="16" height="34" rx="8" fill="#14b8a6"/>' +
        '<circle cx="106" cy="64" r="9" fill="#14b8a6"/>' +
        "</g>" +
        '<ellipse cx="42" cy="124" rx="13" ry="7" fill="#0d9488"/>' +
        '<ellipse cx="78" cy="124" rx="13" ry="7" fill="#0d9488"/>' +
        '<g class="ohm-body-g">' +
        '<ellipse cx="60" cy="70" rx="46" ry="50" fill="#e91e63"/>' +
        '<ellipse cx="60" cy="88" rx="26" ry="22" fill="#ccfbf1" opacity="0.9"/>' +
        '<circle cx="34" cy="78" r="7" fill="#5eead4" opacity="0.65"/>' +
        '<circle cx="86" cy="78" r="7" fill="#5eead4" opacity="0.65"/>' +
        '<g class="ohm-mukut">' +
        '<path d="M34 32 Q60 46 86 32 L82 12 Q71 20 60 20 Q49 20 38 12 Z" fill="#14b8a6"/>' +
        '<path d="M34 32 Q60 46 86 32 L85 27 Q60 40 35 27 Z" fill="#0d9488"/>' +
        '<circle cx="46" cy="26" r="3" fill="#ccfbf1"/>' +
        '<circle cx="60" cy="29" r="3.8" fill="#ccfbf1"/>' +
        '<circle cx="74" cy="26" r="3" fill="#ccfbf1"/>' +
        '<circle cx="60" cy="18" r="3.2" fill="#e91e63" stroke="#ccfbf1" stroke-width="1.4"/>' +
        "</g>" +
        '<circle cx="60" cy="47" r="3.4" fill="#ffd54f" opacity="0.95"/>' +
        '<g class="ohm-eyes">' +
        '<circle cx="45" cy="60" r="11" fill="#ffffff"/>' +
        '<circle cx="75" cy="60" r="11" fill="#ffffff"/>' +
        '<circle cx="47" cy="62" r="5" fill="#111111"/>' +
        '<circle cx="73" cy="62" r="5" fill="#111111"/>' +
        '<circle cx="49" cy="60" r="1.8" fill="#ffffff"/>' +
        '<circle cx="75" cy="60" r="1.8" fill="#ffffff"/>' +
        "</g>" +
        '<path d="M48 76 Q62 88 74 76 Q68 86 60 86 Q56 86 55 82" stroke="#ffffff" stroke-width="4" fill="none" stroke-linecap="round"/>' +
        '<path d="M92 26 l2.2 5.4 5.4 2.2 -5.4 2.2 -2.2 5.4 -2.2 -5.4 -5.4 -2.2 5.4 -2.2 Z" fill="#5eead4"/>' +
        "</g>" +
        "</svg>";

    /* Messages */
    var GREETINGS = [
        "Namaste! I am Ohm Buddy - your cosmic companion.",
        "Hey there! Curious about your Ohm Score today?",
        "Welcome to GreatOhm! Astrology, numerology, tarot and more - one app."
    ];
    var TIPS = [
        "Psst - your daily Ohm Score blends all five sciences into one number.",
        "Try the tarot pull for a quick daily reflection.",
        "Numerology fans: your Mulank shapes your day - check the app!",
        "A tidy entrance = happy Vaastu energy.",
        "Your palm lines tell a story - explore palmistry in the app."
    ];
    var CHEERS = [
        "Yay! Great choice!",
        "Woohoo! The stars approve!",
        "Let's gooo!"
    ];
    var NUDGE = "Still here? Tap me - I have cosmic tips!";

    var tipIndex = 0;
    var hero = null;

    function pick(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function say(buddy, bubble, text, holdMs) {
        if (!buddy || !bubble) return;
        bubble.textContent = text;
        buddy.classList.add("is-talking");
        clearTimeout(say._t);
        say._t = setTimeout(function () {
            buddy.classList.remove("is-talking");
        }, holdMs || 5200);
    }

    function wave(buddy) {
        if (REDUCED || !buddy) return;
        buddy.classList.remove("is-waving");
        void buddy.offsetWidth;
        buddy.classList.add("is-waving");
        setTimeout(function () {
            buddy.classList.remove("is-waving");
        }, 1400);
    }

    function celebrate(buddy, bubble) {
        if (!buddy) return;
        wave(buddy);
        say(buddy, bubble, pick(CHEERS), 3200);
        if (!REDUCED) {
            buddy.classList.remove("is-celebrating");
            void buddy.offsetWidth;
            buddy.classList.add("is-celebrating");
            setTimeout(function () {
                buddy.classList.remove("is-celebrating");
            }, 1000);
        }
        if (hero) {
            hero.classList.remove("is-celebrating");
            void hero.offsetWidth;
            hero.classList.add("is-celebrating");
            setTimeout(function () {
                hero.classList.remove("is-celebrating");
            }, 1000);
        }
    }

    /* Floating buddy (every page) */
    var buddy = document.createElement("div");
    buddy.className = "ohm-buddy";
    buddy.id = "ohmBuddy";
    buddy.setAttribute("role", "button");
    buddy.setAttribute("tabindex", "0");
    buddy.setAttribute("aria-label", "Ohm Buddy - tap for a cosmic tip");
    buddy.innerHTML =
        '<div class="ohm-bubble" role="status"></div>' +
        '<div class="ohm-sparkle" aria-hidden="true">✨ 🎉 ✨</div>' +
        SVG;

    var bubble = buddy.querySelector(".ohm-bubble");

    function onTap() {
        tipIndex = (tipIndex + 1) % TIPS.length;
        celebrate(buddy, bubble);
        setTimeout(function () {
            say(buddy, bubble, TIPS[tipIndex], 6000);
        }, REDUCED ? 0 : 900);
    }

    /* Hero buddy (Download section, index page) */
    function mountHero() {
        var cta = document.querySelector("#download .cta-inner");
        if (!cta || document.getElementById("ohmHero")) return;
        hero = document.createElement("div");
        hero.className = "ohm-hero";
        hero.id = "ohmHero";
        hero.innerHTML =
            '<div class="ohm-hero-svg">' +
            '<div class="ohm-sparkle" aria-hidden="true">✨ 🎉 ✨</div>' +
            SVG +
            "</div>" +
            '<p class="ohm-hero-caption">Meet Ohm Buddy ✨</p>' +
            '<p class="ohm-hero-sub">Your playful guide to the GreatOhm app — tap the little buddy anytime!</p>';
        cta.insertBefore(hero, cta.firstChild);
        if ("IntersectionObserver" in window && !REDUCED) {
            var seen = false;
            var io = new IntersectionObserver(function (entries) {
                entries.forEach(function (en) {
                    if (en.isIntersecting && !seen) {
                        seen = true;
                        hero.classList.add("is-waving");
                        setTimeout(function () {
                            hero.classList.remove("is-waving");
                        }, 1400);
                        io.disconnect();
                    }
                });
            }, { threshold: 0.4 });
            io.observe(hero);
        }
        cta.addEventListener("click", function (e) {
            var badge = e.target && e.target.closest
                ? e.target.closest(".store-badge")
                : null;
            if (badge) celebrate(buddy, bubble);
        });
    }

    document.addEventListener("DOMContentLoaded", function () {
        document.body.appendChild(buddy);
        setTimeout(function () {
            say(buddy, bubble, pick(GREETINGS), 6000);
            wave(buddy);
        }, 1200);
        buddy.addEventListener("mouseenter", function () {
            wave(buddy);
        });
        buddy.addEventListener("click", onTap);
        buddy.addEventListener("keydown", function (e) {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onTap();
            }
        });
        var interacted = false;
        ["click", "touchstart", "keydown"].forEach(function (evt) {
            window.addEventListener(evt, function () {
                interacted = true;
            }, { once: true, passive: true });
        });
        setTimeout(function () {
            if (!interacted && !buddy.classList.contains("is-talking")) {
                say(buddy, bubble, NUDGE, 6000);
                wave(buddy);
            }
        }, 50000);
        mountHero();
    });
})();
