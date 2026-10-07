// Renders entries as a grid of cards and filters them by search terms.
// Filtering is ANY-match: a card shows if at least one term hits it, and cards hitting more terms rank first.

import type { Entry } from '../content/types';
import { h, normalize } from '../lib/dom';
import { createCard } from './card';
import type { Term } from './search';

export interface ListController {
  setTerms(terms: readonly Term[]): void;
}

interface Item {
  entry: Entry;
  card: HTMLElement;
  /** Exact-match keys: keywords, hidden keywords, kind, and the words of `context`. */
  keys: Set<string>;
  /** Substring-match haystack for free-text terms: all of the above plus title and full context. */
  text: string[];
  pills: HTMLElement[];
}

/** Newest first: by end month ('present' first), then start month, then title. */
export function byNewest(a: Entry, b: Entry): number {
  return sortKey(b).localeCompare(sortKey(a)) || b.date.localeCompare(a.date) || a.title.localeCompare(b.title);
}

function sortKey(e: Entry): string {
  return e.end === 'present' ? '9999-12' : (e.end ?? e.date);
}

export function createList(
  container: HTMLElement,
  entries: readonly Entry[],
  onKeyword: (keyword: string) => void,
  onClear: () => void,
): ListController {
  const items: Item[] = [...entries].sort(byNewest).map((entry) => {
    const card = createCard(entry, onKeyword);
    const visible = entry.keywords.map(normalize);
    const hidden = (entry.hiddenKeywords ?? []).map(normalize);
    const contextWords = entry.context ? normalize(entry.context).split(/[\s·,/()&-]+/).filter((w) => w.length > 1) : [];
    return {
      entry,
      card,
      keys: new Set([...visible, ...hidden, entry.kind, ...contextWords]),
      text: [...visible, ...hidden, entry.kind, normalize(entry.title), normalize(entry.context ?? '')],
      pills: [...card.querySelectorAll<HTMLElement>('.pill')],
    };
  });

  const status = h('p', { class: 'list-status', 'aria-live': 'polite', hidden: true });
  const clearButton = h('button', { type: 'button', class: 'list-clear' }, 'Clear filters');
  clearButton.addEventListener('click', onClear);
  const empty = h('div', { class: 'list-empty', hidden: true }, h('p', {}, 'No projects match those filters.'), clearButton);

  container.before(status);
  container.after(empty);
  container.append(...items.map((it) => it.card));
  const refreshClamps = watchClamps(container);

  return {
    setTerms(terms) {
      const queries = terms.map((t) => ({ key: normalize(t.label), exact: t.exact }));
      const hits = (it: Item) =>
        queries.filter((q) => (q.exact ? it.keys.has(q.key) : it.text.some((s) => s.includes(q.key)))).length;

      const scored = items.map((it) => ({ it, hits: hits(it) }));
      const shown = queries.length ? scored.filter((s) => s.hits > 0) : scored;
      shown.sort((a, b) => b.hits - a.hits || byNewest(a.it.entry, b.it.entry));

      for (const { it, hits } of scored) {
        it.card.hidden = queries.length > 0 && hits === 0;
        for (const pill of it.pills) {
          const key = normalize(pill.dataset.kw ?? '');
          pill.classList.toggle('hit', queries.some((q) => (q.exact ? key === q.key : key.includes(q.key))));
        }
      }
      container.append(...shown.map((s) => s.it.card)); // moves nodes into ranked order

      status.hidden = queries.length === 0;
      status.textContent = `Showing ${shown.length} of ${items.length} projects`;
      empty.hidden = shown.length > 0;
      refreshClamps();
    },
  };
}

/** Shows "Read more" only on descriptions that are actually clamped; re-checks when the layout changes. */
function watchClamps(container: HTMLElement): () => void {
  let queued = false;
  const update = () => {
    queued = false;
    for (const desc of container.querySelectorAll<HTMLElement>('.card:not([hidden]) .card-desc:not(.is-open)')) {
      const more = desc.nextElementSibling as HTMLElement | null;
      if (more) more.hidden = desc.scrollHeight <= desc.clientHeight + 1;
    }
  };
  const schedule = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(update);
  };
  new ResizeObserver(schedule).observe(container);
  return schedule;
}
