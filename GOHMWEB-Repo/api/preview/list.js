const { send, fail } = require('../_lib/http');
const { readCatalog, blobConfigured } = require('../_lib/store');
const { isAuthed } = require('../_lib/auth');

/**
 * GET /api/preview/list
 *
 * Public. Returns the catalog in display order. Hidden items are only included
 * for a signed-in editor. `?fresh=1` bypasses the edge cache (used by the admin).
 */
module.exports = async (req, res) => {
  try {
    if (req.method !== 'GET') {
      return send(res, 405, { error: 'method_not_allowed' });
    }

    const url = new URL(req.url, 'https://local.invalid');
    const fresh = url.searchParams.get('fresh') === '1';
    const authed = isAuthed(req);

    const catalog = await readCatalog();
    const items = authed ? catalog.items : catalog.items.filter((item) => !item.hidden);

    const cache = authed || fresh
      ? 'no-store, max-age=0'
      : 'public, s-maxage=60, stale-while-revalidate=300';

    send(
      res,
      200,
      {
        items: items,
        updatedAt: catalog.updatedAt,
        demo: catalog.demo,
        storage: blobConfigured() ? 'blob' : 'seed',
        authed: authed
      },
      cache
    );
  } catch (err) {
    fail(res, err);
  }
};
