// Entry point: boots the background, then the UI.

import { startBackground } from './bg';
import { initScrollCue } from './ui/hero';
import { createList } from './ui/list';
import { collectSuggestions, createSearch } from './ui/search';
import { entries } from './content/entries';

const canvas = document.querySelector<HTMLCanvasElement>('#bg');
if (canvas) void startBackground(canvas);

const cue = document.querySelector<HTMLElement>('.scroll-cue');
const work = document.querySelector<HTMLElement>('#work');
if (cue && work) initScrollCue(cue, work);

const listEl = document.querySelector<HTMLElement>('#work .list');
if (work && listEl) {
  const search = createSearch(collectSuggestions(entries.map((e) => e.keywords)), (terms) => {
    list.setTerms(terms);
    // If the results start above the screen (scrolled down, e.g. after tapping a pill), bring them back up.
    const top = work.getBoundingClientRect().top;
    if (top < 0) window.scrollTo({ top: window.scrollY + top });
  });
  listEl.before(search.el);
  const list = createList(listEl, entries, (keyword) => search.add(keyword, true), search.clear);

  // Search is for wider screens only; phones get the plain list. Force it with ?search=on or ?search=off.
  const forced = new URLSearchParams(location.search).get('search');
  const wide = matchMedia('(min-width: 720px)');
  const applySearchGate = () => {
    const on = forced === 'on' || (forced !== 'off' && wide.matches);
    document.documentElement.classList.toggle('no-search', !on);
    // Without the bar there'd be no way to see or undo a filter, so pills become plain labels.
    for (const pill of listEl.querySelectorAll<HTMLButtonElement>('.pill')) {
      pill.disabled = !on;
      pill.title = on ? `Filter by ${pill.textContent}` : '';
    }
    if (!on) search.clear();
  };
  applySearchGate();
  wide.addEventListener('change', applySearchGate);
}
