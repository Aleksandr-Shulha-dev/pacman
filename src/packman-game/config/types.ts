import { type AudioPlayer } from '../models/audio-player.ts';
import { type Boundary } from '../models/boundary.ts';
import { type CycleTimer } from '../models/cycle-timer.ts';
import { type Ghost } from '../models/ghost.ts';
import { type PacMan } from '../models/pacman.ts';
import { type Pellet } from '../models/pellet.ts';
import { type PowerUp } from '../models/power-up.ts';
import { type RetreatingTimer } from '../models/retreating-timer.ts';
import { type ScaredTimer } from '../models/scared-timer.ts';

interface GlobalVariablesType {
  tileLength: number;
  isWindowVisible: boolean;
  isGamePaused: boolean;
  score: number;
  lastKeyPressed: string;
  level: number;
  player?: number;
  reactRoot: null | Element;
  killCount: number;
  start: boolean;
  animationId: null | number;
  directionEventListener: ((event: KeyboardEvent) => void) | null;
  visibilityEventListener: EventListenerOrEventListenerObject | null;
  pauseEventListener: ((event: KeyboardEvent) => void) | null;
  levelUpCount: number;
  frameLifetime: number;
  startTime: number;
}

interface TunnelDataType {
  position: { x: number; y: number };
}

interface FactoryAssetsTimersType {
  cycleTimer: CycleTimer;
  scaredTimer: ScaredTimer;
  retreatingTimers: RetreatingTimer[];
}

interface GhostDataType {
  colour: string;
  position: { x: number; y: number };
  velocity: { x: number; y: number };
}

interface FactoryAssetsType {
  props: {
    boundaries: Boundary[];
    pellets: Pellet[];
    powerUps: PowerUp[];
  };
  characters: {
    ghosts: Record<string, Ghost>;
    pacman: PacMan;
  };
  timers: FactoryAssetsTimersType;
  audioPlayer: AudioPlayer;
  pauseTextImage: HTMLImageElement;
}

interface FactoryMethodsType {
  makeGhosts: (variables: GlobalVariablesType) => Record<string, Ghost>;
  makePacman: (variables: GlobalVariablesType) => PacMan;
  makeCycleTimer: (ghosts: Record<string, Ghost>) => CycleTimer;
  makeScaredTimer: (ghosts: Record<string, Ghost>) => ScaredTimer;
  makeRetreatingTimers: (ghosts: Record<string, Ghost>) => RetreatingTimer[];
  makeBoundaries: (
    map: string[][],
    variables: GlobalVariablesType,
    makeTunnelBoundaries?: (
      boundaries: Boundary[],
      variables: GlobalVariablesType,
    ) => void,
  ) => Boundary[];
  makePellets: (map: string[][], variables: GlobalVariablesType) => Pellet[];
  makePowerUps: (map: string[][], variables: GlobalVariablesType) => PowerUp[];
  makeAudioPlayer: () => AudioPlayer;
  makePauseTextImage: () => HTMLImageElement;
}

interface FactoryType extends FactoryMethodsType {
  PIPE_NAMES: Record<string, string>;
  TUNNEL_DATA: TunnelDataType[];
  GHOST_DATA: GhostDataType[];
  makeAssets: (
    map: string[][],
    variables: GlobalVariablesType,
    methods: Partial<FactoryMethodsType>,
  ) => FactoryAssetsType;

  makeTunnelBoundaries: (
    boundaries: Boundary[],
    variables: GlobalVariablesType,
  ) => void;
}

interface PathwayType {
  direction: string;
  position?: {
    x: number;
    y: number;
  };
  distance?: number;
}

export {
  type FactoryAssetsTimersType,
  type FactoryAssetsType,
  type FactoryType,
  type GhostDataType,
  type GlobalVariablesType,
  type PathwayType,
};
