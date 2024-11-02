import {
  type FactoryAssetsType,
  type GlobalVariablesType,
  type PathwayType,
} from '../../../../config/types.ts';
import { type Ghost } from '../../../../models/ghost.ts';
import { type PacMan } from '../../../../models/pacman.ts';

interface GhostMovementType {
  chaseAndScatter: (arguments_: {
    ghost: Ghost;
    assets: FactoryAssetsType;
    collisions: string[];
    variables: GlobalVariablesType;
  }) => void;
  calculateDistance: (arguments_: {
    assets: FactoryAssetsType;
    ghost: Ghost;
    pathways: PathwayType[];
    variables: GlobalVariablesType;
  }) => void;
  addCoordinates: (
    pathway: PathwayType,
    ghost: Ghost,
    variables: GlobalVariablesType,
  ) => void;
  chase: (argument: {
    ghost: Ghost;
    pathway: PathwayType;
    assets: FactoryAssetsType;
    variables: GlobalVariablesType;
  }) => { x: number; y: number } | undefined;
  isOrangeFarFromPacman: (
    orangeGhost: Ghost,
    pacman: PacMan,
    variables: GlobalVariablesType,
  ) => boolean;
  findRedOrangeAimPath: (
    pacman: PacMan,
    pathway: PathwayType,
  ) => { x: number; y: number };
  findPinkAimPath: (
    pacman: PacMan,
    pathway: PathwayType,
    variables: GlobalVariablesType,
  ) => { x: number; y: number };
  findCyanAimPath: (
    assets: FactoryAssetsType,
    variables: GlobalVariablesType,
    pathway: PathwayType,
  ) => { x: number; y: number };
  scatter: (
    ghost: Ghost,
    pathway: PathwayType,
  ) => { x: number; y: number } | undefined;
  findRedScatterPath: (pathway: PathwayType) => { x: number; y: number };

  findPinkScatterPath: (pathway: PathwayType) => { x: number; y: number };

  findCyanScatterPath: (pathway: PathwayType) => { x: number; y: number };

  findOrangeScatterPath: (pathway: PathwayType) => { x: number; y: number };

  calculateHypotenuse: (
    vector: { x: number; y: number },
    pathway: PathwayType,
  ) => void;

  pickDirection: (pathways: PathwayType[], ghost: Ghost) => void;

  emptyPrevCollisions: (ghost: Ghost) => void;

  moveRandomly: (ghost: Ghost, collisions: string[]) => void;
  pickRandomDirection: (ghost: Ghost, pathways: string[]) => void;
}

