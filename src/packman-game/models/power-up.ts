class PowerUp {
  public position: { x: number; y: number };

  public radius: number;

  public hasBeenEaten: boolean;

  public rate: number;

  public tileLength: number;

  public constructor(
    { position }: { position: { x: number; y: number } },
    tileLength: number,
  ) {
    this.position = position;
    this.radius = (tileLength * 7) / 20;
    this.hasBeenEaten = false;
    this.rate = -tileLength / 50;
    this.tileLength = tileLength;
  }

  public changeEatenState(): void {
    this.hasBeenEaten = this.hasBeenEaten ? false : true;
  }

  public update(context: CanvasRenderingContext2D): void {
    this.draw(context);
    this.flash();
  }

  public draw(context: CanvasRenderingContext2D): void {
    context.beginPath();
    context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    context.fillStyle = 'white';
    context.fill();
    context.closePath();
  }

  public flash(): void {
    if (
      this.radius <= this.tileLength / 4 ||
      this.radius >= (this.tileLength * 9) / 20
    ) {
      this.rate = -this.rate;
    }
    this.radius += this.rate;
  }
}

export { PowerUp };
