const { send } = require('../_lib/http');
const { clearSessionCookie } = require('../_lib/auth');

/** POST /api/preview/logout — clears the editor session cookie. */
module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return send(res, 405, { error: 'method_not_allowed' });
  }
  clearSessionCookie(res);
  send(res, 200, { ok: true });
};
