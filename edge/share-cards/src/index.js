const MAX_LENGTH = 300;

function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;',
    '"': '&quot;', "'": '&#39;',
  })[char]);
}

function response(message, status, type) {
  return new Response(message, {
    status,
    headers: {
      'Content-Type': type,
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'public, max-age=120',
    },
  });
}

export function buildPreviewHtml(text) {
  if (!text || Array.from(text).length > MAX_LENGTH) {
    throw new Error('Invalid card content');
  }

  const preview = {
    component: {
      type: 17,
      accent_color: 6777835,
      components: [{
        type: 10,
        content: '# NEXUS / SHARED CARD\n' + text,
      }],
    },
  };

  // Discord requires a JSON payload below 3000 UTF-8 bytes.
  const json = JSON.stringify(preview).replace(/</g, '\\u003c');
  if (new TextEncoder().encode(json).length > 3000) {
    throw new Error('Card payload too large');
  }
  return [
    '<!doctype html><html lang="en"><head><meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width,initial-scale=1">',
    '<meta property="og:title" content="NEXUS / Shared Card">',
    '<meta property="og:description" content="', escapeHtml(text.slice(0, 180)), '">',
    '<script id="discord:component-embed" type="application/json">',
    json,
    '</script>',
    '<title>NEXUS shared card</title>',
    '<style>body{background:#101327;color:#f4f2ff;font:18px system-ui;',
    'max-width:700px;margin:8vh auto;padding:28px;line-height:1.5}',
    'main{border:1px solid #7669d7;border-radius:22px;padding:24px}',
    'h1{color:#b5aaff;letter-spacing:.07em}</style>',
    '</head><body><main><h1>NEXUS / SHARED CARD</h1><p>',
    escapeHtml(text).replace(/\n/g, '<br>'),
    '</p><p>This page has a Discord-native component preview.</p>',
    '</main></body></html>',
  ].join('');
}

export default {
  async fetch(request) {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return response('Method not allowed', 405, 'text/plain; charset=utf-8');
    }
    const url = new URL(request.url);
    if (url.pathname === '/health') {
      return response(JSON.stringify({ ok: true, service: 'nexus-share-cards' }),
        200, 'application/json; charset=utf-8');
    }
    if (!url.pathname.startsWith('/p/')) {
      return response('NEXUS Share Cards: use /p/<encoded message>', 404,
        'text/plain; charset=utf-8');
    }
    try {
      const slug = url.pathname.slice(3);
      if (!slug || slug.length > 2600) throw new Error('Invalid card path');
      const message = decodeURIComponent(slug);
      if (!message.trim()) throw new Error('Empty card');
      const html = buildPreviewHtml(message);
      if (request.method === 'HEAD') {
        return new Response(null, {
          status: 200,
          headers: {'Content-Type': 'text/html; charset=utf-8'},
        });
      }
      return response(html, 200, 'text/html; charset=utf-8');
    } catch (_) {
      return response('Invalid or oversized card', 400, 'text/plain; charset=utf-8');
    }
  },
};
