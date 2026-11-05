import { test, expect } from 'bun:test';
import worker from './index.js';

test('health endpoint answers without secrets', async () => {
  const reply = await worker.fetch(new Request('https://cards.example.com/health'));
  expect(reply.status).toBe(200);
  expect((await reply.json()).ok).toBe(true);
});

test('Discord component payload is valid and bounded', async () => {
  const url = 'https://cards.example.com/p/' + encodeURIComponent('Hello 🌙');
  const reply = await worker.fetch(new Request(url));
  expect(reply.status).toBe(200);
  expect(reply.headers.get('Content-Type')).toContain('text/html');
  const html = await reply.text();
  const match = html.match(/<script id="discord:component-embed" type="application\/json">([\s\S]*?)<\/script>/);
  expect(match).not.toBeNull();
  const data = JSON.parse(match[1]);
  expect(data.component.type).toBe(17);
  expect(data.component.components[0].type).toBe(10);
  expect(data.component.components[0].content).toContain('Hello 🌙');
});

test('user text is escaped in script and HTML', async () => {
  const dangerous = '</script><img src=x onerror=alert(1)>';
  const reply = await worker.fetch(new Request('https://cards.example.com/p/' + encodeURIComponent(dangerous)));
  const html = await reply.text();
  expect(reply.status).toBe(200);
  expect(html).not.toContain('</script><img');
  expect(html).toContain('&lt;/script&gt;');
});

test('rejects too much content and invalid HTTP methods', async () => {
  const tooLong = 'x'.repeat(301);
  const resp = await worker.fetch(new Request('https://cards.example.com/p/' + tooLong));
  expect(resp.status).toBe(400);
  const post = await worker.fetch(new Request('https://cards.example.com/health', {method: 'POST'}));
  expect(post.status).toBe(405);
});
