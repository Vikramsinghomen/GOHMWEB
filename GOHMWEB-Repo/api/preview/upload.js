const crypto = require('crypto');
const { send, fail, readBody, httpError, MAX_BINARY_BYTES } = require('../_lib/http');
const { requireAuth } = require('../_lib/auth');
const { blobConfigured, IMAGE_PREFIX } = require('../_lib/store');

/**
 * POST /api/preview/upload?w=1080&h=2340
 * Body: raw image bytes (already resized in the browser).
 *
 * Raw bytes instead of multipart: no parser dependency, and the browser has
 * already compressed the screenshot well below the 4.5 MB function limit.
 */

function sniff(buf) {
  if (buf.length > 12 && buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') {
    return { ext: 'webp', type: 'image/webp' };
  }
  if (buf.length > 8 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) {
    return { ext: 'png', type: 'image/png' };
  }
  if (buf.length > 4 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) {
    return { ext: 'jpg', type: 'image/jpeg' };
  }
  return null;
}

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
}

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

    const url = new URL(req.url, 'https://local.invalid');
    const buffer = await readBody(req, MAX_BINARY_BYTES);

    if (buffer.length < 512) {
      throw httpError(400, 'File is empty or too small');
    }

    const kind = sniff(buffer);
    if (!kind) {
      throw httpError(415, 'Only WebP, PNG or JPEG images are accepted');
    }

    const name =
      Date.now().toString(36) +
      '-' +
      crypto.randomBytes(4).toString('hex') +
      (slugify(url.searchParams.get('name')) ? '-' + slugify(url.searchParams.get('name')) : '');

    const { put } = require('@vercel/blob');
    const blob = await put(IMAGE_PREFIX + name + '.' + kind.ext, buffer, {
      access: 'public',
      contentType: kind.type,
      addRandomSuffix: false,
      cacheControlMaxAge: 31536000
    });

    const width = Number(url.searchParams.get('w'));
    const height = Number(url.searchParams.get('h'));

    send(res, 200, {
      ok: true,
      url: blob.url,
      bytes: buffer.length,
      width: Number.isFinite(width) && width > 0 ? Math.round(width) : null,
      height: Number.isFinite(height) && height > 0 ? Math.round(height) : null
    });
  } catch (err) {
    fail(res, err);
  }
};
