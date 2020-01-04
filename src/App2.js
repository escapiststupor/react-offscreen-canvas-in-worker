import React, { useRef, useEffect, useState } from 'react';
import { ThemedAnimation, Animation } from './animation';
import './App.css';

import myWorker from './test.worker';

function App2() {
  const workerRef = useRef(null);
  const canvasWorkerRef = useRef(null);
  const canvasWindowRef = useRef(null);
  const animationWindow = useRef(null);
  const [isBusy, setIsBusy] = useState(false);

  const onMakeBusy = () => {
    setIsBusy(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        Animation.fibonacci(40);
        setIsBusy(false);
      });
    });
  };

  useEffect(() => {
    animationWindow.current = new Animation(
      canvasWindowRef.current.getContext('2d'),
    );
    workerRef.current = new myWorker();
    const offscreen = canvasWorkerRef.current.transferControlToOffscreen();
    workerRef.current.postMessage({ msg: 'init', canvas: offscreen }, [
      offscreen,
    ]);
    animationWindow.current.start();
    workerRef.current.postMessage({ msg: 'start', isThemed: false });
  }, []);

  return (
    <main className="supported">
      <section>
        <p className="desc">
          OffscreenCanvas lets you avoid animation jank caused by main thread
          event traffic
        </p>
        <p className="desc">
          When you click "make busy" button, the animation on window canvas is
          blocked, while OffscreenCanvas, running on a worker, still plays
          smoothly.
        </p>
        <button onClick={onMakeBusy}>Make me busy!</button>
        <div id="busy">
          {isBusy ? 'Main thread is busy...' : 'Main thread is free'}
        </div>

        <div className="display">
          <div>
            <h1>Canvas on main thread</h1>
            <p>Animation is blocked when main thread is busy</p>
            <canvas width="400" height="400" ref={canvasWindowRef} />
          </div>
          <div>
            <h1>Canvas on worker thread</h1>
            <p>Animation works even if main thread is loading</p>
            <canvas width="400" height="400" ref={canvasWorkerRef} />
          </div>
        </div>
      </section>
    </main>
  );
}

export default App2;
