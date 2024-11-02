import {
  type FactoryAssetsType,
  type GlobalVariablesType,
} from '../../../config/types.ts';
import { playGame } from '../../../mechanics/play-game.ts';
import { type PacMan } from '../../../models/pacman.ts';
import { type Pellet } from '../../../models/pellet.ts';
import { Graphics } from '../../graphics/graphics.ts';

interface PelletManagerType {
  eatPellet: (
    pellet: Pellet,
    pacman: PacMan,
    variables: GlobalVariablesType,
  ) => void;
  checkLevelUpCondition: (
    assets: FactoryAssetsType,
    variables: GlobalVariablesType,
    context: CanvasRenderingContext2D,
  ) => void;
  resetAfterLevelUp: (
    assets: FactoryAssetsType,
    variables: GlobalVariablesType,
    callback?: (player: number | undefined, reactRoot: Element | null) => void,
  ) => void;
}

const PelletManager: PelletManagerType = {
  eatPellet(pellet, pacman, variables) {
    if (
      pellet.position.x === pacman.position.x &&
      pellet.position.y === pacman.position.y
    ) {
      pellet.changeEatenState();
      variables.score += 10;
    }
  },

  checkLevelUpCondition(assets, variables, context) {
    let eatenPellets = 0;
    for (const pellet of assets.props.pellets) {
      if (pellet.hasBeenEaten) {
        eatenPellets++;
      }

      if (eatenPellets === assets.props.pellets.length) {
        cancelAnimationFrame(variables.animationId as number);
        assets.audioPlayer.stopGhostAudio();
        assets.audioPlayer.playLevelUp();
        assets.characters.pacman.isLevellingUp = true;
        Graphics.runLevelUpAnimation(variables, assets, context);
      }
    }
  },

  resetAfterLevelUp(assets, variables, callback = playGame) {
    assets.characters.pacman.reset();
    variables.lastKeyPressed = '';
    variables.levelUpCount = 0;
    assets.timers.cycleTimer.reset();
    assets.timers.scaredTimer.reset();

    if (assets.timers.scaredTimer.duration > 0) {
      assets.timers.scaredTimer.duration -= 500;
    }
    for (const ghost of Object.values(assets.characters.ghosts)) {
      ghost.reset();
    }
    for (const pellet of assets.props.pellets) {
      pellet.changeEatenState();
    }
    for (const powerUp of assets.props.powerUps) {
      if (powerUp.hasBeenEaten) {
        powerUp.changeEatenState();
      }
    }
    assets.audioPlayer.ghostAudioWantsToPlay = true;
    assets.timers.cycleTimer.start();
    callback(undefined, null);
  },
};

export { PelletManager };
