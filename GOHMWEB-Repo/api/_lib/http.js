/**
 * Tiny helpers for Vercel Node functions (plain `api/*.js` routes).
 *
 * Vercel does NOT parse the request body for plain functions, so every POST
 * handler has to read the stream itself. These helpers keep that in one place.
 */

const MAX_JSON_BYTES = 2 * 1024 * 1024; // catalog JSON only, never images
const MAX_BINARY_BYTES = 4 * 1024 * 1024; // stays under Vercel's 4.5 MB limit

function httpError(statusCode, message, code) {
  const err = new Error(message);
  err.statusCode = statusCode;
  if (code) err.code = code;
  return err;
}

function readBody(req, limit) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > limit) {
        reject(httpError(413, 'Payload too large'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

async function readJson(req, limit = MAX_JSON_BYTES) {
  const raw = await readBody(req, limit);
  if (!raw.length) return {};
  try {
    return JSON.parse(raw.toString('utf8'));
  } catch {
    throw httpError(400, 'Body must be valid JSON');
  }
}

/**
 * Sends a JSON response. `cache` is opt-in because every admin route must
 * never be cached by the edge.
 */
function send(res, status, data, cache) {
  const body = JSON.stringify(data);
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', cache || 'no-store, max-age=0');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (status === 405) res.setHeader('Allow', 'GET, POST');
  res.end(body);
}

function fail(res, err) {
  const status = (err && err.statusCode) || 500;
  if (status >= 500) console.error('[preview-api]', err);
  const payload = {
    error: status >= 500 ? 'server_error' : err.message || 'request_failed'
  };
  if (err && err.code) payload.code = err.code;
  if (status >= 500) payload.message = 'Something went wrong. Try again.';
  send(res, status, payload);
}

module.exports = {
  MAX_JSON_BYTES,
  MAX_BINARY_BYTES,
  httpError,
  readBody,
  readJson,
  send,
  fail
};
