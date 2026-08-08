/* ============================================================
   GREATOHM — Main JavaScript
   - Infinite marquee of app screenshots (13 screenshots)
   - Floating stars background
   - Nav menu, scroll effects, forms
============================================================ */

(function () {
    "use strict";

    /* ============================================================
       1. SCREENSHOT DATA — 📝 EDIT HERE: Replace titles & descriptions
          with the real screen name and feature text for each snapshot.
          (Index 0 = screenshot 1-trim.png, etc.)
    ============================================================ */
    const SCREEN_DATA = [
        {
            title: "Login Screen to Omni Space",
            desc: "Apps login screen and a command center for all occult sciences — enter and explore.",
        },
        {
            title: "Daily Horoscope",
            desc: "Precise daily, weekly and monthly readings powered by real planetary positions.",
        },
        {
            title: "Kundli & Birth Chart",
            desc: "Your complete Vedic birth chart with dashas, yogas and deep planetary insight.",
        },
        {
            title: "Numerology",
            desc: "Life path, destiny number, name and mobile numerology explained in detail.",
        },
        {
            title: "Palmistry",
            desc: "Detailed palm reading guides for lines, mounts and beyond.",
        },
        {
            title: "Tarot & Oracle",
            desc: "Daily card pulls and rich, guided spreads for intuitive clarity.",
        },
        {
            title: "Vastu Guidance",
            desc: "Harmonise your home and workspace with practical Vastu remedies.",
        },
        {
            title: "Vedic Calendar",
            desc: "Everything from Pachanga to tithis to planetary events at your fingertips.",
        },
        {
            title: "Join us as an expert",
            desc: "If you feel you have the occult knowledge to share with the world, then join us.",
        },
        {
            title: "Community connect",
            desc: "Connect with like minded and spiritualy aligned people.",
        },
        {
            title: "Ohm Score breakdown",
            desc: "Identify what's stopping you from outperforming.",
        },
        {
            title: "Remedies & Rituals",
            desc: "Gentle remedies, mantras and rituals tailored to your planetary profile.",
        },
        {
            title: "Your Sacred Space",
            desc: "Your account details, orders, wallet, terms, policies, offers etc..",
        },
    ];

    /* DOM refs */
    const marqueeTrack = document.getElementById("marqueeTrack");
    const marqueeStage = document.getElementById("marqueeStage");
    const captionTitle = document.getElementById("captionTitle");
    const captionDesc = document.getElementById("captionDesc");
    const captionBox = document.getElementById("captionBox");

    let activeIndex = 0;
    let isPaused = false;

    /* ============================================================
       2. BUILD PHONES
       The marquee track contains the full set of phones twice
       so the CSS animation (translateX -50%) loops seamlessly.
    ============================================================ */
    function buildPhones() {
        if (!marqueeTrack) return;

        const fragment = document.createDocumentFragment();

        for (let i = 0; i < SCREEN_DATA.length; i++) {
            const num = i + 1;

            const phone = document.createElement("div");
            phone.className = "phone" + (i === 0 ? " active" : "");
            phone.dataset.index = i;
            phone.setAttribute("role", "button");
            phone.setAttribute("tabindex", "0");
            phone.setAttribute("aria-label", "Screenshot " + num + ": " + SCREEN_DATA[i].title);

            const frame = document.createElement("div");
            frame.className = "phone-frame";

            const notch = document.createElement("div");
            notch.className = "phone-notch";

            const screen = document.createElement("div");
            screen.className = "phone-screen";

            const img = document.createElement("img");
            img.src = "assets/screenshots/" + num + "-trim.png";
            img.alt = "GreatOhm app screenshot " + num;
            img.loading = "lazy";
            img.draggable = false;

            screen.appendChild(img);

            const shadow = document.createElement("div");
            shadow.className = "phone-shadow";

            frame.appendChild(notch);
            frame.appendChild(screen);
            phone.appendChild(frame);
            phone.appendChild(shadow);

            fragment.appendChild(phone);
        }

        /* First set of phones */
        marqueeTrack.appendChild(fragment);

        /* Deep-clone each phone for a seamless infinite loop */
        const firstSet = Array.prototype.slice.call(marqueeTrack.children);
        firstSet.forEach(function (original) {
            marqueeTrack.appendChild(original.cloneNode(true));
        });

        /* Wire up clicks on all phones (original + cloned sets) */
        const allPhones = marqueeTrack.children;
        for (let j = 0; j < allPhones.length; j++) {
            const idx = j % SCREEN_DATA.length;
            allPhones[j].addEventListener("click", function () {
                selectPhone(idx);
            });
            allPhones[j].addEventListener("keydown", function (e) {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    selectPhone(idx);
                }
            });
        }
    }

    /* ============================================================
       3. SELECT PHONE + CAPTION
    ============================================================ */
    function selectPhone(index) {
        activeIndex = index;
        const phones = marqueeTrack ? marqueeTrack.children : [];

        for (let i = 0; i < phones.length; i++) {
            const idx = i % SCREEN_DATA.length;
            phones[i].classList.toggle("active", idx === activeIndex);
        }

        /* Pause the marquee so the selected phone stays in view */
        if (marqueeTrack) {
            marqueeTrack.style.animationPlayState = "paused";
            isPaused = true;
        }

        updateCaption(activeIndex);
    }

    /* Resume the marquee after a short delay */
    function resumeMarquee() {
        if (marqueeTrack && isPaused) {
            marqueeTrack.style.animationPlayState = "running";
            isPaused = false;
        }
    }

    /* ============================================================
       4. CAPTION
    ============================================================ */
    function updateCaption(index) {
        if (!captionBox || !captionTitle || !captionDesc) return;

        const data = SCREEN_DATA[index];

        /* Fade out, swap text, fade in */
        captionBox.classList.add("fade");

        setTimeout(function () {
            captionTitle.textContent = data.title;
            captionDesc.textContent = data.desc;
            captionBox.classList.remove("fade");
        }, 320);
    }

    /* ============================================================
       5. LOGO ANIMATION
    ============================================================ */
    function initLogoSwap() {
        // No alternating needed — CSS handles the pulse animation on .logo-duo
        // Nav logos are always visible via CSS flex layout
    }

    /* ============================================================
       6. FLOATING STARS
    ============================================================ */
    function initStars() {
        const container = document.getElementById("stars");
        if (!container) return;

        const STAR_COUNT = 24;
        const fragment = document.createDocumentFragment();

        for (let i = 0; i < STAR_COUNT; i++) {
            const star = document.createElement("div");
            star.className = "star";
            star.style.left = Math.random() * 100 + "vw";
            star.style.width = star.style.height = 3 + Math.random() * 5 + "px";
            star.style.animationDuration = 14 + Math.random() * 22 + "s";
            star.style.animationDelay = -Math.random() * 30 + "s";
            star.style.opacity = 0.15 + Math.random() * 0.25;
            fragment.appendChild(star);
        }

        container.appendChild(fragment);
    }

    /* ============================================================
       7. HEADER SCROLL EFFECT
    ============================================================ */
    function initHeader() {
        const header = document.querySelector(".site-header");
        if (!header) return;

        window.addEventListener("scroll", function () {
            if (window.scrollY > 40) {
                header.classList.add("scrolled");
            } else {
                header.classList.remove("scrolled");
            }
        }, { passive: true });
    }

    /* ============================================================
       8. MOBILE NAV TOGGLE
    ============================================================ */
    function initNav() {
        const toggle = document.getElementById("navToggle");
        const links = document.getElementById("navLinks");
        if (!toggle || !links) return;

        toggle.addEventListener("click", function () {
            toggle.classList.toggle("open");
            links.classList.toggle("open");
        });

        links.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                toggle.classList.remove("open");
                links.classList.remove("open");
            });
        });
    }

    /* ============================================================
       9. FAQ ACCORDION (content pages)
    ============================================================ */
    function initFaq() {
        document.querySelectorAll(".faq-item .faq-q").forEach(function (q) {
            q.addEventListener("click", function () {
                const item = q.closest(".faq-item");
                const wasOpen = item.classList.contains("open");

                /* Close all items in the same list */
                const list = item.closest(".faq-list");
                if (list) {
                    list.querySelectorAll(".faq-item").forEach(function (other) {
                        other.classList.remove("open");
                    });
                }

                /* Open the clicked item (if it was closed) */
                if (!wasOpen) {
                    item.classList.add("open");
                }
            });
        });
    }

    /* ============================================================
       10. FORMS (frontend only demo)
    ============================================================ */
    function initForms() {
        const notifyForm = document.getElementById("notifyForm");
        const notifyEmail = document.getElementById("notifyEmail");
        const notifyNote = document.getElementById("notifyNote");

        if (notifyForm && notifyNote) {
            notifyForm.addEventListener("submit", function (e) {
                e.preventDefault();
                const email = notifyEmail ? notifyEmail.value.trim() : "";
                if (!email) return;

                /* 📝 EDIT HERE: connect to your backend / email service later */
                notifyNote.textContent = "\u2728 Thank you! You'll be notified when GreatOhm launches.";
                notifyForm.reset();
            });
        }

        const contactForm = document.getElementById("contactForm");
        if (contactForm) {
            contactForm.addEventListener("submit", function (e) {
                e.preventDefault();
                /* 📝 EDIT HERE: connect to your backend / email service later */
                alert("Thank you for your message! (Demo — connect this form to your email/backend.)");
                contactForm.reset();
            });
        }
    }

    /* ============================================================
       11. INIT
    ============================================================ */
    document.addEventListener("DOMContentLoaded", function () {
        buildPhones();
        updateCaption(0);
        initLogoSwap();
        initStars();
        initHeader();
        initNav();
        initFaq();
        initForms();

        /* Resume marquee after a pause (e.g. after clicking a phone) */
        if (marqueeStage) {
            marqueeStage.addEventListener("mouseleave", function () {
                resumeMarquee();
            });
            marqueeStage.addEventListener("touchend", function () {
                setTimeout(resumeMarquee, 1500);
            });
        }
    });
})();