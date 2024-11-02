import { type CycleTimer } from './cycle-timer.ts';
import { type Ghost } from './ghost.ts';

class ScaredTimer {
  public timeout: undefined | NodeJS.Timeout;

  public ghosts: Ghost[];

  public startTime: null | number;

  public timeRemaining: null | number;

  public isRunning: boolean;

  public duration: number;

  public constructor(ghosts: Ghost[]) {
    this.ghosts = ghosts;
    this.startTime = null;
    this.timeRemaining = null;
    this.isRunning = false;
    this.duration = 7000;
  }

  public start(cycleTimer: CycleTimer, dateNow = Date.now()): void {
    this.startTime = dateNow;
    this.timeout = setTimeout(() => {
      for (const ghost of this.ghosts) {
        if (ghost.isScared) {
          ghost.changeScaredState();
          ghost.assignSprite();
          ghost.checkSpeedMatchesState();
        }
      }
      cycleTimer.resume();
      this.isRunning = false;
    }, this.duration);
    this.timeRemaining = this.duration;
    this.isRunning = true;
  }

  public pause(dateNow = Date.now()): void {
    clearTimeout(this.timeout);
    const timeElapsed = dateNow - (this.startTime as number);
    this.timeRemaining = (this.timeRemaining as number) - timeElapsed;
  }

  public resume(cycleTimer: CycleTimer, dateNow = Date.now()): void {
    this.startTime = dateNow;
    this.timeout = setTimeout(() => {
      for (const ghost of this.ghosts) {
        if (ghost.isScared) {
          ghost.changeScaredState();
          ghost.assignSprite();
          ghost.checkSpeedMatchesState();
        }
      }
      cycleTimer.resume();
      this.isRunning = false;
    }, this.timeRemaining as number);
  }

  public reset(): void {
    clearTimeout(this.timeout);
    this.isRunning = false;
  }
}

export { ScaredTimer };
