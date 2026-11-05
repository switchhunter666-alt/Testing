/**
 * Pure, offline-only text transformations. Never reads account tokens or
 * sends Discord requests. Kept separate for deterministic unit tests.
 */
export const MODES = [
  'Plain', 'Bold', 'Quote', 'Spoiler', 'Code',
  'Fullwidth', 'Checklist', 'Heading', 'NEXUS Frame',
] as const;

export type Mode = (typeof MODES)[number];

function escapeInline(value: string): string {
  return value.replace(/([\\*_~|`])/g, '\\$1');
}

export function formatMessage(raw: string, mode: Mode): string {
  const value = String(raw ?? '').replace(/\r\n?/g, '\n').slice(0, 1800);
  if (!value) return '';

  switch (mode) {
    case 'Bold':
      return '**' + escapeInline(value) + '**';
    case 'Quote':
      return value.split('\n').map(line => '> ' + line).join('\n');
    case 'Spoiler':
      return '||' + escapeInline(value) + '||';
    case 'Code': {
      const runs = value.match(/`+/g) ?? [];
      const longest = Math.max(2, ...runs.map(run => run.length));
      const fence = '`'.repeat(longest + 1);
      return fence + '\n' + value + '\n' + fence;
    }
    case 'Fullwidth':
      return Array.from(value).map(ch => {
        const code = ch.codePointAt(0)!;
        if (ch === ' ') return '　';
        return code >= 33 && code <= 126 ? String.fromCodePoint(code + 0xFEE0) : ch;
      }).join('');
    case 'Checklist':
      return value.split('\n').map(line => '- [ ] ' + line).join('\n');
    case 'Heading':
      return '# ' + value.split('\n').join('\n### ');
    case 'NEXUS Frame':
      return '╔══ NEXUS ══╗\n' + value + '\n╚══════════╝';
    default:
      return value;
  }
}

/** Creates a shareable URL for an independently hosted NEXUS card worker. */
export function buildCardLink(host: string, message: string): string {
  const base = host.trim().replace(/\/+$/g, '');
  if (!/^https:\/\/[a-z0-9][a-z0-9.-]*(?::[0-9]+)?$/i.test(base)) {
    throw new Error('Enter a valid HTTPS worker origin, without a path.');
  }
  const content = Array.from(message).slice(0, 300).join('');
  if (!content.trim()) throw new Error('Write a message first.');
  return base + '/p/' + encodeURIComponent(content);
}
