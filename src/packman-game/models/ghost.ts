import { type GhostDataType } from '../config/types.ts';

import { type RetreatingTimer } from './retreating-timer.ts';

class Ghost {
  public originalPosition: GhostDataType['position'];

  public position: GhostDataType['position'];

  public originalVelocity: GhostDataType['velocity'];

  public velocity: GhostDataType['velocity'];

  public tileLength: number;

  public radius: number;

  public colour: string;

  public prevCollisions: string[];

  public speed: number;

  public isScared: boolean;

  public isChasing: boolean;

  public isRetreating: boolean;

  public retreatingTimer: null | RetreatingTimer;

  public image: HTMLImageElement;

  public up: HTMLImageElement;

  public left: HTMLImageElement;

  public right: HTMLImageElement;

  public down: HTMLImageElement;

  public scaredBlue: HTMLImageElement;

  public eyesUp: HTMLImageElement;

  public eyesLeft: HTMLImageElement;

  public eyesRight: HTMLImageElement;

  public eyesDown: HTMLImageElement;

  public constructor(
    { position, velocity, colour }: GhostDataType,
    tileLength: number,
  ) {
    this.originalPosition = position;
    this.position = { ...this.originalPosition };
    this.originalVelocity = velocity;
    this.velocity = { ...this.originalVelocity };
    this.tileLength = tileLength;
    this.radius = (this.tileLength * 3) / 8;
    this.colour = colour;
    this.prevCollisions = [];
    this.speed = this.tileLength / 8;
    this.isScared = false;
    this.isChasing = false;
    this.isRetreating = false;
    this.retreatingTimer = null;
    this.image = new Image();
    this.up = new Image();
    this.up.src = `/images/${this.colour}-ghost-up.png`;
    this.left = new Image();
    this.left.src = `/images/${this.colour}-ghost-left.png`;
    this.right = new Image();
    this.right.src = `/images/${this.colour}-ghost-right.png`;
    this.down = new Image();
    this.down.src = `/images/${this.colour}-ghost-down.png`;
    this.scaredBlue = new Image();
    this.scaredBlue.src = '/images/scared-ghost-blue.png';
    this.eyesUp = new Image();
    this.eyesUp.src = '/images/eyes-up.png';
    this.eyesLeft = new Image();
    this.eyesLeft.src = '/images/eyes-left.png';
    this.eyesRight = new Image();
    this.eyesRight.src = './images/eyes-right.png';
    this.eyesDown = new Image();
    this.eyesDown.src = '/images/eyes-down.png';
  }

  public draw(context: CanvasRenderingContext2D): void {
    context.drawImage(
      this.image,
      this.position.x - this.radius * 2,
      this.position.y - this.radius * 2,
    );
  }

  public update(context: CanvasRenderingContext2D): void {
    this.draw(context);
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }

  public changeScaredState(): void {
    this.isScared = this.isScared ? false : true;
  }

  public changeChasingState(): void {
    this.isChasing = this.isChasing ? false : true;
  }

  public changeRetreatingState(): void {
    this.isRetreating = this.isRetreating ? false : true;
  }

  public reset(): void {
    this.position = { ...this.originalPosition };
    this.velocity = { ...this.originalVelocity };
    this.speed = this.tileLength / 8;
    this.prevCollisions = [];
    this.resetStates();
    this.assignSprite();
  }

  public assignSprite(): void {
    if (this.isRetreating) {
      this.assignRetreatingSprite();
    } else if (this.isScared) {
      this.assignScaredSprite();
    } else {
      this.assignRegularSprite();
    }
  }

