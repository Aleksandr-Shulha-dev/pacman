import { type FC, useCallback, useEffect } from 'react';

import { playGame } from './mechanics/play-game.ts';

import './game.scss';

import dpad from '/images/dpad.png';

const Game: FC = () => {
  const handleDirection = useCallback(
    (direction: 'ArrowUp' | 'ArrowLeft' | 'ArrowRight' | 'ArrowDown'): void => {
      const arrow = new KeyboardEvent('keydown', { key: direction });
      window.dispatchEvent(arrow);
    },
    [],
  );

  useEffect(() => {
    const root = document.querySelector('#subRoot') as Element;
    playGame(1, root);
  }, []);

  return (
    <div>
      <h1>Let&apos;s play!</h1>
      <div className="game">
        <canvas
          id="info"
          className="info"
          data-testid="info"
          width="600"
          height="30"
        ></canvas>
        <canvas
          id="board"
          className="board"
          data-testid="board"
          width="896"
          height="992"
        ></canvas>
      </div>
      <br></br>
      <div className="dpad">
        <img
          src={dpad}
          alt="dpad"
          useMap="#dpad"
          height="200px"
          width="200px"
          data-testid="dpad"
        ></img>
        <map name="dpad" data-testid="dpad-map">
          <area
            role="none"
            className="up"
            data-testid="up"
            shape="rect"
            coords="66,0,133,66"
            alt="up"
            onClick={() => handleDirection('ArrowUp')}
          ></area>
          <area
            role="none"
            className="left"
            data-testid="left"
            shape="rect"
            coords="0,66,66,133"
            alt="left"
            onClick={() => handleDirection('ArrowLeft')}
          ></area>
          <area
            role="none"
            className="right"
            data-testid="right"
            shape="rect"
            coords="133,66,200,133"
            alt="right"
            onClick={() => handleDirection('ArrowRight')}
          ></area>
          <area
            role="none"
            className="down"
            data-testid="down"
            shape="rect"
            coords="66,133,133,200"
            alt="down"
            onClick={() => handleDirection('ArrowDown')}
          ></area>
        </map>
      </div>
    </div>
  );
};

export { Game };
