import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { Game } from './packman-game/game.tsx';

import './index.scss';

const root = document.querySelector('#root');

if (root) {
  createRoot(root).render(
    <StrictMode>
      <Game />
    </StrictMode>,
  );
}
