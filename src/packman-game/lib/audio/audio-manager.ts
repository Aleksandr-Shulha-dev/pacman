import { type FactoryAssetsType } from '../../config/types.ts';
import { type AudioPlayer } from '../../models/audio-player.ts';

const AudioManager = {
  playGhostAudio(assets: FactoryAssetsType): void {
    let count = 0;
    const timers = assets.timers;
    const audioPlayer = assets.audioPlayer;
    for (const timer of timers.retreatingTimers) {
      if (timer.isRunning) {
        count++;
      }
    }

    if (count > 0) {
      if (!audioPlayer.ghostRetreating.playing()) {
        audioPlayer.playGhostRetreating();
      }
    } else if (
      timers.scaredTimer.isRunning &&
      !audioPlayer.ghostScared.playing()
    ) {
      audioPlayer.playGhostScared();
    } else if (
      !timers.scaredTimer.isRunning &&
      !audioPlayer.ghostSiren.playing()
    ) {
      audioPlayer.playGhostSiren();
    }
  },

  pauseAudio(audioPlayer: AudioPlayer): void {
    audioPlayer.pauseAll();
  },

  resumeAudio(audioPlayer: AudioPlayer): void {
    audioPlayer.playPacmanDeathAndLevelUpIfWantTo();
  },
};

export { AudioManager };
