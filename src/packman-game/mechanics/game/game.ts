import {
  type FactoryAssetsType,
  type GlobalVariablesType,
} from '../../config/types.ts';
import { AudioManager } from '../../lib/audio/audio-manager.ts';
import { EventListener } from '../../lib/event-listener/event-listener.ts';
import { Graphics } from '../../lib/graphics/graphics.ts';
import { Physics } from '../../lib/physics/physics.ts';
import { type PacMan } from '../../models/pacman.ts';

interface GameUtilType {
  finishSetup: (arguments_: {
    variables: GlobalVariablesType;
    reactRoot: Element | null;
    assets: FactoryAssetsType;
    context: CanvasRenderingContext2D;
  }) => void;
  implementPhysics: (
    assets: FactoryAssetsType,
    context: CanvasRenderingContext2D,
    variables: GlobalVariablesType,
  ) => void;
  implementGraphics: (variables: GlobalVariablesType, packman: PacMan) => void;
  manageGhostAudio: (assets: FactoryAssetsType) => void;
}

const Game: GameUtilType = {
  finishSetup({ variables, reactRoot, assets, context }) {
    variables.reactRoot = reactRoot;
    assets.timers.cycleTimer.start();
    EventListener.addDirectionDetection(variables);
    EventListener.addVisibilityDetection(variables, assets);
    EventListener.addPauseDetection(variables, assets, context);
    variables.start = false;
    assets.audioPlayer.ghostAudioWantsToPlay = true;
    variables.startTime = performance.now();
  },

  implementPhysics(assets, context, variables): void {
    Physics.implementBoundaries(assets, context);
    Physics.implementPellets(assets, context, variables);
    Physics.implementPowerUps(assets, context, variables);
    Physics.implementGhosts(assets, context, variables);
    Physics.implementPacman(variables, assets, context);
  },

  implementGraphics(variables, pacman) {
    const info = document.querySelector('#info') as HTMLCanvasElement;
    const context = info.getContext('2d') as CanvasRenderingContext2D;
    context.clearRect(0, 0, info.width, info.height);
    context.font = '20px microN56';
    context.textBaseline = 'middle';
    Graphics.displayScore(context, variables);
    Graphics.displayLevel(context, variables);
    Graphics.displayLives(context, pacman);
  },

  manageGhostAudio(assets) {
    if (assets.audioPlayer.ghostAudioWantsToPlay) {
      AudioManager.playGhostAudio(assets);
    }
  },
};

export { Game };
