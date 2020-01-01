import React, { useRef, useEffect, useState } from 'react';
import { ThemedAnimation } from './animation';
import './App.css';

import myWorker from './test.worker';

function App() {
  const workerRef = useRef(null);
  const canvasWorkerRef = useRef(null);
  const canvasWindowRef = useRef(null);
  const animationWindow = useRef(null);
  const workerStarted = useRef(null);
  const [log, setLog] = useState(0);
  const [inWorker, setInWorker] = useState(false);

  const onClickInteract = () => {
    const value = parseInt(log, 10) + 1;
    setLog(value);
  };

  const onClickPlay = e => {
    setInWorker(e.target.checked);
  };

  useEffect(() => {
    animationWindow.current = new ThemedAnimation(
      canvasWindowRef.current.getContext('2d'),
    );
    workerRef.current = new myWorker();
    const offscreen = canvasWorkerRef.current.transferControlToOffscreen();
    workerRef.current.postMessage({ msg: 'init', canvas: offscreen }, [
      offscreen,
    ]);
    animationWindow.current.start();
  }, []);

  useEffect(() => {
    if (!workerRef.current) return;
    playAnimation(inWorker);
  }, [inWorker]);

  const playAnimation = inWorker => {
    if (inWorker) {
      animationWindow.current.stop();
      workerRef.current.postMessage({ msg: 'start' });
      workerStarted.current = true;
    } else {
      animationWindow.current.start();
      workerRef.current.postMessage({ msg: 'stop' });
      workerStarted.current = false;
    }
  };

  return (
    <main className="supported">
      <section>
        <p className="desc">
          If an app has long running rendering tasks (e.g. ray tracing in
          WebGL), running those tasks in a worker allows the web app’s UI to
          remain responsive while the rendering task runs continuously in the
          background.
        </p>
        <p className="desc">
          The animation below is running a heavy task while changing the color
          theme. If you click on the button at such moment, the interaction is
          blocked for a short while causing bad user experience.
        </p>
        <p>
          <input
            type="checkbox"
            id="play"
            className="cbx hidden"
            onClick={onClickPlay}
          />
          <label htmlFor="play" className="lbl">
            {inWorker ? 'Runs in worker' : 'Runs in main thread'}
          </label>
        </p>
        <p>
          <button onClick={onClickInteract}>
            Click me! Counter: <span id="log">{log}</span>
          </button>
        </p>

        <div className="display">
          <div>
            <h1>Canvas on main thread</h1>
            <p>Interaction is blocked when a theme is loading</p>
            <canvas width="400" height="400" ref={canvasWindowRef} />
          </div>
          <div>
            <h1>Canvas on worker thread</h1>
            <p>Interaction works even if a theme is loading</p>
            <canvas width="400" height="400" ref={canvasWorkerRef} />
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;
