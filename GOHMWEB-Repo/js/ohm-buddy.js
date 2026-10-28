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
       A rounded "cosmic companion": mukut crown, tilak, listening ears
       and a trunk-curve smile as a playful blessing cue - never a
       depiction of the deity. Flat shapes with soft shading so it stays
       crisp at 70-90px. */
    var SVG =
        '<svg viewBox="0 0 120 132" role="img" aria-label="Ohm Buddy, the GreatOhm mascot">' +
        '<g class="ohm-ears">' +
        '<ellipse cx="16" cy="68" rx="13" ry="21" fill="#c2185b"/>' +
        '<ellipse cx="104" cy="68" rx="13" ry="21" fill="#c2185b"/>' +
        '<ellipse cx="16" cy="68" rx="6.5" ry="11" fill="#e91e63" opacity="0.55"/>' +
        '<ellipse cx="104" cy="68" rx="6.5" ry="11" fill="#e91e63" opacity="0.55"/>' +
        "</g>" +
        '<g class="ohm-arm-left">' +
        '<rect x="4" y="70" width="17" height="30" rx="8.5" fill="#14b8a6"/>' +
        '<circle cx="12.5" cy="70" r="9" fill="#14b8a6"/>' +
        '<circle cx="12.5" cy="68" r="4" fill="#5eead4" opacity="0.55"/>' +
        "</g>" +
        '<g class="ohm-arm-right">' +
        '<rect x="99" y="70" width="17" height="30" rx="8.5" fill="#14b8a6"/>' +
        '<circle cx="107.5" cy="70" r="9" fill="#14b8a6"/>' +
        '<circle cx="107.5" cy="68" r="4" fill="#5eead4" opacity="0.55"/>' +
        "</g>" +
        '<ellipse cx="42" cy="122" rx="13" ry="7" fill="#0d9488"/>' +
        '<ellipse cx="78" cy="122" rx="13" ry="7" fill="#0d9488"/>' +
        '<g class="ohm-body-g">' +
        '<ellipse cx="60" cy="74" rx="45" ry="47" fill="#e91e63"/>' +
        '<ellipse cx="45" cy="52" rx="20" ry="16" fill="#ff7aa8" opacity="0.32"/>' +
        '<ellipse cx="60" cy="112" rx="30" ry="11" fill="#c2185b" opacity="0.30"/>' +
        '<g class="ohm-mukut">' +
        '<path d="M32 34 Q60 46 88 34 L84 16 L72 24 L60 10 L48 24 L36 16 Z" fill="#14b8a6"/>' +
        '<path d="M32 34 Q60 46 88 34 L86.5 29 Q60 40 33.5 29 Z" fill="#0d9488"/>' +
        '<circle cx="45" cy="31" r="2.2" fill="#ccfbf1" opacity="0.85"/>' +
        '<circle cx="60" cy="33.5" r="2.6" fill="#ccfbf1" opacity="0.85"/>' +
        '<circle cx="75" cy="31" r="2.2" fill="#ccfbf1" opacity="0.85"/>' +
        '<circle cx="60" cy="17" r="3.4" fill="#e91e63" stroke="#ccfbf1" stroke-width="1.4"/>' +
        "</g>" +
        '<ellipse cx="60" cy="50" rx="2.2" ry="3" fill="#5eead4"/>' +
        '<g class="ohm-eyes">' +
        '<ellipse cx="45" cy="62" rx="11" ry="12" fill="#ffffff"/>' +
        '<ellipse cx="75" cy="62" rx="11" ry="12" fill="#ffffff"/>' +
        '<circle cx="47" cy="64" r="5.4" fill="#141414"/>' +
        '<circle cx="73" cy="64" r="5.4" fill="#141414"/>' +
        '<circle cx="48.8" cy="61.6" r="2" fill="#ffffff"/>' +
        '<circle cx="74.8" cy="61.6" r="2" fill="#ffffff"/>' +
        "</g>" +
        '<ellipse cx="29" cy="81" rx="7" ry="4.4" fill="#ff8fb3" opacity="0.55"/>' +
        '<ellipse cx="91" cy="81" rx="7" ry="4.4" fill="#ff8fb3" opacity="0.55"/>' +
        '<path d="M47 82 Q60 94 73 82 Q70 90 62 90 Q58 90 56 88" stroke="#ffffff" stroke-width="4.2" fill="none" stroke-linecap="round"/>' +
        '<path d="M95 38 l1.8 4.4 4.4 1.8 -4.4 1.8 -1.8 4.4 -1.8 -4.4 -4.4 -1.8 4.4 -1.8 Z" fill="#5eead4" opacity="0.9"/>' +
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
