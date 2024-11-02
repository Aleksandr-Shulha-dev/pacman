import {
  type FactoryAssetsType,
  type GlobalVariablesType,
} from '../../../config/types.ts';
import { type PowerUp } from '../../../models/power-up.ts';

interface PowerUpManagerType {
  eatPowerUp: (
    powerUp: PowerUp,
    assets: FactoryAssetsType,
    variables: GlobalVariablesType,
  ) => void;
  scareGhosts: (assets: FactoryAssetsType) => void;
}

const PowerUpManager: PowerUpManagerType = {
  eatPowerUp(powerUp, assets, variables) {
    if (
      powerUp.position.x === assets.characters.pacman.position.x &&
      powerUp.position.y === assets.characters.pacman.position.y
    ) {
      powerUp.changeEatenState();
      variables.score += 50;
      variables.killCount = 0;
      PowerUpManager.scareGhosts(assets);
    }
  },

  scareGhosts(assets) {
    if (assets.timers.cycleTimer.isRunning) {
      assets.timers.cycleTimer.pause();
    }
    assets.timers.scaredTimer.reset();
    for (const ghost of Object.values(assets.characters.ghosts)) {
      if (!ghost.isScared && !ghost.isRetreating) {
        ghost.changeScaredState();
        ghost.assignSprite();
        ghost.checkSpeedMatchesState();
      }
    }
    assets.timers.scaredTimer.start(assets.timers.cycleTimer);
  },
};

export { PowerUpManager };
