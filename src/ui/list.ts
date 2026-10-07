// Renders entries as a grid of cards, newest first, and keeps "Read more" buttons in sync with clamping.

import type { Entry } from '../content/types';
import { createCard } from './card';

/** Newest first: by end month ('present' first), then start month, then title. */
export function byNewest(a: Entry, b: Entry): number {
  return (
    sortKey(b).localeCompare(sortKey(a)) ||
    b.date.localeCompare(a.date) ||
    a.title.localeCompare(b.title)
  );
}

function sortKey(e: Entry): string {
  return e.end === 'present' ? '9999-12' : (e.end ?? e.date);
}

export function renderList(container: HTMLElement, entries: readonly Entry[]): void {
  container.append(...[...entries].sort(byNewest).map(createCard));
  watchClamps(container);
}

/** Shows "Read more" only on descriptions that are actually clamped; re-checks when the layout changes. */
function watchClamps(container: HTMLElement): void {
  let queued = false;
  const update = () => {
    queued = false;
    for (const desc of container.querySelectorAll<HTMLElement>('.card-desc:not(.is-open)')) {
      const more = desc.nextElementSibling as HTMLElement | null;
      if (more) more.hidden = desc.scrollHeight <= desc.clientHeight + 1;
    }
  };
  new ResizeObserver(() => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(update);
  }).observe(container);
}