const GhostMovement: GhostMovementType = {
  chaseAndScatter({ ghost, assets, collisions, variables }) {
    if (ghost.velocity.x > 0) {
      ghost.prevCollisions.push('right');
    } else if (ghost.velocity.x < 0) {
      ghost.prevCollisions.push('left');
    } else if (ghost.velocity.y > 0) {
      ghost.prevCollisions.push('down');
    } else if (ghost.velocity.y < 0) {
      ghost.prevCollisions.push('up');
    }

    const pathways: PathwayType[] = [];
    for (const collision of ghost.prevCollisions) {
      if (!collisions.includes(collision)) {
        pathways.push({
          direction: collision,
        });
      }
    }
    GhostMovement.calculateDistance({ assets, ghost, pathways, variables });
    GhostMovement.pickDirection(pathways, ghost);
  },

  calculateDistance({ assets, ghost, pathways, variables }) {
    for (const pathway of pathways) {
      GhostMovement.addCoordinates(pathway, ghost, variables);
      let displacementFromAim;

      if (ghost.isChasing) {
        displacementFromAim = GhostMovement.chase({
          ghost,
          pathway,
          assets,
          variables,
        });
      } else if (!ghost.isChasing) {
        displacementFromAim = GhostMovement.scatter(ghost, pathway);
      }
      GhostMovement.calculateHypotenuse(
        displacementFromAim as { x: number; y: number },
        pathway,
      );
    }
  },

  addCoordinates(pathway, ghost, variables) {
    switch (pathway.direction) {
      case 'up': {
        pathway.position = {
          x: ghost.position.x,
          y: ghost.position.y - variables.tileLength / 8,
        };

        break;
      }
      case 'left': {
        pathway.position = {
          x: ghost.position.x - variables.tileLength / 8,
          y: ghost.position.y,
        };

        break;
      }
      case 'right': {
        pathway.position = {
          x: ghost.position.x + variables.tileLength / 8,
          y: ghost.position.y,
        };

        break;
      }
      case 'down': {
        pathway.position = {
          x: ghost.position.x,
          y: ghost.position.y + variables.tileLength / 8,
        };

        break;
      }
      // No default
    }
  },

  chase({ ghost, pathway, assets, variables }) {
    if (
      ghost.colour === 'red' ||
      (ghost.colour === 'orange' &&
        GhostMovement.isOrangeFarFromPacman(
          ghost,
          assets.characters.pacman,
          variables,
        ))
    ) {
      return GhostMovement.findRedOrangeAimPath(
        assets.characters.pacman,
        pathway,
      );
    } else {
      switch (ghost.colour) {
        case 'pink': {
          return GhostMovement.findPinkAimPath(
            assets.characters.pacman,
            pathway,
            variables,
          );
        }
        case 'cyan': {
          return GhostMovement.findCyanAimPath(assets, variables, pathway);
        }
        case 'orange': {
          return GhostMovement.findOrangeScatterPath(pathway);
        }
        // No default
      }
    }
  },

  isOrangeFarFromPacman(orangeGhost, pacman, variables) {
    const x = pacman.position.x - orangeGhost.position.x;
    const y = pacman.position.y - orangeGhost.position.y;
    const distance = Math.hypot(x, y);

    return distance > variables.tileLength * 8;
  },

  findRedOrangeAimPath(pacman, pathway) {
    return {
      x: pacman.position.x - (pathway?.position?.x as number),
      y: pacman.position.y - (pathway?.position?.y as number),
    };
  },

  findPinkAimPath(pacman, pathway, variables) {
    let x = pacman.position.x - (pathway?.position?.x as number);
    let y = pacman.position.y - (pathway?.position?.y as number);

    switch (pacman.rotation) {
      case 0: {
        x += variables.tileLength * 4;
        break;
      }
      case Math.PI / 2: {
        y += variables.tileLength * 4;
        break;
      }
      case Math.PI: {
        x -= variables.tileLength * 4;
        break;
      }
      case (Math.PI * 3) / 2: {
        {
          y -= variables.tileLength * 4;
          // No default
        }
        break;
      }
    }

    return {
      x,
      y,
    };
  },

  findCyanAimPath(assets, variables, pathway) {
    const pacman = assets.characters.pacman;
    const redGhost = assets.characters.ghosts.red;
    let x = pacman.position.x * 2 - redGhost.position.x;
    let y = pacman.position.y * 2 - redGhost.position.y;

    switch (pacman.rotation) {
      case 0: {
        x += variables.tileLength * 2;
        break;
      }
      case Math.PI / 2: {
        y += variables.tileLength * 2;
        break;
      }
      case Math.PI: {
        x -= variables.tileLength * 2;
        break;
      }
      case (Math.PI * 3) / 2: {
        {
          y -= variables.tileLength * 2;
          // No default
        }
        break;
      }
    }

    return {
      x: x - (pathway?.position?.x as number),
      y: y - (pathway?.position?.y as number),
    };
  },

  scatter(ghost, pathway) {
    switch (ghost.colour) {
      case 'red': {
        return GhostMovement.findRedScatterPath(pathway);
      }
      case 'pink': {
        return GhostMovement.findPinkScatterPath(pathway);
      }
      case 'cyan': {
        return GhostMovement.findCyanScatterPath(pathway);
      }
      case 'orange': {
        return GhostMovement.findOrangeScatterPath(pathway);
      }
      // No default
    }
  },

  findRedScatterPath(pathway) {
    return {
      x: 896 - (pathway?.position?.x as number),
      y: -(pathway?.position?.y as number),
    };
  },

  findPinkScatterPath(pathway) {
    return {
      x: -(pathway?.position?.x as number),
      y: -(pathway?.position?.y as number),
    };
  },

  findCyanScatterPath(pathway) {
    return {
      x: 896 - (pathway?.position?.x as number),
      y: 992 - (pathway.position?.y as number),
    };
  },

  findOrangeScatterPath(pathway) {
    return {
      x: -(pathway.position?.x as number),
      y: 992 - (pathway.position?.y as number),
    };
  },

  calculateHypotenuse(vector, pathway) {
    pathway.distance = Math.hypot(vector.x, vector.y);
  },

  pickDirection(pathways, ghost) {
    let shortest: PathwayType | undefined;
    for (const pathway of pathways) {
      if (
        shortest === undefined ||
        (pathway.distance || 0) < (shortest.distance || 0)
      ) {
        shortest = pathway;
      }
    }

    switch (shortest?.direction as string) {
      case 'up': {
        ghost.velocity.x = 0;
        ghost.velocity.y = -ghost.speed;

        break;
      }
      case 'left': {
        ghost.velocity.x = -ghost.speed;
        ghost.velocity.y = 0;

        break;
      }
      case 'right': {
        ghost.velocity.x = ghost.speed;
        ghost.velocity.y = 0;

        break;
      }
      case 'down': {
        ghost.velocity.x = 0;
        ghost.velocity.y = ghost.speed;

        break;
      }
      // No default
    }
  },

  emptyPrevCollisions(ghost) {
    ghost.prevCollisions = [];
  },

  moveRandomly(ghost, collisions) {
    if (ghost.velocity.x > 0) {
      ghost.prevCollisions.push('right');
    } else if (ghost.velocity.x < 0) {
      ghost.prevCollisions.push('left');
    } else if (ghost.velocity.y > 0) {
      ghost.prevCollisions.push('down');
    } else if (ghost.velocity.y < 0) {
      ghost.prevCollisions.push('up');
    }

    const pathways = ghost.prevCollisions.filter((collision) => {
      return !collisions.includes(collision);
    });
    GhostMovement.pickRandomDirection(ghost, pathways);
  },

  pickRandomDirection(ghost, pathways) {
    const direction = pathways[Math.floor(Math.random() * pathways.length)];

    switch (direction) {
      case 'up': {
        ghost.velocity.x = 0;
        ghost.velocity.y = -ghost.speed;

        break;
      }
      case 'down': {
        ghost.velocity.x = 0;
        ghost.velocity.y = ghost.speed;

        break;
      }
      case 'right': {
        ghost.velocity.x = ghost.speed;
        ghost.velocity.y = 0;

        break;
      }
      case 'left': {
        ghost.velocity.x = -ghost.speed;
        ghost.velocity.y = 0;

        break;
      }
      // No default
    }
  },
};

export { GhostMovement };
