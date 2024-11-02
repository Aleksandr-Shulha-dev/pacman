class Pellet {
  public position: { x: number; y: number };

  public radius: number;

  public hasBeenEaten: boolean;

  public constructor(
    { position }: { position: { x: number; y: number } },
    tileLength: number,
  ) {
    this.position = position;
    this.radius = tileLength / 10;
    this.hasBeenEaten = false;
  }

  public changeEatenState(): void {
    this.hasBeenEaten = this.hasBeenEaten ? false : true;
  }

  public draw(context: CanvasRenderingContext2D): void {
    context.beginPath();
    context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    context.fillStyle = 'white';
    context.fill();
    context.closePath();
  }
}

export { Pellet };
