# App Previews — live screenshot library + editor

A searchable page of real app screenshots (`app-preview.html`) plus a passphrase-gated
editor (`app-preview-admin.html`) that writes to Vercel Blob. No redeploy is needed
after a save - the public page picks up changes on the very next load.

---

## 1. What was added

| File | Purpose |
| --- | --- |
| `app-preview.html` | Public page: search box, category chips, result list, screenshot gallery |
| `app-preview-admin.html` | Internal editor (noindex, not linked from the site) |
| `css/app-preview.css` | Styles for both pages |
| `js/app-preview.js` | Public page logic (search, filters, gallery, deep links) |
| `js/app-preview-admin.js` | Editor logic (auth, CRUD, image compression + upload, save) |
| `api/preview/list.js` | `GET` catalog (hidden entries only for signed-in editors) |
| `api/preview/login.js` | `POST` passphrase → signed HttpOnly cookie |
| `api/preview/logout.js` | `POST` clears the cookie |
| `api/preview/session.js` | `GET` is this browser signed in? |
| `api/preview/upload.js` | `POST` raw image bytes → Vercel Blob |
| `api/preview/save.js` | `POST` whole catalog → Vercel Blob (auth required) |
| `api/_lib/*` | Auth, storage, validation, HTTP helpers (not routes) |
| `data/preview-catalog.json` | Seed catalog used before Blob is connected |
| `assets/preview/sample-*.svg` | Placeholder screenshots for the 3 demo entries |
| `package.json`, `vercel.json` | Dependency + function file bundling config |

---

## 2. One-time setup (about 5 minutes)

The site is static, so saving needs somewhere to write. Vercel Blob is that place.
Vercel Blob is available on the Hobby plan.

### 2a. Create the Blob store

In the Vercel dashboard, **Storage → Create Database** (the search box on that page
only filters databases you already have — it will say "No Results Found" for "blob"
until one exists).

Pick **Blob** from the list, then set:

| Setting | Value | Why |
| --- | --- | --- |
| Name | anything, e.g. `greatohm-previews` | cosmetic |
| **Access** | **Public** | **cannot be changed later**; the public page loads screenshots by direct URL, and a private store would break that |
| Region | `bom1` (Mumbai) is closest to an India-first audience | latency |

### 2b. Connect it to the project

Blob store → **Projects** tab → **Connect to Project** → choose `gohmweb` → all
environments.

Connecting injects these automatically (no copying needed):

| Variable | Meaning |
| --- | --- |
| `BLOB_STORE_ID` | which store to use (identifier, not a secret) |
| `VERCEL_OIDC_TOKEN` | short-lived token Vercel rotates for you |
| `BLOB_WEBHOOK_PUBLIC_KEY` | webhook verification key |

The SDK authenticates with OIDC, so you do **not** need a long-lived
`BLOB_READ_WRITE_TOKEN`. The API accepts either: `BLOB_STORE_ID` (OIDC) or
`BLOB_READ_WRITE_TOKEN`.

### 2c. Editor passphrase

**Settings → Environment Variables**, add:

| Name | Value | Notes |
| --- | --- | --- |
| `EDIT_PASSPHRASE` | a long random phrase, 20+ characters | what you type in the editor |
| `EDIT_SESSION_SECRET` | another long random string | signs the login cookie |

Generate them locally, for example:
```powershell
node -e "console.log(require('crypto').randomBytes(24).toString('base64url'))"
```

### 2d. Redeploy

Deployments → ⋯ → Redeploy, so the functions pick up the new variables and
`package.json`.

Confirm the project's **Root Directory** is `GOHMWEB-Repo`. The `api/` folder must
sit at that root, or Vercel will not build the functions.

Until 2a–2d are done the public page still renders from
`data/preview-catalog.json`, but the editor refuses to save and says so.

---

## 3. Using the editor

- Open **`https://www.greatohm.com/app-preview-admin.html`** (bookmark it; nothing
  links to it), or press **Ctrl+Shift+E** / **Alt+Shift+E** on `app-preview.html`.
