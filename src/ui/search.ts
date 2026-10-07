// Sticky skill filter: removable chips + an input with a suggestion popup (ARIA combobox pattern).
// Suggestions are the visible keywords; typing something that isn't one adds a free-text term,
// which is how hidden keywords and context words are reached.

import { h, normalize } from '../lib/dom';
import { icon } from './icons';

export interface Term {
  label: string;
  /** true = a suggested keyword (exact match); false = free text (substring match). */
  exact: boolean;
}

export interface Suggestion {
  label: string;
  count: number;
}

export interface SearchController {
  el: HTMLElement;
  add(label: string, exact: boolean): void;
  clear(): void;
}

interface Option extends Term {
  count?: number;
}

const touch = matchMedia('(pointer: coarse)').matches;

export function createSearch(suggestions: readonly Suggestion[], onChange: (terms: readonly Term[]) => void): SearchController {
  const terms: Term[] = [];
  let options: Option[] = [];
  let active = -1;
  let navigated = false; // arrow keys used since the popup opened
  let tapping = false; // pointer is down inside the popup

  const chips = h('ul', { class: 'chips', 'aria-label': 'Active filters' });
  const input = h('input', {
    class: 'search-input',
    type: 'text',
    role: 'combobox',
    'aria-label': 'Filter projects by skill',
    'aria-autocomplete': 'list',
    'aria-expanded': 'false',
    'aria-controls': 'search-options',
    autocomplete: 'off',
    autocapitalize: 'off',
    spellcheck: 'false',
    enterkeyhint: 'search',
  });
  const listbox = h('ul', { class: 'search-options', id: 'search-options', role: 'listbox', 'aria-label': 'Skills', hidden: true });
  const box = h('div', { class: 'search-box' }, h('span', { class: 'search-icon' }, icon('search')), chips, input);
  const el = h('div', { class: 'search', role: 'search' }, box, listbox);

  // ---------- terms ----------

  const add = (label: string, exact: boolean) => {
    const key = normalize(label);
    if (!key || terms.some((t) => normalize(t.label) === key)) return;
    terms.push({ label: label.trim(), exact });
    changed();
  };

  const remove = (index: number) => {
    terms.splice(index, 1);
    changed();
  };

  const clear = () => {
    if (!terms.length) return;
    terms.length = 0;
    changed();
  };

  const changed = () => {
    chips.replaceChildren(
      ...terms.map((term, i) => {
        const text = term.exact ? term.label : `“${term.label}”`;
        const x = h('button', { type: 'button', class: 'chip-remove', 'aria-label': `Remove filter ${term.label}` }, icon('close'));
        x.addEventListener('click', (e) => {
          remove(i);
          if (e.detail === 0) input.focus(); // keyboard activation: keep focus in the widget
        });
        return h('li', { class: term.exact ? 'chip' : 'chip is-text' }, text, x);
      }),
    );
    input.placeholder = terms.length ? 'Add filter' : 'Filter by skill';
    onChange([...terms]);
  };

  // ---------- popup ----------

  const compute = (): Option[] => {
    const query = normalize(input.value);
    const taken = new Set(terms.map((t) => normalize(t.label)));
    const list: Option[] = suggestions
      .filter((s) => {
        const key = normalize(s.label);
        return !taken.has(key) && (!query || key.includes(query));
      })
      .map((s) => ({ label: s.label, exact: true, count: s.count }));
    // Offer the raw text too, unless it is exactly a suggestion or already a filter.
    if (query && !taken.has(query) && !list.some((o) => normalize(o.label) === query)) {
      list.push({ label: input.value.trim(), exact: false });
    }
    return list;
  };

  const open = () => {
    options = compute();
    active = options.length ? 0 : -1;
    navigated = false;
    render();
  };

  const close = () => {
    options = [];
    active = -1;
    render();
  };

  const render = () => {
    const shown = options.length > 0;
    listbox.hidden = !shown;
    input.setAttribute('aria-expanded', String(shown));
    listbox.replaceChildren(
      ...options.map((o, i) =>
        h(
          'li',
          { class: 'search-option', id: `search-opt-${i}`, role: 'option', 'aria-selected': String(i === active), 'data-index': i },
          o.exact ? o.label : `Search “${o.label}”`,
          o.count !== undefined && h('span', { class: 'search-count', 'aria-hidden': 'true' }, String(o.count)),
        ),
      ),
    );
    if (active >= 0) input.setAttribute('aria-activedescendant', `search-opt-${active}`);
    else input.removeAttribute('aria-activedescendant');
  };

  const highlight = (index: number) => {
    if (!options.length) return;
    active = (index + options.length) % options.length;
    for (const li of listbox.children) li.setAttribute('aria-selected', String(li.id === `search-opt-${active}`));
    input.setAttribute('aria-activedescendant', `search-opt-${active}`);
    // Keep the highlighted row visible inside the popup without scrolling the page.
    const row = listbox.children[active] as HTMLElement | undefined;
    if (row) {
      if (row.offsetTop < listbox.scrollTop) listbox.scrollTop = row.offsetTop;
      else if (row.offsetTop + row.offsetHeight > listbox.scrollTop + listbox.clientHeight)
        listbox.scrollTop = row.offsetTop + row.offsetHeight - listbox.clientHeight;
    }
  };

  const choose = (index: number) => {
    const option = options[index];
    if (!option) return;
    input.value = '';
    close();
    add(option.label, option.exact);
    if (touch) input.blur(); // dismiss the phone keyboard so the results are visible
  };

  // ---------- events ----------

  input.addEventListener('focus', open);
  input.addEventListener('input', open);
  // Some mobile browsers blur the input mid-tap on an option; let that tap finish first.
  input.addEventListener('blur', () => tapping || close());

  input.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowUp':
        e.preventDefault();
        if (listbox.hidden) open();
        else highlight(active + (e.key === 'ArrowDown' ? 1 : -1));
        navigated = true;
        break;
      case 'Enter':
        e.preventDefault();
        // Only pick when the user typed or moved through the list, so a stray Enter adds nothing.
        if (!input.value.trim() && !navigated) break;
        if (listbox.hidden) open();
        choose(active);
        break;
      case 'Escape':
        if (!listbox.hidden) close();
        else input.value = '';
        break;
      case 'Backspace':
        if (!input.value && terms.length) remove(terms.length - 1);
        break;
      case 'Tab':
        close();
        break;
    }
  });

  // Clicking empty space in the bar (or the icon) focuses the input.
  box.addEventListener('click', (e) => {
    if ((e.target as Element).closest('.chip-remove')) return;
    if (document.activeElement === input) {
      if (listbox.hidden) open();
    } else input.focus();
  });

  // preventDefault on press keeps focus in the input, so a tap doesn't blur (and close) first.
  listbox.addEventListener('pointerdown', (e) => {
    tapping = true;
    e.preventDefault();
  });
  listbox.addEventListener('mousedown', (e) => e.preventDefault());
  listbox.addEventListener('click', (e) => {
    tapping = false;
    const li = (e.target as Element).closest<HTMLElement>('[data-index]');
    if (li) choose(Number(li.dataset.index));
  });
  // A press that started on an option but ended elsewhere (no click): tidy up after it.
  window.addEventListener('pointerup', () =>
    setTimeout(() => {
      if (!tapping) return;
      tapping = false;
      if (document.activeElement !== input) close();
    }),
  );
  listbox.addEventListener('pointermove', (e) => {
    const li = (e.target as Element).closest<HTMLElement>('[data-index]');
    if (li && Number(li.dataset.index) !== active) highlight(Number(li.dataset.index));
  });

  input.placeholder = 'Filter by skill';
  return { el, add, clear };
}

/** Visible keywords across entries with how many entries use each, most common first. */
export function collectSuggestions(keywordLists: readonly (readonly string[])[]): Suggestion[] {
  const byKey = new Map<string, Suggestion>();
  for (const list of keywordLists) {
    for (const label of list) {
      const key = normalize(label);
      const s = byKey.get(key);
      if (s) s.count++;
      else byKey.set(key, { label, count: 1 });
    }
  }
  return [...byKey.values()].sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}