  public checkSpeedMatchesState(): void {
    if (this.isScared && this.speed === this.tileLength / 8) {
      // this.adjustPosition();
      // this.velocity.x /= 2;
      // this.velocity.y /= 2;
      // this.speed /= 2;
      this.callback(false, 2);
    } else if (this.isRetreating && this.speed === this.tileLength / 16) {
      // this.adjustPosition();
      // this.velocity.x *= 4;
      // this.velocity.y *= 4;
      // this.speed *= 4;
      this.callback(true, 4);
    } else if (!this.isScared && this.speed === this.tileLength / 16) {
      // this.adjustPosition();
      // this.velocity.x *= 2;
      // this.velocity.y *= 2;
      // this.speed *= 2;
      this.callback(true, 2);
    } else if (!this.isRetreating && this.speed === this.tileLength / 4) {
      // this.adjustPosition();
      // this.velocity.x /= 2;
      // this.velocity.y /= 2;
      // this.speed /= 2;
      this.callback(false, 2);
    }
  }

  public adjustPosition(): void {
    if (this.isRetreating) {
      this.shiftBeforeRetreating();
    } else {
      this.shiftRegular();
    }
  }

  public shiftBeforeRetreating(): void {
    if (this.velocity.x > 0) {
      this.shiftLeft();
    } else if (this.velocity.x < 0) {
      this.shiftRight();
    }

    if (this.velocity.y > 0) {
      this.shiftUp();
    } else if (this.velocity.y < 0) {
      this.shiftDown();
    }
  }

  public shiftRegular(): void {
    if (this.position.x % 4 !== 0) {
      this.position.x += 2;
    }

    if (this.position.y % 4 !== 0) {
      this.position.y += 2;
    }
  }

  public shiftLeft(): void {
    if (this.position.x % 8 === 2) {
      this.position.x -= 2;
    } else if (this.position.x % 8 === 4) {
      this.position.x -= 4;
    } else if (this.position.x % 8 === 6) {
      this.position.x -= 6;
    }
  }

  public shiftRight(): void {
    if (this.position.x % 8 === 2) {
      this.position.x += 6;
    } else if (this.position.x % 8 === 4) {
      this.position.x += 4;
    } else if (this.position.x % 8 === 6) {
      this.position.x += 2;
    }
  }

  public shiftUp(): void {
    if (this.position.y % 8 === 2) {
      this.position.y -= 2;
    } else if (this.position.y % 8 === 4) {
      this.position.y -= 4;
    } else if (this.position.y % 8 === 6) {
      this.position.y -= 6;
    }
  }

  public shiftDown(): void {
    if (this.position.y % 8 === 2) {
      this.position.y += 6;
    } else if (this.position.y % 8 === 4) {
      this.position.y += 4;
    } else if (this.position.y % 8 === 6) {
      this.position.y += 2;
    }
  }

  // private

  private callback(isMul: boolean, cof: number): void {
    this.adjustPosition();

    if (isMul) {
      this.velocity.x *= cof;
      this.velocity.y *= cof;
      this.speed *= cof;
    } else {
      this.velocity.x /= cof;
      this.velocity.y /= cof;
      this.speed /= cof;
    }
  }

  private resetStates(): void {
    if (this.isScared) {
      this.changeScaredState();
    }

    if (this.isChasing) {
      this.changeChasingState();
    }

    if (this.retreatingTimer) {
      this.retreatingTimer.reset();
    }

    if (this.isRetreating) {
      this.changeRetreatingState();
    }
  }

  private assignRetreatingSprite(): void {
    if (this.velocity.y < 0) {
      this.image = this.eyesUp;
    } else if (this.velocity.x < 0) {
      this.image = this.eyesLeft;
    } else if (this.velocity.x > 0) {
      this.image = this.eyesRight;
    } else if (this.velocity.y > 0) {
      this.image = this.eyesDown;
    }
  }

  private assignScaredSprite(): void {
    this.image = this.scaredBlue;
  }

  private assignRegularSprite(): void {
    if (this.velocity.y < 0) {
      this.image = this.up;
    } else if (this.velocity.x < 0) {
      this.image = this.left;
    } else if (this.velocity.x > 0) {
      this.image = this.right;
    } else if (this.velocity.y > 0) {
      this.image = this.down;
    }
  }
}

export { Ghost };
