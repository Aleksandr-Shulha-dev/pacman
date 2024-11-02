import {
  type FactoryAssetsType,
  type GlobalVariablesType,
} from '../../config/types.ts';
import { type PacMan } from '../../models/pacman.ts';
import { GhostCollision } from '../physics/ghosts/collisions/ghost-collision.ts';
import { PelletManager } from '../physics/pellets/pellet-manager.ts';

import { Animator } from './animator/animator.ts';

interface GraphicsType {
  displayScore: (
    context: CanvasRenderingContext2D,
    variables: GlobalVariablesType,
  ) => void;
  displayLevel: (
    context: CanvasRenderingContext2D,
    variables: GlobalVariablesType,
  ) => void;
  displayLives: (
    context: CanvasRenderingContext2D,
    pacman: PacMan,
    drawPacmanIcon?: (
      context: CanvasRenderingContext2D,
      position: { x: number; y: number },
    ) => void,
  ) => void;

  drawPacmanIcon: (
    context: CanvasRenderingContext2D,
    position: { x: number; y: number },
  ) => void;

  runLevelUpAnimation: (
    variables: GlobalVariablesType,
    assets: FactoryAssetsType,
    context: CanvasRenderingContext2D,
  ) => void;
  runDeathAnimation: (
    variables: GlobalVariablesType,
    context: CanvasRenderingContext2D,
    assets: FactoryAssetsType,
  ) => void;
}

const Graphics: GraphicsType = {
  displayScore(context, variables) {
    context.fillStyle = 'white';
    context.textAlign = 'left';
    context.fillText(`Score: ${variables.score}`, 10, 15);
  },

  displayLevel(context, variables): void {
    context.fillStyle = 'white';
    context.textAlign = 'center';
    context.fillText(`Level ${variables.level}`, 300, 15);
  },

  displayLives(
    context,
    pacman,
    drawPacmanIcon = Graphics.drawPacmanIcon,
  ): void {
    if (pacman.lives >= 1) {
      drawPacmanIcon(context, {
        x: 580,
        y: 15,
      });
    }

    if (pacman.lives >= 2) {
      drawPacmanIcon(context, {
        x: 540,
        y: 15,
      });
    }
  },

  drawPacmanIcon(context, position): void {
    context.beginPath();
    context.arc(position.x, position.y, 15, Math.PI / 4, (Math.PI * 7) / 4);
    context.lineTo(position.x - 5, position.y);
    context.fillStyle = 'yellow';
    context.fill();
    context.closePath();
  },

  runLevelUpAnimation(variables, assets, context) {
    variables.animationId = requestAnimationFrame(() =>
      Graphics.runLevelUpAnimation(variables, assets, context),
    );

    if (performance.now() - variables.startTime >= variables.frameLifetime) {
      Animator.drawLevelUpBoard(context, assets.props.boundaries);

      if (variables.levelUpCount % 10 === 0 && variables.levelUpCount !== 0) {
        for (const boundary of assets.props.boundaries) {
          boundary.flash();
        }
      }
      variables.levelUpCount++;

      if (variables.levelUpCount >= 350) {
        assets.characters.pacman.isLevellingUp = false;
        cancelAnimationFrame(variables.animationId);
        variables.level++;
        PelletManager.resetAfterLevelUp(assets, variables);
      }
      variables.startTime = performance.now();
    }
  },

  runDeathAnimation(variables, context, assets) {
    variables.animationId = requestAnimationFrame(() =>
      Graphics.runDeathAnimation(variables, context, assets),
    );

    if (performance.now() - variables.startTime >= variables.frameLifetime) {
      Animator.drawBoard(context, assets);
      const pacman = assets.characters.pacman;

      if (pacman.radians < Math.PI) {
        pacman.shrink(context);
      } else {
        pacman.isShrinking = false;
        cancelAnimationFrame(variables.animationId);
        GhostCollision.checkPacmanLives(assets, variables, context);
      }
      variables.startTime = performance.now();
    }
  },
};

export { Graphics };
