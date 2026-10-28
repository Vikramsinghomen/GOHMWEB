const { send, fail, readJson, httpError } = require('../_lib/http');
const { requireAuth } = require('../_lib/auth');
const { cleanItems } = require('../_lib/sanitize');
const {
  blobConfigured,
  readCatalog,
  writeCatalog,
  deleteUnusedImages
} = require('../_lib/store');

/**
 * POST /api/preview/save  { items: [...], demo?: boolean }
 *
 * Replaces the whole catalog. The editor always sends the full list, which
 * makes saves atomic and avoids merge conflicts between two open tabs.
 */
module.exports = async (req, res) => {
  try {
    if (req.method !== 'POST') {
      return send(res, 405, { error: 'method_not_allowed' });
    }
    if (!requireAuth(req, res)) return;

    if (!blobConfigured()) {
      return send(res, 503, {
        error: 'storage_not_configured',
        code: 'missing_blob_token',
        message:
          'No Blob store is connected to this project. Create one in Vercel → Storage → Create Database → Blob (access: Public), connect it to this project, then redeploy.'
      });
    }

    const body = await readJson(req);
    const items = cleanItems(body.items);

    if (!items.length && !Array.isArray(body.items)) {
      throw httpError(400, 'items is required');
    }

    const previous = await readCatalog();
    const next = { items: items, demo: body.demo === true };

    await writeCatalog(next);
    const removedImages = await deleteUnusedImages(previous, next);

    send(res, 200, {
      ok: true,
      count: items.length,
      removedImages: removedImages,
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    fail(res, err);
  }
};
