// Hero scroll cue: scrolls to the project list, and fades out once the page is scrolled.

const HIDE_AFTER_PX = 48;

export function initScrollCue(cue: HTMLElement, target: HTMLElement): void {
  // Smoothness comes from CSS scroll-behavior, which is disabled under reduced motion.
  cue.addEventListener('click', () => target.scrollIntoView());

  // Scroll offset (not hero visibility) so a hero taller than the screen, e.g. a landscape phone,
  // still shows the cue at the top.
  const update = () => cue.classList.toggle('is-hidden', window.scrollY > HIDE_AFTER_PX);
  window.addEventListener('scroll', update, { passive: true });
  update();
}
