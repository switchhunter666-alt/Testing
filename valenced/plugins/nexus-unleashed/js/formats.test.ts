import { test, expect } from 'bun:test';
import { MODES, formatMessage } from './formats';

test('all modes produce useful output', () => {
  for (const mode of MODES) expect(formatMessage('Hello', mode).length).toBeGreaterThan(0);
});
test('quote transforms multiline strings', () => {
  expect(formatMessage('a\nb', 'Quote')).toBe('> a\n> b');
});
test('code fence grows past backticks in content', () => {
  const result = formatMessage('hello ``` world', 'Code');
  expect(result.startsWith('````\n')).toBe(true);
  expect(result.endsWith('\n````')).toBe(true);
});
test('fullwidth maps ASCII and preserves Unicode', () => {
  expect(formatMessage('A! 🌙', 'Fullwidth')).toBe('Ａ！　🌙');
});
test('empty input is always empty', () => {
  for (const mode of MODES) expect(formatMessage('', mode)).toBe('');
});
test('input size is capped before rendering', () => {
  expect(formatMessage('x'.repeat(3000), 'Plain')).toHaveLength(1800);
});

import { buildCardLink } from './formats';

test('card link uses HTTPS origin and encodes Unicode', () => {
  expect(buildCardLink('https://cards.example.com/', 'hi 🌙'))
    .toBe('https://cards.example.com/p/hi%20%F0%9F%8C%99');
});
test('card link rejects untrusted schemes and paths', () => {
  expect(() => buildCardLink('http://cards.example.com', 'hi')).toThrow();
  expect(() => buildCardLink('https://cards.example.com/evil', 'hi')).toThrow();
});
test('card link refuses empty text', () => {
  expect(() => buildCardLink('https://cards.example.com', '')).toThrow();
});
