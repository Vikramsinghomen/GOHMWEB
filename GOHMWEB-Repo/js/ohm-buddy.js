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

    /* Mascot artwork: the flat avatar-lab face (solid body, two bold
       rounded eyes) crossed with a ringed planet. One turquoise ring, drawn
       flat so it reads as horizontal: a full loop behind the body plus its
       lower half in front, which is what makes the ring wrap the sphere.

       The ring is not rotated - a flat ring is symmetric, so rotating it
       would only tilt it. Its spin is carried by mint streaks sliding along
       the band. Both halves are the *same* curve with the same dash phase
       and the front arc is literally the first half of the back path, so a
       streak glides from the front to the back without a seam at the tips
       (see .ohm-orbit in ohm-buddy.css).

       The eyes sit in their own .ohm-pupils group so pointer tracking can
       translate them while .ohm-eyes keeps handling the blink. */
    var RING_BACK = "M8 62A52 15 0 0 0 112 62A52 15 0 0 0 8 62";
    var RING_FRONT = "M8 62A52 15 0 0 0 112 62";
    var SVG =
        '<svg viewBox="0 0 120 120" role="img" aria-label="Ohm Buddy, the GreatOhm mascot">' +
        '<g class="ohm-ring-back">' +
        '<path d="' + RING_BACK + '" fill="none" stroke="#14b8a6" stroke-width="7"/>' +
        '<path class="ohm-orbit" d="' + RING_BACK + '" fill="none" stroke="#ccfbf1" stroke-width="5" stroke-linecap="round"/>' +
        "</g>" +
        '<g class="ohm-body-g">' +
        '<circle cx="60" cy="62" r="35" fill="#e91e63"/>' +
        '<g class="ohm-eyes">' +
        '<g class="ohm-pupils">' +
        '<rect x="41" y="44" width="11" height="24" rx="5.5" fill="#141414" transform="rotate(-9 46.5 56)"/>' +
        '<rect x="68" y="44" width="11" height="24" rx="5.5" fill="#141414" transform="rotate(9 73.5 56)"/>' +
        "</g>" +
        "</g>" +
        "</g>" +
        '<g class="ohm-ring-front">' +
        '<path d="' + RING_FRONT + '" fill="none" stroke="#14b8a6" stroke-width="7"/>' +
        '<path class="ohm-orbit" d="' + RING_FRONT + '" fill="none" stroke="#ccfbf1" stroke-width="5" stroke-linecap="round"/>' +
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

    /* ---------- Eyes follow the pointer ---------- */
    /* Both eyes move together, like a pair of pupils. Travel is capped in
       viewBox units so they never slide off the face, and the vertical range
       is tighter than the horizontal one. */
    var LOOK = 3.8;
    var pupils = [];
    var pointer = { x: 0, y: 0, has: false };
    var lookQueued = false;

    function collectPupils() {
        pupils = Array.prototype.slice.call(
            document.querySelectorAll(".ohm-pupils")
        );
    }

    function look() {
        lookQueued = false;
        if (!pointer.has) return;
        for (var i = 0; i < pupils.length; i++) {
            var el = pupils[i];
            var svg = el.ownerSVGElement;
            if (!svg) continue;
            var box = svg.getBoundingClientRect();
            if (!box.width || !box.height) continue;
            var dx = pointer.x - (box.left + box.width / 2);
            var dy = pointer.y - (box.top + box.height / 2);
            var dist = Math.sqrt(dx * dx + dy * dy);
            if (!dist) continue;
            // full deflection once the pointer is a short way out
            var reach = Math.min(1, dist / (box.width * 1.2));
            var ox = (dx / dist) * LOOK * reach;
            var oy = (dy / dist) * LOOK * reach * 0.8;
            el.style.transform =
                "translate(" + ox.toFixed(2) + "px," + oy.toFixed(2) + "px)";
        }
    }

    function queueLook() {
        if (lookQueued) return;
        lookQueued = true;
        window.requestAnimationFrame(look);
    }

    function resetLook() {
        pointer.has = false;
        for (var i = 0; i < pupils.length; i++) {
            pupils[i].style.transform = "";
        }
    }

    function trackPointer() {
        if (REDUCED) return; // reduced motion: the buddy stays still
        document.addEventListener("mousemove", function (e) {
            pointer.x = e.clientX;
            pointer.y = e.clientY;
            pointer.has = true;
            queueLook();
        }, { passive: true });
        // the buddy may scroll under a stationary cursor
        window.addEventListener("scroll", queueLook, { passive: true });
        document.addEventListener("mouseleave", resetLook);
        document.addEventListener("touchstart", resetLook, { passive: true });
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
        collectPupils();
        trackPointer();
    });
})();
