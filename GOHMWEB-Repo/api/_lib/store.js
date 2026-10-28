/**
 * Catalog storage.
 *
 * The live catalog is one small JSON document in Vercel Blob. Images live in
 * the same store under preview/shots/. If Blob is not configured yet the API
 * falls back to data/preview-catalog.json so the public page still renders.
 */

const CATALOG_PATHNAME = 'preview/catalog.json';
const IMAGE_PREFIX = 'preview/shots/';

function blobConfigured() {
  // Two supported ways a store can be connected:
  //  - BLOB_STORE_ID + VERCEL_OIDC_TOKEN  (current default when you connect a store)
  //  - BLOB_READ_WRITE_TOKEN              (legacy / explicit read-write token)
  return Boolean(process.env.BLOB_STORE_ID || process.env.BLOB_READ_WRITE_TOKEN);
}

function blobClient() {
  // Lazy require: keeps the module loadable even if node_modules is absent.
  return require('@vercel/blob');
}

function normalize(catalog) {
  const items = catalog && Array.isArray(catalog.items) ? catalog.items : [];
  return {
    version: 1,
    updatedAt: (catalog && catalog.updatedAt) || null,
    demo: Boolean(catalog && catalog.demo),
    items
  };
}

function seedCatalog() {
  try {
    return normalize(require('../../data/preview-catalog.json'));
  } catch {
    return normalize({ items: [] });
  }
}

async function readCatalog() {
  if (!blobConfigured()) return seedCatalog();

  try {
    const { list } = blobClient();
    const found = await list({ prefix: CATALOG_PATHNAME, limit: 1 });
    const hit = found.blobs.find((b) => b.pathname === CATALOG_PATHNAME);
    if (!hit) return seedCatalog();

    const res = await fetch(hit.url + '?v=' + Date.now(), { cache: 'no-store' });
    if (!res.ok) return seedCatalog();
    return normalize(await res.json());
  } catch (err) {
    console.error('[preview-store] read failed, using seed', err);
    return seedCatalog();
  }
}

async function writeCatalog(catalog) {
  const { put } = blobClient();
  const payload = JSON.stringify(
    {
      version: 1,
      updatedAt: new Date().toISOString(),
      demo: Boolean(catalog.demo),
      items: catalog.items
    },
    null,
    2
  );

  const blob = await put(CATALOG_PATHNAME, payload, {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 60
  });

  return blob;
}

/**
 * Best-effort cleanup of screenshots that are no longer referenced anywhere.
 * Deleting a blob does not fail the save — the JSON is already written.
 */
async function deleteUnusedImages(previous, next) {
  if (!blobConfigured()) return 0;

  const keep = new Set();
  const all = new Set();

  [previous, next].forEach((catalog, index) => {
    (catalog.items || []).forEach((item) => {
      (item.images || []).forEach((img) => {
        if (index === 1) keep.add(img.url);
        all.add(img.url);
      });
    });
  });

  const orphans = [...all].filter(
    (url) =>
      !keep.has(url) &&
      url.indexOf('https://') === 0 &&
      url.indexOf('.public.blob.vercel-storage.com/' + IMAGE_PREFIX) !== -1
  );

  if (!orphans.length) return 0;

  try {
    const { del } = blobClient();
    await del(orphans);
    return orphans.length;
  } catch (err) {
    console.error('[preview-store] image cleanup failed', err);
    return 0;
  }
}

module.exports = {
  CATALOG_PATHNAME,
  IMAGE_PREFIX,
  blobConfigured,
  seedCatalog,
  readCatalog,
  writeCatalog,
  deleteUnusedImages
};
