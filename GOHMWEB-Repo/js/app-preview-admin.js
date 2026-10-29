/**
 * GreatOhm — Preview editor
 *
 * Passphrase-gated UI for maintaining the catalog shown on app-preview.html.
 * The whole list is held in memory and saved in one POST, so a save is atomic.
 */
(function () {
    'use strict';

    var MAX_SHOTS = 50;
    var MAX_FILE_MB = 25;
    var MAX_EDGE = 1440;

    var state = {
        items: [],
        selectedId: null,
        dirty: false,
        syncing: false,
        authed: false,
        storage: 'seed',
        uploading: 0,
        filter: '',
        session: null
    };

    var el = {};

    function $(id) {
        return document.getElementById(id);
    }

    /* ---------------- api ---------------- */

    function getJSON(url) {
        return fetch(url, { headers: { accept: 'application/json' }, cache: 'no-store' }).then(function (res) {
            if (!res.ok) {
                var err = new Error('HTTP ' + res.status);
                err.status = res.status;
                throw err;
            }
            return res.json();
        });
    }

    function postJSON(url, body) {
        return fetch(url, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(body)
        }).then(function (res) {
            return res.json().catch(function () {
                return {};
            }).then(function (data) {
                if (!res.ok) {
                    var err = new Error(data.message || data.error || 'Request failed');
                    err.status = res.status;
                    err.data = data;
                    throw err;
                }
                return data;
            });
        });
    }

    /* ---------------- utils ---------------- */

    function genId() {
        return 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    }

    function normalizeItem(raw) {
        return {
            id: raw.id || genId(),
            title: raw.title || '',
            service: raw.service || '',
            description: raw.description || '',
            tags: Array.isArray(raw.tags) ? raw.tags.slice() : [],
            images: Array.isArray(raw.images) ? raw.images.slice() : [],
            hidden: raw.hidden === true,
            demo: raw.demo === true
        };
    }

    var toastTimer = null;

    /* A sample stops being a sample the moment it holds a real screenshot, so
       "Remove samples" can never delete work that is already done. Sample
       images are the local /assets/preview/*.svg seeds; everything uploaded
       through the editor lives on Vercel Blob. */
    function isSample(item) {
        if (!item.demo) return false;
        return !(item.images || []).some(function (img) {
            return img && img.url && img.url.indexOf('/assets/preview/') !== 0;
        });
    }

    function toast(message, tone) {
        el.toast.textContent = message;
        el.toast.setAttribute('data-tone', tone || '');
        el.toast.setAttribute('data-show', 'true');
        window.clearTimeout(toastTimer);
        toastTimer = window.setTimeout(function () {
            el.toast.setAttribute('data-show', 'false');
        }, tone === 'error' ? 5000 : 3000);
    }

    function selected() {
        for (var i = 0; i < state.items.length; i += 1) {
            if (state.items[i].id === state.selectedId) return state.items[i];
        }
        return null;
    }

    function markDirty() {
        state.dirty = true;
        updateStatus();
    }

    function updateStatus() {
        var total = state.items.length;
        var live = state.items.filter(function (item) {
            return !item.hidden;
        }).length;

        if (state.storage === 'seed') {
            el.status.textContent = 'Storage not connected — saving is disabled';
            el.status.setAttribute('data-tone', 'warn');
            return;
        }

        el.status.removeAttribute('data-tone');
        el.status.textContent =
            total + (total === 1 ? ' entry' : ' entries') +
            ' · ' + live + ' live' +
            (state.dirty ? ' · unsaved changes' : '');
    }

    function handleApiError(err) {
        if (err && err.status === 401) {
            state.authed = false;
            showGate({ authed: false, passphraseConfigured: true });
            el.gateError.hidden = false;
            el.gateError.textContent = 'Session expired. Enter the passphrase again.';
            return;
        }
        if (err && err.status === 503 && err.data && err.data.code) {
            toast(err.data.message || 'Storage is not configured yet.', 'error');
            return;
        }
        toast((err && err.message) || 'Something went wrong', 'error');
    }

    /* ---------------- gate ---------------- */

    function showGate(session) {
        el.gate.hidden = false;
        el.shell.hidden = true;

        if (session && session.passphraseConfigured === false) {
            el.gateError.hidden = false;
            el.gateError.textContent =
                'EDIT_PASSPHRASE is not set on this deployment. Add it in Vercel → Settings → Environment Variables, then redeploy.';
        }
    }

    function enterEditor() {
        el.gate.hidden = true;
        el.shell.hidden = false;
        state.authed = true;

        renderServiceList();
        renderSide();
        updateStatus();

        if (state.items.length) selectItem(state.items[0].id);
        else renderForm();

        el.dropSamples.hidden = !state.items.some(function (item) {
            return item.demo;
        });
    }

    function login(event) {
        event.preventDefault();
        var passphrase = el.pass.value;

        if (!passphrase) {
            el.gateError.hidden = false;
            el.gateError.textContent = 'Enter the passphrase.';
            return;
        }

        el.loginBtn.disabled = true;
        el.loginBtn.textContent = 'Checking…';

        postJSON('/api/preview/login', { passphrase: passphrase })
            .then(function () {
                return getJSON('/api/preview/list?fresh=1');
            })
            .then(function (catalog) {
                state.items = (catalog.items || []).map(normalizeItem);
                el.pass.value = '';
                enterEditor();
                toast('Unlocked', 'ok');
            })
            .catch(function (err) {
                el.gateError.hidden = false;
                el.gateError.textContent =
                    (err && err.data && err.data.message) ||
                    (err && err.status === 401 ? 'Wrong passphrase.' : 'Could not unlock. Try again.');
            })
            .then(function () {
                el.loginBtn.disabled = false;
                el.loginBtn.textContent = 'Unlock';
            });
    }

    /* ---------------- side list ---------------- */

    function renderSide() {
        var filter = state.filter.trim().toLowerCase();
        el.sideList.textContent = '';

        var visible = state.items.filter(function (item) {
            if (!filter) return true;
            var haystack = (item.title + ' ' + item.service + ' ' + (item.tags || []).join(' ')).toLowerCase();
            return haystack.indexOf(filter) !== -1;
        });

        if (!visible.length) {
            var empty = document.createElement('li');
            empty.className = 'ap-empty';
            empty.textContent = state.items.length ? 'No entry matches that filter.' : 'No entries yet.';
            el.sideList.appendChild(empty);
            return;
        }

        visible.forEach(function (item, index) {
            var li = document.createElement('li');
            var button = document.createElement('button');
            button.type = 'button';
            button.className = 'ap-side-item';
            button.setAttribute('aria-current', item.id === state.selectedId ? 'true' : 'false');

            var title = document.createElement('strong');
            title.textContent = item.title || '(untitled entry)';

            var meta = document.createElement('span');
            var bits = [];
            if (item.service) bits.push(item.service);
            bits.push((item.images || []).length + ' shot' + ((item.images || []).length === 1 ? '' : 's'));
            if (item.hidden) bits.push('hidden');
            meta.textContent = bits.join(' · ');

            button.appendChild(title);
            button.appendChild(meta);
            button.addEventListener('click', function () {
                selectItem(item.id);
            });

            li.appendChild(button);
            el.sideList.appendChild(li);
        });
    }

    function renderServiceList() {
        var seen = {};
        var services = [];
        state.items.forEach(function (item) {
            if (!item.service || seen[item.service]) return;
            seen[item.service] = true;
            services.push(item.service);
        });

        el.serviceList.textContent = '';
        services.sort().forEach(function (service) {
            var option = document.createElement('option');
            option.value = service;
            el.serviceList.appendChild(option);
        });
    }

    /* ---------------- form ---------------- */

    function selectItem(id) {
        state.selectedId = id;
        renderSide();
        renderForm();
    }

    function renderForm() {
        var item = selected();

        if (!item) {
            el.form.hidden = true;
            el.emptyForm.hidden = false;
            return;
        }

        el.form.hidden = false;
        el.emptyForm.hidden = true;

        state.syncing = true;
        el.formHeading.textContent = item.demo ? 'Edit sample entry' : 'Edit entry';
        el.title.value = item.title;
        el.service.value = item.service;
        el.tags.value = (item.tags || []).join(', ');
        el.desc.value = item.description;
        el.hidden.checked = item.hidden === true;
        state.syncing = false;

        renderShots();
        updateMoveButtons();
    }

    var sideTimer = null;

    function renderSideSoon() {
        window.clearTimeout(sideTimer);
        sideTimer = window.setTimeout(renderSide, 220);
    }

    function syncFromForm() {
        var item = selected();
        if (!item || state.syncing) return;

        item.title = el.title.value;
        item.service = el.service.value.trim();
        item.description = el.desc.value;
        item.hidden = el.hidden.checked;
        item.tags = el.tags.value
            .split(',')
            .map(function (tag) {
                return tag.trim().toLowerCase();
            })
            .filter(Boolean)
            .slice(0, 12);

        markDirty();
        renderSideSoon();
        updateMoveButtons();
    }

    function updateMoveButtons() {
        var index = -1;
        for (var i = 0; i < state.items.length; i += 1) {
            if (state.items[i].id === state.selectedId) index = i;
        }
        el.moveUp.disabled = index <= 0;
        el.moveDown.disabled = index === -1 || index >= state.items.length - 1;
    }

    /* ---------------- images ---------------- */

    function renderShots() {
        var item = selected();
        el.shots.textContent = '';
        if (!item) return;

        (item.images || []).forEach(function (image, index) {
            var tile = document.createElement('div');
            tile.className = 'ap-shot';

            var img = document.createElement('img');
            img.src = image.url;
            img.alt = image.alt || '';
            img.loading = 'lazy';
            tile.appendChild(img);

            var tools = document.createElement('div');
            tools.className = 'ap-shot-tools';

            [
                { act: 'left', label: '\u2190', title: 'Move earlier' },
                { act: 'right', label: '\u2192', title: 'Move later' },
                { act: 'remove', label: '\u2715', title: 'Remove' }
            ].forEach(function (spec) {
                var button = document.createElement('button');
                button.type = 'button';
                button.textContent = spec.label;
                button.title = spec.title;
                button.setAttribute('data-act', spec.act);
                button.disabled = (spec.act === 'left' && index === 0) ||
                    (spec.act === 'right' && index === (item.images || []).length - 1);
                button.addEventListener('click', function () {
                    if (spec.act === 'remove') removeImage(index);
                    else moveImage(index, spec.act === 'left' ? -1 : 1);
                });
                tools.appendChild(button);
            });

            tile.appendChild(tools);
            el.shots.appendChild(tile);
        });

        for (var i = 0; i < state.uploading; i += 1) {
            var pending = document.createElement('div');
            pending.className = 'ap-shot';
            var label = document.createElement('div');
            label.className = 'ap-shot-progress';
            label.textContent = 'Uploading…';
            pending.appendChild(label);
            el.shots.appendChild(pending);
        }

        el.uploadNote.hidden = true;
    }

    function moveImage(index, delta) {
        var item = selected();
        if (!item) return;
        var target = index + delta;
        if (target < 0 || target >= item.images.length) return;
        var moved = item.images.splice(index, 1)[0];
        item.images.splice(target, 0, moved);
        markDirty();
        renderShots();
    }

    function removeImage(index) {
        var item = selected();
        if (!item) return;
        item.images.splice(index, 1);
        markDirty();
        renderSide();
        renderShots();
    }

    function toBlob(canvas, type, quality) {
        return new Promise(function (resolve) {
            if (!canvas.toBlob) {
                resolve(null);
                return;
            }
            canvas.toBlob(resolve, type, quality);
        });
    }

    function prepareImage(file) {
        if (file.size > MAX_FILE_MB * 1024 * 1024) {
            return Promise.reject(new Error('Image is larger than ' + MAX_FILE_MB + ' MB'));
        }

        return createImageBitmap(file)
            .catch(function () {
                throw new Error('This file could not be read. Use a JPG, PNG or WebP image.');
            })
            .then(function (bitmap) {
                var scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
                var width = Math.max(1, Math.round(bitmap.width * scale));
                var height = Math.max(1, Math.round(bitmap.height * scale));

                var canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;

                var ctx = canvas.getContext('2d');
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                ctx.drawImage(bitmap, 0, 0, width, height);
                if (bitmap.close) bitmap.close();

                return toBlob(canvas, 'image/webp', 0.82).then(function (blob) {
                    if (!blob) return toBlob(canvas, 'image/jpeg', 0.85);
                    return blob;
                }).then(function (blob) {
                    if (!blob) throw new Error('Could not process this image');

                    if (blob.size > 1400 * 1024) {
                        return toBlob(canvas, blob.type, 0.68).then(function (smaller) {
                            return smaller && smaller.size < blob.size ? smaller : blob;
                        });
                    }
                    return blob;
                }).then(function (blob) {
                    if (blob.size > 3.6 * 1024 * 1024) {
                        throw new Error('Image is still too large after resizing');
                    }
                    return { blob: blob, width: width, height: height };
                });
            });
    }

    function isImageFile(file) {
        return /^image\//.test(file.type) || /\.(jpe?g|png|webp|heic|heif)$/i.test(file.name);
    }

    function uploadImage(prepared, name) {
        var url =
            '/api/preview/upload?w=' + prepared.width +
            '&h=' + prepared.height +
            '&name=' + encodeURIComponent(name || 'screenshot');

        return fetch(url, {
            method: 'POST',
            headers: { 'content-type': prepared.blob.type },
            body: prepared.blob
        }).then(function (res) {
            return res.json().catch(function () {
                return {};
            }).then(function (data) {
                if (!res.ok) {
                    var err = new Error(data.message || 'Upload failed');
                    err.status = res.status;
                    throw err;
                }
                return data;
            });
        });
    }

    function addFiles(fileList) {
        var item = selected();
        if (!item) {
            toast('Select or create an entry first', 'error');
            return;
        }
        if (state.storage === 'seed') {
            toast('Connect Vercel Blob before uploading screenshots', 'error');
            return;
        }

        var files = Array.prototype.slice.call(fileList || []).filter(isImageFile);

        if (!files.length) return;

        var room = MAX_SHOTS - (item.images || []).length;
        if (room <= 0) {
            toast('Maximum ' + MAX_SHOTS + ' screenshots per entry', 'error');
            return;
        }
        if (files.length > room) {
            toast('Only the first ' + room + ' images were added (limit ' + MAX_SHOTS + ')', 'error');
            files = files.slice(0, room);
        }

        files.reduce(function (chain, file) {
            return chain.then(function () {
                state.uploading += 1;
                renderShots();

                return prepareImage(file)
                    .then(function (prepared) {
                        return uploadImage(prepared, item.title).then(function (data) {
                            item.images.push({
                                url: data.url,
                                alt: '',
                                width: data.width || prepared.width,
                                height: data.height || prepared.height
                            });
                            // it has a real screenshot now, so it is no longer
                            // a placeholder entry
                            item.demo = false;
                            markDirty();
                            renderSide();
                        });
                    })
                    .catch(function (err) {
                        if (err && err.status === 401) {
                            handleApiError(err);
                        } else {
                            toast((err && err.message) || 'Upload failed', 'error');
                        }
                    })
                    .then(function () {
                        state.uploading -= 1;
                        renderShots();
                    });
            });
        }, Promise.resolve());
    }

    /* ---------------- bulk import ---------------- */

    function titleFromFile(name, fallbackIndex) {
        var base = String(name || '').replace(/\.[a-z0-9]+$/i, '');
        base = base.replace(/[_\-.]+/g, ' ').replace(/\s+/g, ' ').trim();
        base = base.replace(/\b(screenshot|screenshots|screen|shot|img|image|photo|whatsapp|scrnshot)\b/gi, ' ');
        base = base.replace(/\s+/g, ' ').trim();

        var letters = (base.match(/[a-z]/gi) || []).length;
        if (!letters || letters < base.length * 0.3) {
            base = 'Subservice ' + fallbackIndex;
        }

        return (base.charAt(0).toUpperCase() + base.slice(1)).slice(0, 140);
    }

    /**
     * One entry per file, titled from the file name. Built for the first pass
     * when 50+ subservices need screenshots before the titles are polished.
     */
    function bulkAdd(fileList) {
        if (state.storage === 'seed') {
            toast('Connect Vercel Blob before uploading screenshots', 'error');
            return;
        }

        var files = Array.prototype.slice.call(fileList || []).filter(isImageFile);
        if (!files.length) return;

        var room = 500 - state.items.length;
        if (room <= 0) {
            toast('The catalog is full (500 entries)', 'error');
            return;
        }
        if (files.length > room) {
            toast('Only the first ' + room + ' files were added', 'error');
            files = files.slice(0, room);
        }

        var template = selected();
        var service = template ? template.service : '';
        var total = files.length;
        var done = 0;
        var created = [];
        var failed = [];

        el.bulk.disabled = true;
        el.save.disabled = true;
        el.status.removeAttribute('data-tone');

        files.reduce(function (chain, file) {
            return chain.then(function () {
                done += 1;
                el.status.textContent = 'Adding ' + done + ' of ' + total + '…';

                var item = normalizeItem({
                    id: genId(),
                    title: titleFromFile(file.name, state.items.length + 1),
                    service: service
                });
                state.items.push(item);

                return prepareImage(file)
                    .then(function (prepared) {
                        return uploadImage(prepared, item.title).then(function (data) {
                            item.images.push({
                                url: data.url,
                                alt: '',
                                width: data.width || prepared.width,
                                height: data.height || prepared.height
                            });
                            created.push(item);
                        });
                    })
                    .catch(function (err) {
                        var index = state.items.indexOf(item);
                        if (index !== -1) state.items.splice(index, 1);
                        failed.push(file.name);
                        if (err && err.status === 401) handleApiError(err);
                    });
            });
        }, Promise.resolve()).then(function () {
            el.bulk.disabled = false;
            el.save.disabled = false;
            markDirty();
            renderSide();
            renderServiceList();
            updateStatus();

            if (created.length) selectItem(created[0].id);

            if (created.length) {
                toast(
                    'Added ' + created.length + ' entries' +
                    (failed.length ? ' · ' + failed.length + ' failed' : '') +
                    '. Edit the titles, then Save.',
                    'ok'
                );
            } else {
                toast('Nothing was added' + (failed.length ? ' — ' + failed.length + ' uploads failed' : ''), 'error');
            }
        });
    }

    /* ---------------- item actions ---------------- */

    function newItem() {
        var item = normalizeItem({ id: genId(), title: '' });
        state.items.push(item);
        markDirty();
        renderSide();
        selectItem(item.id);
        el.title.focus();
    }

    function duplicateItem() {
        var item = selected();
        if (!item) return;

        var copy = normalizeItem(JSON.parse(JSON.stringify(item)));
        copy.id = genId();
        copy.title = (item.title || 'Untitled') + ' (copy)';
        copy.demo = false;

        var index = state.items.indexOf(item);
        state.items.splice(index + 1, 0, copy);
        markDirty();
        renderSide();
        selectItem(copy.id);
    }

    function deleteItem() {
        var item = selected();
        if (!item) return;

        var label = item.title || 'this entry';
        if (!window.confirm('Delete "' + label + '"?\n\nThe screenshots will be removed from storage when you save.')) {
            return;
        }

        var index = state.items.indexOf(item);
        state.items.splice(index, 1);
        state.selectedId = null;
        markDirty();
        renderSide();

        var next = state.items[Math.min(index, state.items.length - 1)];
        if (next) selectItem(next.id);
        else renderForm();
    }

    function moveItem(delta) {
        var item = selected();
        if (!item) return;
        var index = state.items.indexOf(item);
        var target = index + delta;
        if (target < 0 || target >= state.items.length) return;

        state.items.splice(index, 1);
        state.items.splice(target, 0, item);
        markDirty();
        renderSide();
        updateMoveButtons();
    }

    function removeSamples() {
        var count = state.items.filter(isSample).length;
        if (!count) return;
        if (!window.confirm('Remove ' + count + ' sample entr' + (count === 1 ? 'y' : 'ies') + '?')) return;

        state.items = state.items.filter(function (item) {
            return !isSample(item);
        });
        if (!selected()) state.selectedId = state.items.length ? state.items[0].id : null;
        markDirty();
        renderSide();
        renderForm();
        el.dropSamples.hidden = true;
        toast('Samples removed — remember to save', 'ok');
    }

    /* ---------------- save / export / session ---------------- */

    function save() {
        if (state.uploading) {
            toast('Wait for the uploads to finish', 'error');
            return;
        }

        var untitled = state.items.filter(function (item) {
            return !String(item.title || '').trim();
        })[0];

        if (untitled) {
            selectItem(untitled.id);
            toast('Every entry needs a service line', 'error');
            el.title.focus();
            return;
        }

        if (state.storage === 'seed') {
            toast('Saving needs Vercel Blob — see docs/preview-editor.md', 'error');
            return;
        }

        state.items.forEach(function (item) {
            (item.images || []).forEach(function (image) {
                if (!image.alt) image.alt = item.title;
            });
        });

        el.save.disabled = true;
        el.save.textContent = 'Saving…';

        postJSON('/api/preview/save', {
            items: state.items,
            demo: state.items.some(function (item) {
                return item.demo;
            })
        })
            .then(function (data) {
                state.dirty = false;
                updateStatus();
                toast('Saved — live on the site (' + data.count + ' entries)', 'ok');
            })
            .catch(handleApiError)
            .then(function () {
                el.save.disabled = false;
                el.save.textContent = 'Save changes';
            });
    }

    function exportJson() {
        var payload = {
            version: 1,
            updatedAt: new Date().toISOString(),
            demo: state.items.some(function (item) {
                return item.demo;
            }),
            items: state.items
        };

        var blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
        var url = URL.createObjectURL(blob);
        var link = document.createElement('a');
        link.href = url;
        link.download = 'preview-catalog-' + new Date().toISOString().slice(0, 10) + '.json';
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.setTimeout(function () {
            URL.revokeObjectURL(url);
        }, 2000);
    }

    function logout() {
        postJSON('/api/preview/logout', {}).then(function () {
            window.location.reload();
        }).catch(function () {
            window.location.reload();
        });
    }

    /* ---------------- events ---------------- */

    function bind() {
        el.loginForm.addEventListener('submit', login);

        el.new.addEventListener('click', newItem);
        el.bulk.addEventListener('click', function () {
            el.bulkFiles.click();
        });
        el.bulkFiles.addEventListener('change', function () {
            bulkAdd(el.bulkFiles.files);
            el.bulkFiles.value = '';
        });
        el.duplicate.addEventListener('click', duplicateItem);
        el.del.addEventListener('click', deleteItem);
        el.moveUp.addEventListener('click', function () {
            moveItem(-1);
        });
        el.moveDown.addEventListener('click', function () {
            moveItem(1);
        });
        el.save.addEventListener('click', function (event) {
            event.preventDefault();
            save();
        });
        el.form.addEventListener('submit', function (event) {
            event.preventDefault();
            save();
        });
        el.export.addEventListener('click', exportJson);
        el.logout.addEventListener('click', logout);
        el.dropSamples.addEventListener('click', removeSamples);

        ['input', 'change'].forEach(function (type) {
            el.form.addEventListener(type, syncFromForm);
        });

        el.search.addEventListener('input', function () {
            state.filter = el.search.value;
            renderSide();
        });

        el.files.addEventListener('change', function () {
            addFiles(el.files.files);
            el.files.value = '';
        });

        el.drop.addEventListener('click', function (event) {
            if (event.target === el.files) return;
        });

        ['dragenter', 'dragover'].forEach(function (type) {
            el.drop.addEventListener(type, function (event) {
                event.preventDefault();
                el.drop.setAttribute('data-over', 'true');
            });
        });

        ['dragleave', 'drop'].forEach(function (type) {
            el.drop.addEventListener(type, function (event) {
                event.preventDefault();
                el.drop.removeAttribute('data-over');
            });
        });

        el.drop.addEventListener('drop', function (event) {
            if (event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length) {
                addFiles(event.dataTransfer.files);
            }
        });

        document.addEventListener('paste', function (event) {
            if (el.shell.hidden || !state.selectedId) return;
            var items = event.clipboardData && event.clipboardData.items;
            if (!items) return;

            var files = [];
            for (var i = 0; i < items.length; i += 1) {
                if (items[i].kind === 'file') {
                    var file = items[i].getAsFile();
                    if (file) files.push(file);
                }
            }
            if (files.length) {
                event.preventDefault();
                addFiles(files);
            }
        });

        document.addEventListener('keydown', function (event) {
            if ((event.ctrlKey || event.metaKey) && String(event.key).toLowerCase() === 's') {
                if (el.shell.hidden) return;
                event.preventDefault();
                save();
            }
        });

        window.addEventListener('beforeunload', function (event) {
            if (!state.dirty) return;
            event.preventDefault();
            event.returnValue = '';
        });

        window.addEventListener('dragover', function (event) {
            event.preventDefault();
        });
        window.addEventListener('drop', function (event) {
            event.preventDefault();
        });
    }

    /* ---------------- boot ---------------- */

    function boot() {
        el = {
            gate: $('apGate'),
            gateError: $('apGateError'),
            loginForm: $('apLoginForm'),
            loginBtn: $('apLoginBtn'),
            pass: $('apPass'),
            shell: $('apShell'),
            status: $('apStatus'),
            search: $('apSearch'),
            sideList: $('apSideList'),
            new: $('apNew'),
            bulk: $('apBulk'),
            bulkFiles: $('apBulkFiles'),
            form: $('apForm'),
            formHeading: $('apFormHeading'),
            emptyForm: $('apEmptyForm'),
            title: $('apTitle'),
            service: $('apService'),
            serviceList: $('apServiceList'),
            tags: $('apTags'),
            desc: $('apDesc'),
            hidden: $('apHidden'),
            drop: $('apDrop'),
            files: $('apFiles'),
            shots: $('apShots'),
            uploadNote: $('apUploadNote'),
            save: $('apSave'),
            duplicate: $('apDuplicate'),
            del: $('apDelete'),
            moveUp: $('apMoveUp'),
            moveDown: $('apMoveDown'),
            dropSamples: $('apDropSamples'),
            export: $('apExport'),
            logout: $('apLogout'),
            toast: $('apToast')
        };

        bind();

        Promise.all([
            getJSON('/api/preview/session'),
            getJSON('/api/preview/list?fresh=1')
        ])
            .then(function (results) {
                var session = results[0];
                var catalog = results[1];

                state.session = session;
                state.storage = session.storage || 'seed';
                state.items = (catalog.items || []).map(normalizeItem);

                if (session.authed) {
                    enterEditor();
                } else {
                    showGate(session);
                    el.pass.focus();
                }
            })
            .catch(function (err) {
                showGate(null);
                el.gateError.hidden = false;
                el.gateError.textContent = 'Could not reach the server (' + err.message + ').';
            });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();
