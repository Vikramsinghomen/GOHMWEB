/**
 * Passphrase-gated editing.
 *
 * The secret shortcut in the browser only opens the editor UI — it is NOT a
 * security boundary, because anyone can read the JavaScript. Every write is
 * therefore gated by a signed, HttpOnly cookie that is only issued after the
 * correct passphrase is posted to /api/preview/login.
 *
 * Required environment variables (Vercel → Settings → Environment Variables):
 *   EDIT_PASSPHRASE      long random passphrase you type in the editor
 *   EDIT_SESSION_SECRET  long random string used to sign the cookie
 */

const crypto = require('crypto');
const { send } = require('./http');

const COOKIE_NAME = 'gohm_preview_edit';
const SESSION_SECONDS = 7 * 24 * 60 * 60; // 7 days

// Login throttling. Serverless instances are ephemeral, so this is best-effort
// on top of the real protection (a long passphrase). It still stops a naive
// script hammering a single warm instance.
const attempts = new Map();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 8;

function sessionSecret() {
  const explicit = process.env.EDIT_SESSION_SECRET;
  if (explicit && explicit.length >= 16) return explicit;
  // Allows the site to work before the second variable is set, but warns loudly.
  const pass = process.env.EDIT_PASSPHRASE;
  if (pass) return 'derived:' + pass + ':gohm-preview-session';
  return null;
}

function sign(payload, secret) {
  return crypto.createHmac('sha256', secret).update(payload).digest('base64url');
}

function timingSafeEqualStr(a, b) {
  const ab = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

function parseCookies(header) {
  const out = {};
  if (!header) return out;
  String(header)
    .split(';')
    .forEach((part) => {
      const idx = part.indexOf('=');
      if (idx === -1) return;
      const key = part.slice(0, idx).trim();
      if (key) out[key] = decodeURIComponent(part.slice(idx + 1).trim());
    });
  return out;
}

function mintToken(secret) {
  const exp = Date.now() + SESSION_SECONDS * 1000;
  return exp + '.' + sign(String(exp), secret);
}

function verifyToken(token, secret) {
  if (typeof token !== 'string') return false;
  const idx = token.indexOf('.');
  if (idx === -1) return false;
  const exp = token.slice(0, idx);
  const sig = token.slice(idx + 1);
  const expNum = Number(exp);
  if (!Number.isFinite(expNum) || expNum < Date.now()) return false;
  return timingSafeEqualStr(sig, sign(exp, secret));
}

function isAuthed(req) {
  const secret = sessionSecret();
  if (!secret) return false;
  const token = parseCookies(req.headers.cookie)[COOKIE_NAME];
  return verifyToken(token, secret);
}

function setSessionCookie(res, token) {
  const parts = [
    COOKIE_NAME + '=' + encodeURIComponent(token),
    'Path=/',
    'HttpOnly',
    'SameSite=Strict',
    'Secure',
    'Max-Age=' + SESSION_SECONDS
  ];
  res.setHeader('Set-Cookie', parts.join('; '));
}

function clearSessionCookie(res) {
  res.setHeader(
    'Set-Cookie',
    COOKIE_NAME + '=; Path=/; HttpOnly; SameSite=Strict; Secure; Max-Age=0'
  );
}

function checkPassphrase(candidate) {
  const expected = process.env.EDIT_PASSPHRASE;
  if (!expected || expected.length < 12) {
    return { ok: false, configured: false };
  }
  if (typeof candidate !== 'string' || !candidate) {
    return { ok: false, configured: true };
  }
  const a = crypto.createHash('sha256').update(candidate).digest();
  const b = crypto.createHash('sha256').update(expected).digest();
  return { ok: crypto.timingSafeEqual(a, b), configured: true };
}

function throttled(ip) {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || now - entry.first > WINDOW_MS) {
    attempts.set(ip, { first: now, count: 1 });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_ATTEMPTS;
}

function clearThrottle(ip) {
  attempts.delete(ip);
}

function clientIp(req) {
  const fwd = req.headers['x-forwarded-for'];
  if (typeof fwd === 'string' && fwd) return fwd.split(',')[0].trim();
  return req.socket && req.socket.remoteAddress ? req.socket.remoteAddress : 'unknown';
}

/** Returns true when the caller may write; sends 401 and returns false otherwise. */
function requireAuth(req, res) {
  if (isAuthed(req)) return true;
  send(res, 401, { error: 'not_authenticated' });
  return false;
}

module.exports = {
  COOKIE_NAME,
  sessionSecret,
  isAuthed,
  mintToken,
  setSessionCookie,
  clearSessionCookie,
  checkPassphrase,
  throttled,
  clearThrottle,
  clientIp,
  requireAuth
};
