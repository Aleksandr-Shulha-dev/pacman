import { type Ghost } from './ghost.ts';

class CycleTimer {
  public timeout: undefined | NodeJS.Timeout;

  public ghosts: Ghost[];

  public count: number;

  public startTime: null | number;

  public timeRemaining: null | number;

  public isRunning: boolean;

  public constructor(ghosts: Ghost[]) {
    this.ghosts = ghosts;
    this.count = 0;
    this.startTime = null;
    this.timeRemaining = null;
    this.isRunning = false;
  }

  public start(dateNow = Date.now()): void {
    this.startTime = dateNow;
    this.timeout = setTimeout(
      () => {
        this.switchChaseScatterState();
      },
      this.count === 0 ? 7000 : 20_000,
    );

    if (this.count === 0) {
      this.count++;
      this.timeRemaining = 7000;
    } else {
      this.count--;
      this.timeRemaining = 20_000;
    }
    this.isRunning = true;
  }

  public pause(dateNow = Date.now()): void {
    clearTimeout(this.timeout);
    const timeElapsed = dateNow - (this.startTime as number);
    this.timeRemaining = (this.timeRemaining as number) - timeElapsed;
    this.isRunning = false;
  }

  public resume(dateNow = Date.now()): void {
    this.startTime = dateNow;
    this.timeout = setTimeout(() => {
      this.switchChaseScatterState();
    }, this.timeRemaining as number);
    this.isRunning = true;
  }

  public reset(): void {
    clearTimeout(this.timeout);
    this.count = 0;
    this.isRunning = false;
  }

  // private

  private switchChaseScatterState(): void {
    for (const ghost of this.ghosts) {
      ghost.changeChasingState();
    }
    this.carryOnCycle();
  }

  private carryOnCycle(): void {
    this.start();
  }
}

export { CycleTimer };
