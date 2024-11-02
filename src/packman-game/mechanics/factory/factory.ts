import { type FactoryType } from '../../config/types.ts';
import { AudioPlayer } from '../../models/audio-player.ts';
import { Boundary } from '../../models/boundary.ts';
import { CycleTimer } from '../../models/cycle-timer.ts';
import { Ghost } from '../../models/ghost.ts';
import { PacMan } from '../../models/pacman.ts';
import { Pellet } from '../../models/pellet.ts';
import { PowerUp } from '../../models/power-up.ts';
import { RetreatingTimer } from '../../models/retreating-timer.ts';
import { ScaredTimer } from '../../models/scared-timer.ts';

const Factory: FactoryType = {
  PIPE_NAMES: {
    '-': 'horizontal',
    '|': 'vertical',
    1: 'corner-one',
    2: 'corner-two',
    3: 'corner-three',
    4: 'corner-four',
  },

  TUNNEL_DATA: [
    { position: { x: -1, y: 13 } },
    { position: { x: -1, y: 15 } },
    { position: { x: 28, y: 13 } },
    { position: { x: 28, y: 15 } },
  ],

  GHOST_DATA: [
    {
      colour: 'red',
      position: { x: 31, y: 23 },
      velocity: { x: 0, y: -1 / 8 },
    },
    {
      colour: 'pink',
      position: { x: 25, y: 23 },
      velocity: { x: 0, y: -1 / 8 },
    },
    {
      colour: 'cyan',
      position: { x: 37, y: 29 },
      velocity: { x: 1 / 8, y: 0 },
    },
    {
      colour: 'orange',
      position: { x: 19, y: 29 },
      velocity: { x: -1 / 8, y: 0 },
    },
  ],

  makeAssets(
    map,
    variables,
    {
      makeGhosts = Factory.makeGhosts,
      makePacman = Factory.makePacman,
      makeCycleTimer = Factory.makeCycleTimer,
      makeScaredTimer = Factory.makeScaredTimer,
      makeRetreatingTimers = Factory.makeRetreatingTimers,
      makeBoundaries = Factory.makeBoundaries,
      makePellets = Factory.makePellets,
      makePowerUps = Factory.makePowerUps,
      makeAudioPlayer = Factory.makeAudioPlayer,
      makePauseTextImage = Factory.makePauseTextImage,
    },
  ) {
    const ghosts = makeGhosts(variables);

    return {
      props: {
        boundaries: makeBoundaries(map, variables),
        pellets: makePellets(map, variables),
        powerUps: makePowerUps(map, variables),
      },
      characters: {
        ghosts: ghosts,
        pacman: makePacman(variables),
      },
      timers: {
        cycleTimer: makeCycleTimer(ghosts),
        scaredTimer: makeScaredTimer(ghosts),
        retreatingTimers: makeRetreatingTimers(ghosts),
      },
      audioPlayer: makeAudioPlayer(),
      pauseTextImage: makePauseTextImage(),
    };
  },

  makeBoundaries(
    map,
    variables,
    makeTunnelBoundaries = Factory.makeTunnelBoundaries,
  ) {
    const boundaries: Boundary[] = [];
    for (const [index, row] of map.entries()) {
      for (const [index_, element] of row.entries()) {
        if (element !== ' ' && element !== '.' && element !== 'o') {
          const regularImage = new Image();
          regularImage.src = `/images/pipe-${Factory.PIPE_NAMES[element]}.png`;
          const whiteImage = new Image();
          whiteImage.src = `/images/pipe-${Factory.PIPE_NAMES[element]}-white.png`;
          const boundary = new Boundary(
            {
              position: {
                x: variables.tileLength * index_,
                y: variables.tileLength * index,
              },
              regularImage: regularImage,
              whiteImage: whiteImage,
            },
            variables.tileLength,
          );
          boundaries.push(boundary);
        }
      }
    }
    makeTunnelBoundaries(boundaries, variables);

    return boundaries;
  },

  makeTunnelBoundaries(boundaries, variables) {
    const regularImage = new Image();
    regularImage.src = '/images/pipe-horizontal.png';
    const whiteImage = new Image();
    whiteImage.src = '/images/pipe-horizontal-white.png';
    for (const data of Factory.TUNNEL_DATA) {
      const tunnelBoundary = new Boundary(
        {
          position: {
            x: variables.tileLength * data.position.x,
            y: variables.tileLength * data.position.y,
          },
          regularImage: regularImage,
          whiteImage: whiteImage,
        },
        variables.tileLength,
      );
      boundaries.push(tunnelBoundary);
    }
  },

  makePellets(map, variables) {
    const pellets = [];
    for (const [index, row] of map.entries()) {
      for (const [index_, element] of row.entries()) {
        if (element === '.') {
          const pellet = new Pellet(
            {
              position: {
                x: (variables.tileLength * (2 * index_ + 1)) / 2,
                y: (variables.tileLength * (2 * index + 1)) / 2,
              },
            },
            variables.tileLength,
          );
          pellets.push(pellet);
        }
      }
    }

    return pellets;
  },

  makePowerUps(map, variables) {
    const powerUps = [];
    for (const [index, row] of map.entries()) {
      for (const [index_, element] of row.entries()) {
        if (element === 'o') {
          const powerUp = new PowerUp(
            {
              position: {
                x: (variables.tileLength * (2 * index_ + 1)) / 2,
                y: (variables.tileLength * (2 * index + 1)) / 2,
              },
            },
            variables.tileLength,
          );
          powerUps.push(powerUp);
        }
      }
    }

    return powerUps;
  },

  makeGhosts(variables) {
    const ghosts: Record<string, Ghost> = {};
    for (const data of Factory.GHOST_DATA) {
      const ghost = new Ghost(
        {
          position: {
            x: (variables.tileLength * data.position.x) / 2,
            y: (variables.tileLength * data.position.y) / 2,
          },
          velocity: {
            x: variables.tileLength * data.velocity.x,
            y: variables.tileLength * data.velocity.y,
          },
          colour: data.colour,
        },
        variables.tileLength,
      );
      ghost.assignSprite();
      ghosts[data.colour] = ghost;
    }

    return ghosts;
  },

  makePacman(variables) {
    return new PacMan(
      {
        position: {
          x: (variables.tileLength * 29) / 2,
          y: (variables.tileLength * 47) / 2,
        },
        velocity: {
          x: 0,
          y: 0,
        },
      },
      variables.tileLength,
      {},
    );
  },

  makeCycleTimer(ghosts) {
    return new CycleTimer(Object.values(ghosts));
  },

  makeScaredTimer(ghosts) {
    return new ScaredTimer(Object.values(ghosts));
  },

  makeRetreatingTimers(ghosts) {
    const retreatingTimers = [];
    for (const ghost of Object.values(ghosts)) {
      const retreatingTimer = new RetreatingTimer(ghost);
      ghost.retreatingTimer = retreatingTimer;
      retreatingTimers.push(retreatingTimer);
    }

    return retreatingTimers;
  },

  makeAudioPlayer() {
    return new AudioPlayer({});
  },

  makePauseTextImage() {
    const image = new Image();
    image.src = '/images/pause-text.png';

    return image;
  },
};

export { Factory };
