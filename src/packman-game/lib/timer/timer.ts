import { type FactoryAssetsTimersType } from '../../config/types.ts';

const Timer = {
  pauseTimers(timers: FactoryAssetsTimersType): void {
    if (timers.scaredTimer.isRunning) {
      timers.scaredTimer.pause();
    } else {
      timers.cycleTimer.pause();
    }
    for (const timer of timers.retreatingTimers) {
      if (timer.isRunning) {
        timer.pause();
      }
    }
  },

  resumeTimers(timers: FactoryAssetsTimersType): void {
    if (timers.scaredTimer.isRunning) {
      timers.scaredTimer.resume(timers.cycleTimer);
    } else {
      timers.cycleTimer.resume();
    }
    for (const timer of timers.retreatingTimers) {
      if (timer.isRunning) {
        timer.resume();
      }
    }
  },
};

export { Timer };
