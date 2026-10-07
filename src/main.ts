// Entry point: boots the background, then the UI.

import { startBackground } from './bg';
import { initScrollCue } from './ui/hero';

const canvas = document.querySelector<HTMLCanvasElement>('#bg');
if (canvas) void startBackground(canvas);

const cue = document.querySelector<HTMLElement>('.scroll-cue');
const work = document.querySelector<HTMLElement>('#work');
if (cue && work) initScrollCue(cue, work);
