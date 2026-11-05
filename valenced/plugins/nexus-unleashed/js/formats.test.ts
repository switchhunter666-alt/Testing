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
