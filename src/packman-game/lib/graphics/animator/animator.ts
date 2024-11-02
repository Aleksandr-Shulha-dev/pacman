import {
  type FactoryAssetsType,
  type GlobalVariablesType,
} from '../../../config/types.ts';
import { playGame } from '../../../mechanics/play-game.ts';
import { type Boundary } from '../../../models/boundary.ts';
import { Graphics } from '../graphics.ts';

interface AnimatorType {
  loadPauseOverlay: (
    context: CanvasRenderingContext2D,
    pauseTextImage: HTMLImageElement,
    methods: {
      loadTint?: (context: CanvasRenderingContext2D) => void;
      loadPauseText?: (
        context: CanvasRenderingContext2D,
        pauseTextImage: HTMLImageElement,
      ) => void;
    },
  ) => void;
  loadTint: (context: CanvasRenderingContext2D) => void;
  loadPauseText: (
    context: CanvasRenderingContext2D,
    pauseTextImage: HTMLImageElement,
  ) => void;
  resumeAnimation: (
    arguments_: {
      variables: GlobalVariablesType;
      context: CanvasRenderingContext2D;
      assets: FactoryAssetsType;
    },
    callback?: (player: number, reactRoot: Element) => void,
  ) => void;
  drawLevelUpBoard: (
    context: CanvasRenderingContext2D,
    boundaries: Boundary[],
  ) => void;
  drawBoard: (
    context: CanvasRenderingContext2D,
    assets: FactoryAssetsType,
  ) => void;
  displayPleaseWait: (
    context: CanvasRenderingContext2D,
    loadTint?: (context: CanvasRenderingContext2D) => void,
  ) => void;
}

const Animator: AnimatorType = {
  loadPauseOverlay(
    context,
    pauseTextImage,
    { loadTint = Animator.loadTint, loadPauseText = Animator.loadPauseText },
  ) {
    loadTint(context);
    loadPauseText(context, pauseTextImage);
  },

  loadTint(context) {
    context.globalAlpha = 0.7;
    context.fillStyle = 'black';
    context.fillRect(0, 0, 896, 992);
  },

  loadPauseText(context, pauseTextImage) {
    context.globalAlpha = 1;
    context.drawImage(pauseTextImage, 98, 394, 700, 140);
  },

  resumeAnimation({ variables, context, assets }, callback = playGame) {
    if (assets.characters.pacman.isShrinking) {
      Graphics.runDeathAnimation(variables, context, assets);
    } else if (assets.characters.pacman.isLevellingUp) {
      Graphics.runLevelUpAnimation(variables, assets, context);
    } else {
      callback(variables.player as number, variables.reactRoot as Element);
    }
  },

  drawLevelUpBoard(context, boundaries) {
    context.clearRect(0, 0, 896, 992);
    for (const boundary of boundaries) {
      boundary.draw(context);
    }
    context.font = '40px Arial';
    context.fillStyle = 'yellow';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('Level Up!', 448, 560);
  },

  drawBoard(context, assets) {
    context.clearRect(0, 0, 896, 992);
    for (const boundary of assets.props.boundaries) {
      boundary.draw(context);
    }
    for (const pellet of assets.props.pellets) {
      if (!pellet.hasBeenEaten) {
        pellet.draw(context);
      }
    }
    for (const powerUp of assets.props.powerUps) {
      if (!powerUp.hasBeenEaten) {
        powerUp.update(context);
      }
    }
  },

  displayPleaseWait(context, loadTint = Animator.loadTint) {
    loadTint(context);
    context.globalAlpha = 1;
    context.font = '100px Arial';
    context.fillStyle = 'white';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('Please wait...', 448, 496);
  },
};

export { Animator };
