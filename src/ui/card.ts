// Entry → <article class="card">. Self-contained: owns its "Read more" toggle.

import type { Entry, YearMonth } from '../content/types';
import { h } from '../lib/dom';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function createCard(entry: Entry): HTMLElement {
  const descId = `desc-${entry.id}`;
  const desc = h('p', { class: 'card-desc', id: descId }, entry.description);
  const more = h('button', { class: 'card-more', type: 'button', 'aria-expanded': 'false', 'aria-controls': descId, hidden: true }, 'Read more');

  more.addEventListener('click', () => {
    const open = desc.classList.toggle('is-open');
    more.textContent = open ? 'Show less' : 'Read more';
    more.setAttribute('aria-expanded', String(open));
  });

  return h(
    'article',
    { class: 'card', id: `entry-${entry.id}`, 'data-kind': entry.kind },
    thumbnail(entry),
    h(
      'div',
      { class: 'card-body' },
      h(
        'header',
        { class: 'card-head' },
        h('h3', { class: 'card-title' }, entry.title),
        h(
          'p',
          { class: 'card-meta' },
          entry.kind === 'work' && h('span', { class: 'card-tag' }, 'Work'),
          dateRange(entry.date, entry.end),
        ),
      ),
      entry.context && h('p', { class: 'card-context' }, entry.context),
      desc,
      more,
      h('ul', { class: 'card-kw' }, ...entry.keywords.map((kw) => h('li', { class: 'pill' }, kw))),
    ),
  );
}

/** Linked 16:9 image, or a styled placeholder when the entry has no thumbnail yet. */
function thumbnail(entry: Entry): HTMLElement {
  const inner = entry.thumbnail
    ? h('img', {
        src: entry.thumbnail,
        alt: entry.thumbAlt ?? entry.title,
        width: 800,
        height: 450,
        loading: 'lazy',
        decoding: 'async',
      })
    : h('span', { class: 'thumb-placeholder', 'aria-hidden': 'true' }, entry.title);

  if (!entry.link) return h('div', { class: 'thumb' }, inner);
  return h(
    'a',
    { class: 'thumb', href: entry.link, target: '_blank', rel: 'noopener', 'aria-label': `Open ${entry.title} (new tab)` },
    inner,
  );
}

/** "Sep 2024", "Sep – Dec 2024", "Sep 2025 – Jan 2026", "Jun 2026 – Present". */
function dateRange(start: YearMonth, end?: YearMonth | 'present'): DocumentFragment {
  const frag = document.createDocumentFragment();
  const [sy, sm] = parse(start);
  if (!end || end === start) {
    frag.append(h('time', { datetime: start }, `${MONTHS[sm]} ${sy}`));
    return frag;
  }
  if (end === 'present') {
    frag.append(h('time', { datetime: start }, `${MONTHS[sm]} ${sy}`), ' – Present');
    return frag;
  }
  const [ey, em] = parse(end);
  const startText = sy === ey ? MONTHS[sm] : `${MONTHS[sm]} ${sy}`;
  frag.append(h('time', { datetime: start }, startText), ' – ', h('time', { datetime: end }, `${MONTHS[em]} ${ey}`));
  return frag;
}

function parse(ym: YearMonth): [year: string, monthIndex: number] {
  const [y = '', m = '1'] = ym.split('-');
  return [y, Number(m) - 1];
}
