import { Howl } from 'howler';

class PacMan {
  public originalPosition: { x: number; y: number };

  public position: { x: number; y: number };

  public originalVelocity: { x: number; y: number };

  public velocity: { x: number; y: number };

  public tileLength: number;

  public radius: number;

  public speed: number;

  public radians: number;

  public openRate: number;

  public shrinkRate: number;

  public rotation: number;

  public lives: number;

  public isEating: boolean;

  public isShrinking: boolean;

  public isLevellingUp: boolean;

  public munchOne: Howl;

  public munchTwo: Howl;

  public constructor(
    {
      position,
      velocity,
    }: {
      position: { x: number; y: number };
      velocity: { x: number; y: number };
    },
    tileLength: number,
    {
      munchOne = new Howl({
        src: '/audio/munch_one.wav',
        volume: 0.1,
      }),
      munchTwo = new Howl({
        src: '/audio/munch_two.wav',
        volume: 0.1,
      }),
    }: { munchOne?: Howl; munchTwo?: Howl },
  ) {
    this.originalPosition = position;
    this.position = { ...this.originalPosition };
    this.originalVelocity = velocity;
    this.velocity = { ...this.originalVelocity };
    this.tileLength = tileLength;
    this.radius = (tileLength * 3) / 8;
    this.speed = tileLength / 8;
    this.radians = Math.PI / 4;
    this.openRate = Math.PI / 36;
    this.shrinkRate = Math.PI / 220;
    this.rotation = 0;
    this.lives = 2;
    this.isEating = false;
    this.isShrinking = false;
    this.isLevellingUp = false;
    this.munchOne = munchOne;
    this.munchTwo = munchTwo;
  }

  public draw(context: CanvasRenderingContext2D): void {
    context.save();
    context.translate(this.position.x, this.position.y);
    context.rotate(this.rotation);
    context.translate(-this.position.x, -this.position.y);
    context.beginPath();
    context.arc(
      this.position.x,
      this.position.y,
      this.radius * 2,
      this.radians,
      Math.PI * 2 - this.radians,
    );
    context.lineTo(this.position.x - this.tileLength / 4, this.position.y);
    context.fillStyle = 'yellow';
    context.fill();
    context.closePath();
    context.restore();
  }

  public update(context: CanvasRenderingContext2D): void {
    this.checkRotation();
    this.draw(context);
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.velocity.x !== 0 || this.velocity.y !== 0) {
      this.chomp();
    } else {
      this.radians = Math.PI / 4;
    }
  }

  public chomp(): void {
    if (this.radians < Math.PI / 36 || this.radians > Math.PI / 4) {
      if (this.isEating) {
        this.openRate < 0 ? this.munchOne.play() : this.munchTwo.play();
      }
      this.openRate = -this.openRate;
    }
    this.radians += this.openRate;
  }

  public checkRotation(): void {
    if (this.velocity.x > 0) {
      this.rotation = 0;
    } else if (this.velocity.x < 0) {
      this.rotation = Math.PI;
    } else if (this.velocity.y > 0) {
      this.rotation = Math.PI / 2;
    } else if (this.velocity.y < 0) {
      this.rotation = (Math.PI * 3) / 2;
    }
  }

  public shrink(context: CanvasRenderingContext2D): void {
    this.draw(context);
    this.radians += this.shrinkRate;
  }

  public reset(): void {
    this.position = { ...this.originalPosition };
    this.velocity = { ...this.originalVelocity };
    this.radians = Math.PI / 4;
    this.openRate = Math.PI / 36;
    this.rotation = 0;
  }
}

export { PacMan };
