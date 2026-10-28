const { send, fail, readJson } = require('../_lib/http');
const {
  checkPassphrase,
  mintToken,
  sessionSecret,
  setSessionCookie,
  throttled,
  clearThrottle,
  clientIp
} = require('../_lib/auth');

const DELAY_MS = 250;

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * POST /api/preview/login  { passphrase }
 *
 * Exchanges the editor passphrase for a signed, HttpOnly session cookie.
 */
module.exports = async (req, res) => {
  try {
    if (req.method !== 'POST') {
      return send(res, 405, { error: 'method_not_allowed' });
    }

    const ip = clientIp(req);

    if (throttled(ip)) {
      return send(res, 429, {
        error: 'too_many_attempts',
        message: 'Too many attempts. Wait 10 minutes and try again.'
      });
    }

    const body = await readJson(req, 8 * 1024);
    const result = checkPassphrase(body.passphrase);

    if (!result.configured) {
      return send(res, 503, {
        error: 'editor_not_configured',
        code: 'missing_passphrase',
        message:
          'EDIT_PASSPHRASE is not set in the Vercel project. Add it under Settings → Environment Variables and redeploy.'
      });
    }

    const secret = sessionSecret();
    if (!secret) {
      return send(res, 503, {
        error: 'editor_not_configured',
        code: 'missing_session_secret',
        message: 'Set EDIT_SESSION_SECRET in the Vercel project and redeploy.'
      });
    }

    if (!result.ok) {
      await wait(DELAY_MS);
      return send(res, 401, { error: 'invalid_passphrase' });
    }

    clearThrottle(ip);
    setSessionCookie(res, mintToken(secret));
    send(res, 200, { ok: true });
  } catch (err) {
    fail(res, err);
  }
};
