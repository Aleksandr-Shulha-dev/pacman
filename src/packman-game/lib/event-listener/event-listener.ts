import {
  type FactoryAssetsType,
  type GlobalVariablesType,
} from '../../config/types.ts';
import { AudioManager } from '../audio/audio-manager.ts';
import { Animator } from '../graphics/animator/animator.ts';
import { Timer } from '../timer/timer.ts';

const EventListener = {
  addDirectionDetection(variables: GlobalVariablesType): void {
    window.addEventListener(
      'keydown',
      (variables.directionEventListener = ({ key }): void => {
        switch (key) {
          case 'ArrowUp': {
            variables.lastKeyPressed = 'up';

            break;
          }
          case 'ArrowLeft': {
            variables.lastKeyPressed = 'left';

            break;
          }
          case 'ArrowRight': {
            variables.lastKeyPressed = 'right';

            break;
          }
          case 'ArrowDown': {
            variables.lastKeyPressed = 'down';

            break;
          }
          // No default
        }
      }),
    );
  },

  addVisibilityDetection(
    variables: GlobalVariablesType,
    assets: FactoryAssetsType,
  ): void {
    window.addEventListener(
      'visibilitychange',
      (variables.visibilityEventListener = (): void => {
        if (!variables.isGamePaused && variables.isWindowVisible) {
          variables.isWindowVisible = false;
          AudioManager.pauseAudio(assets.audioPlayer);
          Timer.pauseTimers(assets.timers);
        } else if (!variables.isGamePaused && !variables.isWindowVisible) {
          variables.isWindowVisible = true;
          AudioManager.resumeAudio(assets.audioPlayer);
          Timer.resumeTimers(assets.timers);
        }
      }),
    );
  },

  addPauseDetection(
    variables: GlobalVariablesType,
    assets: FactoryAssetsType,
    context: CanvasRenderingContext2D,
  ): void {
    window.addEventListener(
      'keydown',
      (variables.pauseEventListener = ({ key }): void => {
        if (key === 'Escape') {
          if (variables.isGamePaused) {
            variables.isGamePaused = false;
            AudioManager.resumeAudio(assets.audioPlayer);
            Timer.resumeTimers(assets.timers);
            Animator.resumeAnimation({ variables, context, assets });
          } else {
            variables.isGamePaused = true;
            cancelAnimationFrame(variables.animationId as number);
            AudioManager.pauseAudio(assets.audioPlayer);
            Timer.pauseTimers(assets.timers);
            Animator.loadPauseOverlay(context, assets.pauseTextImage, {});
          }
        }
      }),
    );
  },
};

export { EventListener };
