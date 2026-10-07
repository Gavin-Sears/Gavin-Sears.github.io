// Tiny DOM builder: h('a', { href, class: 'x' }, child, 'text').

type Attrs = Record<string, string | number | boolean | undefined>;
type Child = Node | string | null | undefined | false;

/** Creates an element. `undefined`/`false` attributes are skipped; `true` sets an empty attribute. */
export function h<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs: Attrs = {},
  ...children: Child[]
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  for (const [name, value] of Object.entries(attrs)) {
    if (value === undefined || value === false) continue;
    el.setAttribute(name, value === true ? '' : String(value));
  }
  for (const child of children) if (child) el.append(child);
  return el;
}

/** Case- and whitespace-insensitive form used for all keyword matching. */
export function normalize(text: string): string {
  return text.trim().toLowerCase().replace(/\s+/g, ' ');
}
