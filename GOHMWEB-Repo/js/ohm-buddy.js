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

    function narrowScreen() {
        // Below this the hero buttons span the full width, and a greeting
        // bubble would sit right on top of the Download button.
        return window.innerWidth < 900;
    }

    /* Mascot artwork, in the spirit of the flat "avatar lab" look:
       one solid organic silhouette, no outlines, and two bold rounded
       eyes that lean outward. Reads clearly down to ~60px, and the
       gentle breathing squash gives it life without any detail noise. */
    var SVG =
        '<svg viewBox="0 0 120 120" role="img" aria-label="Ohm Buddy, the GreatOhm mascot">' +
        '<g class="ohm-body-g">' +
        '<path d="M60 7C85 7 105 25 106 51C107 80 87 108 60 108C33 108 13 80 14 51C15 25 35 7 60 7Z" fill="#e91e63"/>' +
        '<g class="ohm-eyes">' +
        '<rect x="35" y="45" width="15" height="32" rx="7.5" fill="#141414" transform="rotate(-9 42.5 61)"/>' +
        '<rect x="70" y="45" width="15" height="32" rx="7.5" fill="#141414" transform="rotate(9 77.5 61)"/>' +
        "</g>" +
        "</g>" +
        "</svg>";

    /* Messages */
    var GREETINGS = [
        "Namaste! I am Ohm Buddy — your cosmic companion.",
        "Hey there! Curious about your Ohm Score today?",
        "Welcome to GreatOhm! Astrology, numerology, tarot and more — one app."
    ];
    var TIPS = [
        "Psst — your daily Ohm Score blends all five sciences into one number.",
        "Try the tarot pull for a quick daily reflection.",
        "Numerology fans: your Mulank shapes your day — check the app!",
        "A tidy entrance = happy Vaastu energy.",
        "Your palm lines tell a story — explore palmistry in the app."
    ];
    var CHEERS = [
        "Yay! Great choice!",
        "Woohoo! The stars approve!",
        "Let's gooo!"
    ];
    var NUDGE = "Still here? Tap me — I have cosmic tips!";

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
            wave(buddy);
            if (narrowScreen()) return;
            say(buddy, bubble, pick(GREETINGS), 6000);
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
            if (!interacted && !narrowScreen() && !buddy.classList.contains("is-talking")) {
                say(buddy, bubble, NUDGE, 6000);
                wave(buddy);
            }
        }, 50000);
        mountHero();
    });
})();
