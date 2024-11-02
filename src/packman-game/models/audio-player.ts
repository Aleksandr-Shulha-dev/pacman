import howler from 'howler';

const { Howl } = howler;

class AudioPlayer {
  public ghostSiren: Howl;

  public ghostScared: Howl;

  public ghostRetreating: Howl;

  public ghostAudioWantsToPlay: boolean;

  public pacmanDeath: Howl;

  public levelUp: Howl;

  public constructor({
    ghostSiren = new Howl({
      src: '/audio/siren.wav',
      loop: true,
      volume: 0.1,
    }),
    ghostScared = new Howl({
      src: '/audio/scared.wav',
      loop: true,
      volume: 0.08,
    }),
    ghostRetreating = new Howl({
      src: '/audio/retreating.wav',
      loop: true,
      volume: 0.1,
    }),
    pacmanDeath = new Howl({
      src: '/audio/pacman_death.wav',
      volume: 0.3,
      // wantsToPlay: false,
      // onend: (): void => {
      //   pacmanDeath.wantsToPlay = false;
      // },
    }),
    levelUp = new Howl({
      src: '/audio/level_up.wav',
      volume: 0.2,
      // wantsToPlay: false,
      // onend: (): void => {
      //   levelUp.wantsToPlay = false;
      // },
    }),
  }) {
    this.ghostSiren = ghostSiren;
    this.ghostScared = ghostScared;
    this.ghostRetreating = ghostRetreating;
    this.ghostAudioWantsToPlay = false;
    this.pacmanDeath = pacmanDeath;
    this.levelUp = levelUp;
  }

  public playGhostSiren(): void {
    this.ghostScared.pause();
    this.ghostRetreating.pause();
    this.ghostSiren.play();
  }

  public playGhostScared(): void {
    this.ghostSiren.pause();
    this.ghostRetreating.pause();
    this.ghostScared.play();
  }

  public playGhostRetreating(): void {
    this.ghostSiren.pause();
    this.ghostScared.pause();
    this.ghostRetreating.play();
  }

  public stopGhostAudio(): void {
    this.pauseGhostAudio();
    this.ghostAudioWantsToPlay = false;
  }

  public playPacmanDeath(): void {
    this.pacmanDeath.play();
    // this.pacmanDeath.wantsToPlay = true;
  }

  public playLevelUp(): void {
    this.levelUp.play();
    // this.levelUp.wantsToPlay = true;
  }

  public playPacmanDeathAndLevelUpIfWantTo(): void {
    // if (this.pacmanDeath.wantsToPlay === true) {
    //   this.pacmanDeath.play();
    // }
    // if (this.levelUp.wantsToPlay === true) {
    //   this.levelUp.play();
    // }
  }

  public pauseAll(): void {
    this.pauseGhostAudio();
    this.pacmanDeath.pause();
    this.levelUp.pause();
  }

  // private

  private pauseGhostAudio(): void {
    this.ghostSiren.pause();
    this.ghostScared.pause();
    this.ghostRetreating.pause();
  }
}

export { AudioPlayer };
