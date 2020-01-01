/* eslint no-restricted-globals: 0 */
import { ThemedAnimation } from './animation';

let animationWorker = null;
let canvas, canvasCtx;

self.onmessage = function(e) {
  switch (e.data.msg) {
    case 'init':
      canvas = e.data.canvas;
      canvasCtx = canvas.getContext('2d');
      break;
    case 'start':
      if (!animationWorker) {
        animationWorker = new ThemedAnimation(canvasCtx);
      }
      animationWorker.start();
      break;
    case 'stop':
      if (!animationWorker) {
        return;
      }
      animationWorker.stop();
      break;
    default:
      return;
  }
};
