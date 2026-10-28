/**
 * Validation for anything coming back from the editor.
 *
 * The passphrase protects the routes, but never trust the payload: a stolen
 * session or a copy/paste mistake should not be able to store junk that ends up
 * rendered on a public page.
 */

const crypto = require('crypto');

const MAX_ITEMS = 500;
const MAX_IMAGES_PER_ITEM = 12;
const MAX_TAGS = 12;

const SAME_SITE = /^\/assets\/[a-z0-9._\/-]+$/i;
const BLOB_HOST = /^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\/[a-z0-9._\/-]+$/i;
const SITE_HOST = /^https:\/\/(www\.)?greatohm\.com\/[a-z0-9._\/-]+$/i;

function singleLine(value, max) {
  if (typeof value !== 'string') return '';
  return value.replace(/\s+/g, ' ').trim().slice(0, max);
}

function multiLine(value, max) {
  if (typeof value !== 'string') return '';
  return value
    .replace(/\r\n/g, '\n')
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '')
    .trim()
    .slice(0, max);
}

function newId() {
  return 'p' + Date.now().toString(36) + crypto.randomBytes(3).toString('hex');
}

function cleanId(value) {
  return typeof value === 'string' && /^[a-z0-9][a-z0-9-]{3,63}$/.test(value)
    ? value
    : newId();
}

function cleanUrl(value) {
  if (typeof value !== 'string') return null;
  const url = value.trim();
  if (url.length > 600) return null;
  if (SAME_SITE.test(url) || BLOB_HOST.test(url) || SITE_HOST.test(url)) return url;
  return null;
}

function cleanDimension(value) {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0 || n > 10000) return null;
  return Math.round(n);
}

function cleanImage(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const url = cleanUrl(raw.url);
  if (!url) return null;
  const image = { url: url, alt: singleLine(raw.alt, 160) };
  const width = cleanDimension(raw.width);
  const height = cleanDimension(raw.height);
  if (width) image.width = width;
  if (height) image.height = height;
  return image;
}

function cleanTags(raw) {
  if (!Array.isArray(raw)) return [];
  const seen = new Set();
  const tags = [];
  raw.forEach((tag) => {
    const value = singleLine(tag, 40).toLowerCase();
    if (!value || seen.has(value)) return;
    seen.add(value);
    tags.push(value);
  });
  return tags.slice(0, MAX_TAGS);
}

function cleanItem(raw, index) {
  if (!raw || typeof raw !== 'object') return null;
  const title = singleLine(raw.title, 140);
  if (!title) return null;

  const images = (Array.isArray(raw.images) ? raw.images : [])
    .slice(0, MAX_IMAGES_PER_ITEM)
    .map(cleanImage)
    .filter(Boolean);

  return {
    id: cleanId(raw.id),
    title: title,
    service: singleLine(raw.service, 40),
    description: multiLine(raw.description, 700),
    tags: cleanTags(raw.tags),
    images: images,
    hidden: raw.hidden === true,
    demo: raw.demo === true,
    order: index
  };
}

function cleanItems(raw) {
  if (!Array.isArray(raw)) {
    const err = new Error('items must be an array');
    err.statusCode = 400;
    throw err;
  }
  if (raw.length > MAX_ITEMS) {
    const err = new Error('Too many items (max ' + MAX_ITEMS + ')');
    err.statusCode = 400;
    throw err;
  }

  const seen = new Set();
  const items = [];
  raw.forEach((entry, index) => {
    const item = cleanItem(entry, index);
    if (!item) return;
    if (seen.has(item.id)) item.id = newId();
    seen.add(item.id);
    items.push(item);
  });

  items.forEach((item, index) => {
    item.order = index;
  });

  return items;
}

module.exports = { cleanItems, cleanId, newId, MAX_ITEMS, MAX_IMAGES_PER_ITEM };
