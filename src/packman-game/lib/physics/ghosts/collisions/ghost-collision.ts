import {
  type FactoryAssetsType,
  type GlobalVariablesType,
} from '../../../../config/types.ts';
import { playGame } from '../../../../mechanics/play-game.ts';
import { type Ghost } from '../../../../models/ghost.ts';
import { type PacMan } from '../../../../models/pacman.ts';
import { Animator } from '../../../graphics/animator/animator.ts';
import { Graphics } from '../../../graphics/graphics.ts';

interface GhostCollisionType {
  collisionConditional: (ghost: Ghost, pacman: PacMan) => boolean;
  dealWithCollision: (arguments_: {
    ghost: Ghost;
    assets: FactoryAssetsType;
    variables: GlobalVariablesType;
    context: CanvasRenderingContext2D;
  }) => void;
  checkPacmanLives(
    assets: FactoryAssetsType,
    variables: GlobalVariablesType,
    context: CanvasRenderingContext2D,
  ): void;
  endGame: (
    variables: GlobalVariablesType,
    assets: FactoryAssetsType,
    context: CanvasRenderingContext2D,
  ) => void;
  resetAfterGameOver: (
    assets: FactoryAssetsType,
    variables: GlobalVariablesType,
  ) => void;
  resetAfterDeath: (
    assets: FactoryAssetsType,
    variables: GlobalVariablesType,
    callbackOne?: (player: number, reactRoot: Element) => void,
  ) => void;
}

const GhostCollision: GhostCollisionType = {
  collisionConditional(ghost, pacman) {
    return (
      ghost.position.y - ghost.radius <= pacman.position.y + pacman.radius &&
      ghost.position.y + ghost.radius >= pacman.position.y - pacman.radius &&
      ghost.position.x + ghost.radius >= pacman.position.x - pacman.radius &&
      ghost.position.x - ghost.radius <= pacman.position.x + pacman.radius
    );
  },

  dealWithCollision({ ghost, assets, variables, context }): void {
    if (!ghost.isScared && !ghost.isRetreating) {
      assets.characters.pacman.radians = Math.PI / 4;
      cancelAnimationFrame(variables.animationId as number);
      assets.audioPlayer.stopGhostAudio();
      assets.audioPlayer.playPacmanDeath();
      assets.characters.pacman.isShrinking = true;
      Graphics.runDeathAnimation(variables, context, assets);
    } else if (ghost.isScared) {
      variables.score += 200 * Math.pow(2, variables.killCount);
      variables.killCount++;
      ghost.changeRetreatingState();

      if (ghost.retreatingTimer) {
        ghost.retreatingTimer.start();
      }
      ghost.changeScaredState();
      ghost.assignSprite();
      ghost.checkSpeedMatchesState();
    }
  },

  checkPacmanLives(assets, variables, context) {
    if (assets.characters.pacman.lives <= 0) {
      GhostCollision.endGame(variables, assets, context);
    } else {
      assets.characters.pacman.lives--;
      GhostCollision.resetAfterDeath(assets, variables);
    }
  },

  endGame(
    variables: GlobalVariablesType,
    assets: FactoryAssetsType,
    context: CanvasRenderingContext2D,
  ) {
    cancelAnimationFrame(variables.animationId as number);
    Animator.displayPleaseWait(context);

    // if (variables.player) {await GhostCollision.saveScore(variables);}
    GhostCollision.resetAfterGameOver(assets, variables);
    //variables.reactRoot.render(<Leaderboard variables={variables} />);
  },

  // async saveScore(
  //   variables,
  //   getBackendUrl = GhostCollision.getBackendUrl,
  // ) {
  //   const data = {
  //     username: variables.player.username,
  //     points: variables.score,
  //   };

  //   try {
  //     const res = await axios.post(
  //       GhostCollision.getBackendUrl(process.env.REACT_APP_BACKEND_URL),
  //       data,
  //       {
  //         headers: {
  //           Authorization: localStorage.getItem('token'),
  //         },
  //       },
  //     );

  //     return `Success: ${res.data.message}`;
  //   } catch (error) {
  //     return `Error: ${error.response.data.message}`;
  //   }
  // },

  // getBackendUrl(reactAppUrl) {
  //   let url;

  //   url = reactAppUrl ? `${reactAppUrl}/scores` : 'http://localhost:8080/scores';

  //   return url;
  // },

  resetAfterGameOver(assets, variables) {
    for (const pellet of assets.props.pellets) {
      if (pellet.hasBeenEaten) {
        pellet.changeEatenState();
      }
    }
    for (const powerUp of assets.props.powerUps) {
      if (powerUp.hasBeenEaten) {
        powerUp.changeEatenState();
      }
    }
    assets.timers.cycleTimer.reset();
    assets.timers.scaredTimer.reset();
    assets.timers.scaredTimer.duration = 7000;
    for (const ghost of Object.values(assets.characters.ghosts)) {
      ghost.reset();
    }
    assets.characters.pacman.reset();
    assets.characters.pacman.lives = 2;
    variables.lastKeyPressed = '';
    variables.level = 1;

    if (variables.directionEventListener) {
      window.removeEventListener('keydown', variables.directionEventListener);
    }

    if (variables.visibilityEventListener) {
      window.removeEventListener(
        'visibilitychange',
        variables.visibilityEventListener,
      );
    }

    if (variables.pauseEventListener) {
      window.removeEventListener('keydown', variables.pauseEventListener);
    }
  },

  resetAfterDeath(assets, variables, callbackOne = playGame) {
    assets.characters.pacman.reset();
    variables.lastKeyPressed = '';
    assets.timers.cycleTimer.reset();
    assets.timers.scaredTimer.reset();
    for (const ghost of Object.values(assets.characters.ghosts)) {
      ghost.reset();
    }
    assets.timers.cycleTimer.start();
    assets.audioPlayer.ghostAudioWantsToPlay = true;
    callbackOne(variables.player as number, variables.reactRoot as Element);
  },
};

export { GhostCollision };
