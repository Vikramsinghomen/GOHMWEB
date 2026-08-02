/* ============================================================
   GREATOHM — Main JavaScript
   - 3D rotating phone carousel (13 screenshots)
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

    /* Configuration */
    const PHONE_COUNT = SCREEN_DATA.length;
    const DEG_PER_PHONE = 360 / PHONE_COUNT;
    const ROTATE_DEG_PER_MS = 360 / 15000; // full revolution every ~15s
    const ANIM_MS = 700;         // click-to-front animation duration

    /* Responsive carousel dimensions */
    function getCarouselConfig() {
        const w = window.innerWidth;
        if (w < 481) return { radius: 300, radiusX: 0.7, scaleBoost: 0.18 };
        if (w < 769) return { radius: 380, radiusX: 0.7, scaleBoost: 0.18 };
        if (w < 1025) return { radius: 480, radiusX: 0.7, scaleBoost: 0.18 };
        return { radius: 580, radiusX: 0.7, scaleBoost: 0.18 };
    }

    let CONFIG = getCarouselConfig();

    /* DOM refs */
    const carouselEl = document.getElementById("carousel");
    const captionTitle = document.getElementById("captionTitle");
    const captionDesc = document.getElementById("captionDesc");
    const captionBox = document.getElementById("captionBox");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const stageEl = document.getElementById("carouselStage");

    /* Animation state */
    let carouselAngle = 0;        // continuous angle in degrees
    let activeIndex = 0;
    let autoRotate = true;
    let lastTime = null;
    let rafId = null;
    let tween = null;             // { from, to, start, duration }

    /* ============================================================
       2. BUILD PHONES
    ============================================================ */
    function buildPhones() {
        if (!carouselEl) return;
        const fragment = document.createDocumentFragment();

        for (let i = 0; i < PHONE_COUNT; i++) {
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

            /* Click / tap to bring to front */
            phone.addEventListener("click", function () {
                bringToFront(i);
            });

            phone.addEventListener("keydown", function (e) {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    bringToFront(i);
                }
            });

            fragment.appendChild(phone);
        }

        carouselEl.appendChild(fragment);
    }

    /* ============================================================
       3. POSITION PHONES IN 3D
       Each phone: angle = i*DEG + carouselAngle
       - x = sin(angle) * RADIUS * RADIUS_X
       - z = cos(angle) * RADIUS
       - rotateY(angle) so the phone face points outward
       - front phones are naturally larger due to 3D perspective
    ============================================================ */
    function applyPositions() {
        if (!carouselEl) return;
        const phones = carouselEl.children;

        for (let i = 0; i < phones.length; i++) {
            const angleDeg = i * DEG_PER_PHONE + carouselAngle;
            const angleRad = angleDeg * (Math.PI / 180);
            const z = Math.round(Math.cos(angleRad) * CONFIG.radius);
            const x = Math.round(Math.sin(angleRad) * CONFIG.radius * CONFIG.radiusX);
            const y = -Math.round(Math.abs(Math.cos(angleRad)) * 30);

            /* Gentle ease-out scaling for the front phone */
            const frontness = Math.max(0, Math.cos(angleRad)); // 1 at front, 0 at sides
            const scale = 1 + frontness * CONFIG.scaleBoost;

            phones[i].style.transform =
                "translate3d(" + x + "px, " + y + "px, " + z + "px) " +
                "rotateY(" + angleDeg + "deg) scale(" + scale.toFixed(3) + ")";
        }
    }

    /* ============================================================
       4. ACTIVE PHONE + CAPTION
    ============================================================ */
    function getFrontIndex() {
        /* Phone i is at front when i*DEG + carouselAngle ≡ 0 (mod 360) */
        const normalized = ((-carouselAngle % 360) + 360) % 360;
        return Math.round(normalized / DEG_PER_PHONE) % PHONE_COUNT;
    }

    function setActive(index) {
        activeIndex = (index + PHONE_COUNT) % PHONE_COUNT;

        if (!carouselEl) return;
        const phones = carouselEl.children;
        for (let i = 0; i < phones.length; i++) {
            phones[i].classList.toggle("active", i === activeIndex);
        }

        updateCaption(activeIndex);
    }

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
       5. ROTATION LOOP (requestAnimationFrame — buttery smooth)
    ============================================================ */
    function tick(now) {
        if (lastTime === null) lastTime = now;
        const dt = now - lastTime;
        lastTime = now;

        if (tween) {
            /* Animated rotation (click-to-front / arrows) */
            const progress = Math.min(1, (now - tween.start) / tween.duration);
            const eased = easeInOutCubic(progress);
            carouselAngle = tween.from + (tween.to - tween.from) * eased;

            applyPositions();

            if (progress >= 1) {
                carouselAngle = tween.to;
                tween = null;
                applyPositions();
                setActive(getFrontIndex());
            }
        } else if (autoRotate) {
            carouselAngle += ROTATE_DEG_PER_MS * dt;
            applyPositions();

            /* Only update caption when the front phone actually changes */
            const front = getFrontIndex();
            if (front !== activeIndex) {
                setActive(front);
            }
        }

        rafId = requestAnimationFrame(tick);
    }

    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function bringToFront(index) {
        if (tween) return; // ignore clicks during animation

        /* Target angle so phone `index` is at the front (angle ≡ 0 mod 360) */
        const target = -index * DEG_PER_PHONE;

        /* Find shortest-path equivalent to current angle */
        const diff = ((target - carouselAngle) % 360 + 360) % 360;
        const shortest = diff > 180 ? diff - 360 : diff;

        tween = {
            from: carouselAngle,
            to: carouselAngle + shortest,
            start: performance.now(),
            duration: ANIM_MS,
        };
    }

    /* ============================================================
       6. PAUSE ON HOVER / TOUCH
    ============================================================ */
    if (stageEl) {
        stageEl.addEventListener("mouseenter", function () {
            autoRotate = false;
        });
        stageEl.addEventListener("mouseleave", function () {
            autoRotate = true;
        });
        stageEl.addEventListener("touchstart", function () {
            autoRotate = false;
        });
        stageEl.addEventListener("touchend", function () {
            setTimeout(function () {
                autoRotate = true;
            }, 900);
        });
    }

    /* Prev / Next arrows */
    if (prevBtn) {
        prevBtn.addEventListener("click", function () {
            bringToFront(activeIndex - 1);
        });
    }
    if (nextBtn) {
        nextBtn.addEventListener("click", function () {
            bringToFront(activeIndex + 1);
        });
    }

    /* ============================================================
       7. LOGO ANIMATION
       Both logos visible side by side with subtle pulse animation
    ============================================================ */
    function initLogoSwap() {
        // No alternating needed — CSS handles the pulse animation on .logo-duo
        // Nav logos are always visible via CSS flex layout
    }

    /* ============================================================
       8. FLOATING STARS
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
       9. HEADER SCROLL EFFECT
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
       10. MOBILE NAV TOGGLE
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
       11. FORMS (frontend only demo)
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
       12. INIT
    ============================================================ */
    document.addEventListener("DOMContentLoaded", function () {
        buildPhones();
        applyPositions();
        setActive(0);
        if (carouselEl) {
            rafId = requestAnimationFrame(tick);
        }
        initLogoSwap();
        initStars();
        initHeader();
        initNav();
        initForms();
    });
})();