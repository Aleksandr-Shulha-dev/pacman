import { type Ghost } from './ghost.ts';

class RetreatingTimer {
  public timeout: undefined | NodeJS.Timeout;

  public ghost: Ghost;

  public startTime: null | number;

  public timeRemaining: null | number;

  public isRunning: boolean;

  public constructor(ghost: Ghost) {
    this.timeout = undefined;
    this.ghost = ghost;
    this.startTime = null;
    this.timeRemaining = null;
    this.isRunning = false;
  }

  public start(dateNow = Date.now()): void {
    this.startTime = dateNow;
    this.timeout = setTimeout(() => {
      this.ghost.changeRetreatingState();
      this.ghost.assignSprite();
      this.ghost.checkSpeedMatchesState();
      this.isRunning = false;
    }, 3000);
    this.timeRemaining = 3000;
    this.isRunning = true;
  }

  public pause(dateNow = Date.now()): void {
    clearTimeout(this.timeout);
    const timeElapsed = dateNow - (this.startTime as number);
    this.timeRemaining = (this.timeRemaining as number) - timeElapsed;
  }

  public resume(dateNow = Date.now()): void {
    this.startTime = dateNow;
    this.timeout = setTimeout(() => {
      this.ghost.changeRetreatingState();
      this.ghost.assignSprite();
      this.ghost.checkSpeedMatchesState();
      this.isRunning = false;
    }, this.timeRemaining as number);
  }

  public reset(): void {
    clearTimeout(this.timeout);
    this.isRunning = false;
  }
}

export { RetreatingTimer };
