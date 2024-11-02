import {
  type FactoryAssetsType,
  type GlobalVariablesType,
} from '../../../config/types.ts';
import { type Boundary } from '../../../models/boundary.ts';
import { type PacMan } from '../../../models/pacman.ts';
import { BoundaryManager } from '../boundaries/boundary-manager.ts';

interface PacmanManagerType {
  changeDirection: (
    variables: GlobalVariablesType,
    assets: FactoryAssetsType,
  ) => void;
  checkDirectionChange: (
    pacman: PacMan,
    boundaries: Boundary[],
    { velocity }: { velocity: { x: number; y: number } },
  ) => void;
  checkIfPacmanIsEating: (assets: FactoryAssetsType) => void;
}

const PacmanManager: PacmanManagerType = {
  changeDirection(variables, assets) {
    const pacman = assets.characters.pacman;
    const boundaries = assets.props.boundaries;

    switch (variables.lastKeyPressed) {
      case 'up': {
        PacmanManager.checkDirectionChange(pacman, boundaries, {
          velocity: { x: 0, y: -pacman.speed },
        });

        break;
      }
      case 'down': {
        PacmanManager.checkDirectionChange(pacman, boundaries, {
          velocity: { x: 0, y: pacman.speed },
        });

        break;
      }
      case 'right': {
        PacmanManager.checkDirectionChange(pacman, boundaries, {
          velocity: { x: pacman.speed, y: 0 },
        });

        break;
      }
      case 'left': {
        PacmanManager.checkDirectionChange(pacman, boundaries, {
          velocity: { x: -pacman.speed, y: 0 },
        });

        break;
      }
      // No default
    }
  },

  checkDirectionChange(pacman, boundaries, { velocity }) {
    let count = 0;
    for (const boundary of boundaries) {
      if (
        BoundaryManager.hitBoundaryConditional(pacman, boundary, {
          velocity,
        })
      ) {
        count++;
      }
    }

    if (count === 0) {
      pacman.velocity.x = velocity.x;
      pacman.velocity.y = velocity.y;
    }
  },

  checkIfPacmanIsEating(assets) {
    let count = 0;
    const pacman = assets.characters.pacman;
    for (const pellet of assets.props.pellets) {
      if (
        pellet.position.y - pellet.radius <=
          pacman.position.y + pacman.radius * 2 + pacman.velocity.y * 2 &&
        pellet.position.y + pellet.radius >=
          pacman.position.y - pacman.radius * 2 + pacman.velocity.y * 2 &&
        pellet.position.x + pellet.radius >=
          pacman.position.x - pacman.radius * 2 + pacman.velocity.x * 2 &&
        pellet.position.x - pellet.radius <=
          pacman.position.x + pacman.radius * 2 + pacman.velocity.x * 2 &&
        !pellet.hasBeenEaten
      ) {
        count++;
      }
    }
    pacman.isEating = count > 0 ? true : false;
  },
};

export { PacmanManager };
