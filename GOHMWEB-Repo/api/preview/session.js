const { send, fail } = require('../_lib/http');
const { isAuthed } = require('../_lib/auth');
const { blobConfigured } = require('../_lib/store');

/** GET /api/preview/session — does this browser still hold a valid session? */
module.exports = async (req, res) => {
  try {
    if (req.method !== 'GET') {
      return send(res, 405, { error: 'method_not_allowed' });
    }

    send(res, 200, {
      authed: isAuthed(req),
      storage: blobConfigured() ? 'blob' : 'seed',
      passphraseConfigured: Boolean(process.env.EDIT_PASSPHRASE)
    });
  } catch (err) {
    fail(res, err);
  }
};
