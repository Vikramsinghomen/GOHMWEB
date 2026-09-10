/* ============================================================
   GREATOHM — Main JavaScript
   - Infinite marquee of app screenshots (34 screenshots)
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
            title: "All Services",
            desc: "Every occult science in one app — browse, search, and jump straight in.",
        },
        {
            title: "Skillful Search",
            desc: "Find any service instantly with a quick, global search.",
        },
        {
            title: "Explore the Catalogue",
            desc: "Scroll through GreatOhm's full line-up of services.",
        },
        {
            title: "Quick Access",
            desc: "Reach your favourite services right from the bottom bar.",
        },
        {
            title: "Omni Calculator",
            desc: "One calculator for all your occult science calculations.",
        },
        {
            title: "Ohm Score",
            desc: "Your personal energy score, at a glance.",
        },
        {
            title: "Ohm Score Breakdown",
            desc: "Detailed graphs show exactly what is holding your score back.",
        },
        {
            title: "GreatOhm AI",
            desc: "Instant, personalised guidance whenever you need it.",
        },
        {
            title: "Astrology",
            desc: "The top astrology services, one tap away.",
        },
        {
            title: "Astrology — Deeper Insights",
            desc: "Go further with advanced charts and analyses.",
        },
        {
            title: "Astrology — Specialised Reads",
            desc: "From dashas to yogas, find every reading you need.",
        },
        {
            title: "Astrology — Full Library",
            desc: "Twenty-plus astrology tools, all in one place.",
        },
        {
            title: "Astrology — Complete Set",
            desc: "Everything from birth charts to predictions, covered.",
        },
        {
            title: "Numerology",
            desc: "Core numerology readings for your numbers.",
        },
        {
            title: "Numerology — Advanced",
            desc: "Deeper breakdowns of life path, name, and mobile numbers.",
        },
        {
            title: "Numerology — Complete",
            desc: "The full numerology toolkit, ready to use.",
        },
        {
            title: "Palmistry",
            desc: "Palm reading guides for lines, mounts, and beyond.",
        },
        {
            title: "Tarot & Oracle",
            desc: "Daily pulls and guided spreads for intuitive clarity.",
        },
        {
            title: "Vastu Guidance",
            desc: "Practical Vastu remedies for home and workspace.",
        },
        {
            title: "Vastu — Advanced Remedies",
            desc: "Deeper guidance for aligning your space.",
        },
        {
            title: "Vedic Calendar",
            desc: "Panchanga, tithis and planetary events at a glance.",
        },
        {
            title: "Moon Locator",
            desc: "Track the Moon's position and phase, live.",
        },
        {
            title: "Past Memories",
            desc: "Explore past-life insights and memory patterns.",
        },
        {
            title: "Super Number Generator",
            desc: "Generate powerful numbers for your mobile.",
        },
        {
            title: "Bank Account Generator",
            desc: "Find a strong number for your bank account.",
        },
        {
            title: "Remedies & Rituals",
            desc: "Gentle remedies and rituals tailored to your profile.",
        },
        {
            title: "GreatOhm Club",
            desc: "Exclusive member benefits inside the GreatOhm Club.",
        },
        {
            title: "Register as an Expert",
            desc: "Share your occult knowledge with the world.",
        },
        {
            title: "More Menu",
            desc: "Everything else, neatly organised in one menu.",
        },
        {
            title: "Privacy & Permissions",
            desc: "Clear controls for your data and privacy.",
        },
        {
            title: "Good to Know",
            desc: "Important notes and tips before you begin.",
        },
        {
            title: "User Guide",
            desc: "A simple tutorial to get you started fast.",
        },
        {
            title: "Choose Your Theme",
            desc: "Make the app feel like yours — pick a theme.",
        },
        {
            title: "Choose Your Path",
            desc: "A guided gate screen that sets your journey.",
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