- Enter `EDIT_PASSPHRASE`. The session lasts 7 days in that browser.
- **New entry** → write the service line users will search for, pick the science,
  add tags, then drop screenshots (or paste from clipboard).
- **Bulk add screenshots** → select 50 files at once and get 50 entries, one per
  file, each titled from the file name (`kundli-matching-guna-milan.png` →
  "Kundli matching guna milan"). Every new entry copies the **science** of the
  currently selected entry, so select/create one Astrology entry first if the batch
  belongs to Astrology. Files with camera/WhatsApp names become "Subservice N" and
  need renaming. This is the fast path for the first pass; polish titles afterwards.
- **Save changes** (or Ctrl/Cmd+S) writes the whole catalog at once.

Notes:

- Screenshots are resized in the browser (max 1440px, WebP) before upload, so a
  4–8 MB phone screenshot becomes ~200–400 KB. HEIC files must be exported as JPG first.
- Up to 12 screenshots per entry, 500 entries total.
- **Move up / Move down** changes the order of the list. Inside an entry, the `←`
  `→` buttons on each screenshot change which one appears first (the first is the
  thumbnail).
- **Hide from the public page** keeps a draft entry visible only to you.
- **Remove samples** deletes the three demo entries.
- **Export JSON** downloads a backup you can commit to `data/preview-catalog.json`.

---

## 4. How the public page works

This page is deliberately independent of the homepage marquee (`index.html#screenshots`).
The marquee is curated marketing art; this page is the working library of 50+ real
subservice screens. Nothing on the homepage links to it.

- `GET /api/preview/list` returns the catalog, always `no-store` - a save must be
  visible on the next page load, so it is never cached at the edge or in the browser.
- Search runs entirely in the browser over title, category, tags and description;
  every typed word must match somewhere, best matches first.
- `?q=kundli` restores a search, `?item=<id>` opens one entry directly — useful when
  replying to a user on WhatsApp/support ("here is the screen: …").
- Hidden entries never reach an anonymous visitor.

---

## 5. Security model (read this)

The keyboard shortcut is **not** security — anyone can read the JavaScript and find
the editor URL. Protection comes from:

- `EDIT_PASSPHRASE` checked server-side, compared with a timing-safe hash.
- A signed, `HttpOnly`, `Secure`, `SameSite=Strict` cookie (7 days) required by
  `save` and `upload`.
- Login throttling (8 attempts / 10 min per IP).
- Payload validation in `api/_lib/sanitize.js`: length caps, image URLs restricted to
  the Blob host or `/assets/`, tags lowercased, ids sanitised.

If you ever suspect the passphrase leaked, change `EDIT_PASSPHRASE` **and**
`EDIT_SESSION_SECRET` in Vercel and redeploy — that invalidates every existing session.

---

## 6. Storage layout

```
<blob store>/preview/catalog.json          the catalog (public, rewritten on save)
<blob store>/preview/shots/<id>-<name>.webp uploaded screenshots (immutable cache)
```

Removing a screenshot from an entry deletes the blob on the next save, as long as no
other entry still references that URL.

---

## 7. Troubleshooting

| Symptom | Cause / fix |
| --- | --- |
| Editor says "Storage not connected" | No store connected — Storage → Create Database → Blob (Public) → Connect to Project, then redeploy |
| Blob is not in the Storage list | The search box only finds existing databases; use **Create Database** |
| Login says `EDIT_PASSPHRASE is not set` | Add the env var, redeploy |
| Save returns 401 | Session expired — sign in again |
| Upload fails with "not supported" | HEIC or an exotic format; export as JPG/PNG/WebP |
| Page shows old content | Hard-reload once (Ctrl+Shift+R). The API is `no-store`, so a normal reload is enough from then on |
| `api/preview/*` 404s | Root Directory is not `GOHMWEB-Repo`, or the folder was not committed |
