// Inline SVG icons for UI built in JS. Static strings only (parsed with a <template>).

const icons = {
  search:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M16 16l4.5 4.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  close:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7l10 10M17 7L7 17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
} as const;

export function icon(name: keyof typeof icons): Element {
  const template = document.createElement('template');
  template.innerHTML = icons[name];
  return template.content.firstElementChild as Element;
}
