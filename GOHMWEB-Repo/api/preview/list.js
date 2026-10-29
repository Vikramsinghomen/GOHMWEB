const { send, fail } = require('../_lib/http');
const { readCatalog, blobConfigured } = require('../_lib/store');
const { isAuthed } = require('../_lib/auth');

/**
 * GET /api/preview/list
 *
 * Public. Returns the catalog in display order. Hidden items are only included
 * for a signed-in editor.
 *
 * Never cached, by the edge or the browser: the editor writes the catalog
 * straight to Blob, so a save must show up on the very next page load. With an
 * edge cache here the owner saves an entry, reloads, and still sees the old
 * list for up to six minutes - which is exactly the bug we hit.
 */
module.exports = async (req, res) => {
  try {
    if (req.method !== 'GET') {
      return send(res, 405, { error: 'method_not_allowed' });
    }

    const authed = isAuthed(req);

    const catalog = await readCatalog();
    const items = authed ? catalog.items : catalog.items.filter((item) => !item.hidden);

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
      'no-store, max-age=0'
    );
  } catch (err) {
    fail(res, err);
  }
};
