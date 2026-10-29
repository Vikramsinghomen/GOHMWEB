/**
 * GreatOhm — App Previews (public page)
 *
 * Loads the catalog from /api/preview/list, renders a searchable list and a
 * screenshot gallery. Everything is client-side: 100-ish entries search
 * instantly without a round trip.
 */
(function () {
    'use strict';

    var state = {
        items: [],
        allItems: [],
        query: '',
        service: 'All',
        current: null,
        imageIndex: 0,
        lastFocus: null,
        failed: false
    };

    var el = {
        skeleton: document.getElementById('pvSkeleton'),
        list: document.getElementById('pvList'),
        empty: document.getElementById('pvEmpty'),
        emptyTitle: document.getElementById('pvEmptyTitle'),
        emptyText: document.getElementById('pvEmptyText'),
        reset: document.getElementById('pvReset'),
        count: document.getElementById('pvCount'),
        search: document.getElementById('pvSearch'),
        clear: document.getElementById('pvClear'),
        filters: document.getElementById('pvFilters'),
        modal: document.getElementById('pvModal'),
        stageImg: document.getElementById('pvStageImg'),
        counter: document.getElementById('pvCounter'),
        modalTitle: document.getElementById('pvModalTitle'),
        modalService: document.getElementById('pvModalService'),
        modalDesc: document.getElementById('pvModalDesc'),
        strip: document.getElementById('pvStrip'),
        prev: document.querySelector('.pv-stage-nav[data-dir="prev"]'),
        next: document.querySelector('.pv-stage-nav[data-dir="next"]')
    };

    var CHEVRON =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">' +
        '<path d="m9 6 6 6-6 6"/></svg>';

    var PHONE_ICON =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true" width="22" height="22">' +
        '<rect x="7" y="2.5" width="10" height="19" rx="2.2"/><path d="M11 19.5h2"/></svg>';

    /* ---------------- helpers ---------------- */

    /* An entry only counts as a sample while it still shows the bundled
       placeholder artwork. Once a real screenshot has been uploaded it is a
       real entry, whatever the stored flag says. */
    function isSample(item) {
        if (!item.demo) return false;
        return !(item.images || []).some(function (img) {
            return img && img.url && img.url.indexOf('/assets/preview/') !== 0;
        });
    }

    function normalize(value) {
        return String(value || '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
    }

    function tokens(query) {
        return normalize(query).split(/\s+/).filter(Boolean);
    }

    function plural(n, word) {
        return n + ' ' + word + (n === 1 ? '' : 's');
    }

    function syncHeaderHeight() {
        var header = document.querySelector('.site-header');
        if (!header) return;
        document.documentElement.style.setProperty('--pv-header', header.offsetHeight + 'px');
    }

    function setUrl(params) {
        try {
            var url = new URL(window.location.href);
            Object.keys(params).forEach(function (key) {
                var value = params[key];
                if (value === null || value === undefined || value === '') url.searchParams.delete(key);
                else url.searchParams.set(key, value);
            });
            window.history.replaceState(null, '', url.pathname + (url.search ? url.search : '') + url.hash);
        } catch (err) {
            /* older browsers: URL state is a nice-to-have */
        }
    }

    /** Returns a fragment with <mark> around matched tokens — no innerHTML. */
    function highlight(text, list) {
        var fragment = document.createDocumentFragment();
        var value = String(text || '');
        if (!list.length) {
            fragment.appendChild(document.createTextNode(value));
            return fragment;
        }

        var haystack = normalize(value);
        var ranges = [];

        list.forEach(function (token) {
            var from = 0;
            while (from < haystack.length) {
                var at = haystack.indexOf(token, from);
                if (at === -1) break;
                ranges.push([at, at + token.length]);
                from = at + token.length;
            }
        });

        if (!ranges.length) {
            fragment.appendChild(document.createTextNode(value));
            return fragment;
        }

        ranges.sort(function (a, b) {
            return a[0] - b[0];
        });

        var merged = [];
        ranges.forEach(function (range) {
            var last = merged[merged.length - 1];
            if (last && range[0] <= last[1]) last[1] = Math.max(last[1], range[1]);
            else merged.push([range[0], range[1]]);
        });

        var cursor = 0;
        merged.forEach(function (range) {
            if (range[0] > cursor) {
                fragment.appendChild(document.createTextNode(value.slice(cursor, range[0])));
            }
            var mark = document.createElement('mark');
            mark.className = 'pv-mark';
            mark.textContent = value.slice(range[0], range[1]);
            fragment.appendChild(mark);
            cursor = range[1];
        });
        if (cursor < value.length) {
            fragment.appendChild(document.createTextNode(value.slice(cursor)));
        }
        return fragment;
    }

    /* ---------------- search ---------------- */

    function score(item, list) {
        var title = normalize(item.title);
        var service = normalize(item.service);
        var description = normalize(item.description);
        var tags = (item.tags || []).map(normalize);
        var total = 0;

        for (var i = 0; i < list.length; i += 1) {
            var token = list[i];
            var hit = 0;

            if (title === token) hit = 120;
            else if (title.indexOf(token) === 0) hit = 70;
            else if (title.indexOf(token) !== -1) hit = 50;
            else if (tags.some(function (tag) { return tag === token; })) hit = 40;
            else if (tags.some(function (tag) { return tag.indexOf(token) !== -1; })) hit = 30;
            else if (service.indexOf(token) !== -1) hit = 25;
            else if (description.indexOf(token) !== -1) hit = 12;

            if (!hit) return 0; // every token must match somewhere
            total += hit;
        }

        return total;
    }

    function applyFilters() {
        var list = tokens(state.query);
        var scoped = state.items.filter(function (item) {
            return state.service === 'All' || item.service === state.service;
        });

        if (!list.length) {
            state.allItems = scoped;
            render();
            return;
        }

        state.allItems = scoped
            .map(function (item) {
                return { item: item, rank: score(item, list) };
            })
            .filter(function (entry) {
                return entry.rank > 0;
            })
            .sort(function (a, b) {
                return b.rank - a.rank;
            })
            .map(function (entry) {
                return entry.item;
            });

        render();
    }

    /* ---------------- rendering ---------------- */

    function renderFilters() {
        var counts = {};
        state.items.forEach(function (item) {
            if (!item.service) return;
            counts[item.service] = (counts[item.service] || 0) + 1;
        });

        var services = Object.keys(counts).sort(function (a, b) {
            return a.localeCompare(b);
        });

        el.filters.textContent = '';

        if (services.length < 2) {
            el.filters.hidden = true;
            return;
        }
        el.filters.hidden = false;

        ['All'].concat(services).forEach(function (name) {
            var chip = document.createElement('button');
            chip.type = 'button';
            chip.className = 'pv-chip';
            chip.textContent = name;
            chip.setAttribute('data-service', name);
            chip.setAttribute('aria-pressed', state.service === name ? 'true' : 'false');
            chip.addEventListener('click', function () {
                state.service = name;
                updateChipStates();
                applyFilters();
            });
            el.filters.appendChild(chip);
        });
    }

    function updateChipStates() {
        var chips = el.filters.querySelectorAll('.pv-chip');
        Array.prototype.forEach.call(chips, function (chip) {
            chip.setAttribute(
                'aria-pressed',
                chip.getAttribute('data-service') === state.service ? 'true' : 'false'
            );
        });
    }

    function thumbFor(item) {
        var wrap = document.createElement('span');
        wrap.className = 'pv-thumb';

        var first = item.images && item.images[0];
        if (!first) {
            wrap.innerHTML = PHONE_ICON;
            return wrap;
        }

        var img = document.createElement('img');
        img.src = first.url;
        img.alt = '';
        img.loading = 'lazy';
        img.decoding = 'async';
        wrap.appendChild(img);
        return wrap;
    }

    function rowFor(item, list) {
        var li = document.createElement('li');

        var button = document.createElement('button');
        button.type = 'button';
        button.className = 'pv-row';
        button.setAttribute('data-id', item.id);

        var main = document.createElement('span');
        main.className = 'pv-row-main';

        var title = document.createElement('span');
        title.className = 'pv-row-title';
        title.appendChild(highlight(item.title, list));

        var desc = document.createElement('span');
        desc.className = 'pv-row-desc';
        if (item.description) desc.appendChild(highlight(item.description, list));

        var meta = document.createElement('span');
        meta.className = 'pv-row-meta';

        if (item.service) {
            var pill = document.createElement('span');
            pill.className = 'pv-pill';
            pill.textContent = item.service;
            meta.appendChild(pill);
        }

        var shots = document.createElement('span');
        shots.textContent = plural((item.images || []).length, 'screenshot');
        meta.appendChild(shots);

        if (isSample(item)) {
            var demo = document.createElement('span');
            demo.className = 'pv-pill pv-badge-demo';
            demo.textContent = 'Sample';
            meta.appendChild(demo);
        }

        main.appendChild(title);
        if (item.description) main.appendChild(desc);
        main.appendChild(meta);

        var chev = document.createElement('span');
        chev.className = 'pv-chev';
        chev.innerHTML = CHEVRON;

        button.appendChild(thumbFor(item));
        button.appendChild(main);
        button.appendChild(chev);

        button.addEventListener('click', function () {
            openItem(item, button);
        });

        li.appendChild(button);
        return li;
    }

    function render() {
        var list = tokens(state.query);
        el.list.textContent = '';

        el.skeleton.hidden = true;

        if (!state.allItems.length) {
            el.list.hidden = true;
            el.empty.hidden = false;
            el.count.textContent = '';
            return;
        }

        el.empty.hidden = true;
        el.list.hidden = false;

        var fragment = document.createDocumentFragment();
        state.allItems.forEach(function (item) {
            fragment.appendChild(rowFor(item, list));
        });
        el.list.appendChild(fragment);

        var total = state.items.length;
        var shown = state.allItems.length;
        el.count.textContent = shown === total
            ? plural(total, 'preview')
            : shown + ' of ' + plural(total, 'preview');
    }

    function showError() {
        state.failed = true;
        el.skeleton.hidden = true;
        el.list.hidden = true;
        el.empty.hidden = false;
        el.emptyTitle.textContent = "Couldn't load the previews";
        el.emptyText.textContent = 'Check your connection and try again.';
        el.reset.textContent = 'Try again';
        el.count.textContent = '';
    }

    /* ---------------- gallery ---------------- */

    function openItem(item, trigger) {
        state.current = item;
        state.imageIndex = 0;
        state.lastFocus = trigger || document.activeElement;

        el.modal.setAttribute('data-open', 'true');
        el.modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        el.modalTitle.textContent = item.title;
        el.modalService.textContent = item.service || 'GreatOhm';
        el.modalService.hidden = !item.service;
        el.modalDesc.textContent = item.description || '';
        el.modalDesc.hidden = !item.description;

        renderGallery();
        setUrl({ item: item.id });

        var close = el.modal.querySelector('.pv-close');
        if (close) close.focus();
    }

    function closeModal() {
        el.modal.setAttribute('data-open', 'false');
        el.modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        state.current = null;
        setUrl({ item: null });
        if (state.lastFocus && state.lastFocus.focus) state.lastFocus.focus();
        state.lastFocus = null;
    }

    function renderGallery() {
        var item = state.current;
        if (!item) return;

        var images = item.images || [];
        var index = Math.min(state.imageIndex, Math.max(images.length - 1, 0));
        state.imageIndex = index;

        el.strip.textContent = '';

        if (!images.length) {
            el.stageImg.removeAttribute('src');
            el.stageImg.alt = '';
            el.stageImg.style.display = 'none';
            el.counter.textContent = 'Screenshot coming soon';
            el.prev.disabled = true;
            el.next.disabled = true;
            return;
        }

        el.stageImg.style.display = '';
        el.stageImg.src = images[index].url;
        el.stageImg.alt = images[index].alt || item.title;

        el.prev.disabled = index === 0;
        el.next.disabled = index >= images.length - 1;
        el.counter.textContent = images.length > 1 ? index + 1 + ' / ' + images.length : '';

        if (images.length > 1) {
            images.forEach(function (image, i) {
                var button = document.createElement('button');
                button.type = 'button';
                button.setAttribute('aria-current', i === index ? 'true' : 'false');
                button.setAttribute('aria-label', 'Screenshot ' + (i + 1));

                var thumb = document.createElement('img');
                thumb.src = image.url;
                thumb.alt = '';
                thumb.loading = 'lazy';

                button.appendChild(thumb);
                button.addEventListener('click', function () {
                    state.imageIndex = i;
                    renderGallery();
                });
                el.strip.appendChild(button);
            });

            // The strip is rebuilt on every step, so its scroll position resets.
            // Bring the current thumbnail back into view (horizontally only).
            var active = el.strip.querySelector('[aria-current="true"]');
            if (active) {
                var stripBox = el.strip.getBoundingClientRect();
                var activeBox = active.getBoundingClientRect();
                if (stripBox.width && activeBox.width) {
                    if (activeBox.left < stripBox.left) {
                        el.strip.scrollLeft -= stripBox.left - activeBox.left;
                    } else if (activeBox.right > stripBox.right) {
                        el.strip.scrollLeft += activeBox.right - stripBox.right;
                    }
                }
            }
        }
    }

    function step(delta) {
        var item = state.current;
        if (!item) return;
        var count = (item.images || []).length;
        var next = state.imageIndex + delta;
        if (next < 0 || next >= count) return;
        state.imageIndex = next;
        renderGallery();
    }

    /* ---------------- events ---------------- */

    function bindEvents() {
        var timer = null;
        el.search.addEventListener('input', function () {
            window.clearTimeout(timer);
            timer = window.setTimeout(function () {
                state.query = el.search.value;
                state.failed = false;
                el.clear.hidden = !state.query;
                setUrl({ q: state.query || null });
                applyFilters();
            }, 110);
        });

        el.clear.addEventListener('click', function () {
            el.search.value = '';
            state.query = '';
            el.clear.hidden = true;
            setUrl({ q: null });
            applyFilters();
            el.search.focus();
        });

        el.reset.addEventListener('click', function () {
            if (state.failed) {
                window.location.reload();
                return;
            }
            el.search.value = '';
            state.query = '';
            state.service = 'All';
            el.clear.hidden = true;
            setUrl({ q: null });
            updateChipStates();
            applyFilters();
            el.search.focus();
        });

        el.modal.addEventListener('click', function (event) {
            if (event.target.closest('[data-close]')) closeModal();
        });

        el.prev.addEventListener('click', function () {
            step(-1);
        });

        el.next.addEventListener('click', function () {
            step(1);
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' && state.current) {
                closeModal();
                return;
            }
            if (!state.current) return;
            if (event.key === 'ArrowLeft') step(-1);
            if (event.key === 'ArrowRight') step(1);
            if (event.key === 'Tab') trapFocus(event);
        });

        // Swipe between screenshots on touch devices.
        var startX = null;
        var startY = null;
        var stage = document.querySelector('.pv-stage');

        stage.addEventListener('pointerdown', function (event) {
            startX = event.clientX;
            startY = event.clientY;
        });

        stage.addEventListener('pointerup', function (event) {
            if (startX === null) return;
            var dx = event.clientX - startX;
            var dy = event.clientY - startY;
            startX = null;
            startY = null;
            if (Math.abs(dx) < 45 || Math.abs(dx) < Math.abs(dy)) return;
            step(dx < 0 ? 1 : -1);
        });

        // Secret shortcut: opens the editor. Deliberately not security —
        // the editor still needs the passphrase.
        document.addEventListener('keydown', function (event) {
            var key = String(event.key || '').toLowerCase();
            if (key !== 'e') return;
            if (!event.shiftKey) return;
            if (event.ctrlKey || event.altKey) {
                event.preventDefault();
                window.location.href = 'app-preview-admin.html';
            }
        });

        window.addEventListener('resize', syncHeaderHeight);
    }

    function trapFocus(event) {
        var focusable = el.modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable.length) return;
        var first = focusable[0];
        var last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    }

    /* ---------------- boot ---------------- */

    function boot() {
        syncHeaderHeight();
        bindEvents();

        var params = new URLSearchParams(window.location.search);
        var initialQuery = params.get('q') || '';
        var initialItem = params.get('item') || '';

        if (initialQuery) {
            el.search.value = initialQuery;
            el.clear.hidden = false;
        }
        state.query = initialQuery;

        fetch('/api/preview/list', {
            cache: 'no-store',
            headers: { accept: 'application/json' }
        })
            .then(function (response) {
                if (!response.ok) throw new Error('HTTP ' + response.status);
                return response.json();
            })
            .then(function (data) {
                state.items = (data.items || []).slice().sort(function (a, b) {
                    return (a.order || 0) - (b.order || 0);
                });

                renderFilters();
                applyFilters();

                if (initialItem) {
                    var match = state.items.filter(function (item) {
                        return item.id === initialItem;
                    })[0];
                    if (match) openItem(match, null);
                }
            })
            .catch(function () {
                showError();
            });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();
