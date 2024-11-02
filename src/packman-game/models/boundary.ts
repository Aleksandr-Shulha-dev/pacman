interface BoundaryArgumentType {
  position: {
    x: number;
    y: number;
  };
  regularImage: HTMLImageElement;
  whiteImage: HTMLImageElement;
}

class Boundary {
  public position: {
    x: number;
    y: number;
  };

  public width: number;

  public height: number;

  public regularImage: HTMLImageElement;

  public whiteImage: HTMLImageElement;

  public image: HTMLImageElement;

  public constructor(
    { position, regularImage, whiteImage }: BoundaryArgumentType,
    tileLength: number,
  ) {
    this.position = position;
    this.width = tileLength;
    this.height = tileLength;
    this.regularImage = regularImage;
    this.whiteImage = whiteImage;
    this.image = regularImage;
  }

  public draw(context: CanvasRenderingContext2D): void {
    context.drawImage(this.image, this.position.x, this.position.y);
  }

  public flash(): void {
    const imageSource = this.image.src;
    this.image = imageSource.includes('white')
      ? this.regularImage
      : this.whiteImage;
  }
}

export { Boundary };
