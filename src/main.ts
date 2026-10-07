// Entry point: boots the background, then the UI.

import { startBackground } from './bg';

const canvas = document.querySelector<HTMLCanvasElement>('#bg');
if (canvas) void startBackground(canvas);
