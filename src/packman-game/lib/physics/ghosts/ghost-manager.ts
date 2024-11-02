import {
  type FactoryAssetsType,
  type GlobalVariablesType,
} from '../../../config/types.ts';
import { type Boundary } from '../../../models/boundary.ts';
import { type Ghost } from '../../../models/ghost.ts';
import { BoundaryManager } from '../boundaries/boundary-manager.ts';

import { GhostCollision } from './collisions/ghost-collision.ts';
import { GhostMovement } from './movement/ghost-movement.ts';

interface GhostManagerType {
  updateCollisions: (
    boundaries: Boundary[],
    collisions: string[],
    ghost: Ghost,
  ) => void;
  chooseMovement: (arguments_: {
    ghost: Ghost;
    assets: FactoryAssetsType;
    collisions: string[];
    variables: GlobalVariablesType;
  }) => void;
  checkPacmanGhostCollision: (argument: {
    ghost: Ghost;
    assets: FactoryAssetsType;
    variables: GlobalVariablesType;
    context: CanvasRenderingContext2D;
  }) => void;
}

const GhostManager: GhostManagerType = {
  updateCollisions(boundaries, collisions, ghost) {
    for (const boundary of boundaries) {
      if (
        !collisions.includes('down') &&
        BoundaryManager.hitBoundaryConditional(ghost, boundary, {
          velocity: { x: 0, y: ghost.speed },
        })
      ) {
        collisions.push('down');
      } else if (
        !collisions.includes('right') &&
        BoundaryManager.hitBoundaryConditional(ghost, boundary, {
          velocity: { x: ghost.speed, y: 0 },
        })
      ) {
        collisions.push('right');
      } else if (
        !collisions.includes('left') &&
        BoundaryManager.hitBoundaryConditional(ghost, boundary, {
          velocity: { x: -ghost.speed, y: 0 },
        })
      ) {
        collisions.push('left');
      } else if (
        !collisions.includes('up') &&
        BoundaryManager.hitBoundaryConditional(ghost, boundary, {
          velocity: { x: 0, y: -ghost.speed },
        })
      ) {
        collisions.push('up');
      }
    }

    if (collisions.length > ghost.prevCollisions.length) {
      ghost.prevCollisions = collisions;
    }
  },

  chooseMovement({ ghost, assets, collisions, variables }) {
    if (!ghost.isScared && !ghost.isRetreating) {
      GhostMovement.chaseAndScatter({ ghost, assets, collisions, variables });
    } else {
      GhostMovement.moveRandomly(ghost, collisions);
    }
    GhostMovement.emptyPrevCollisions(ghost);
    ghost.assignSprite();
  },

  checkPacmanGhostCollision({ ghost, assets, variables, context }) {
    if (GhostCollision.collisionConditional(ghost, assets.characters.pacman)) {
      GhostCollision.dealWithCollision({ ghost, assets, variables, context });
    }
  },
};

export { GhostManager };
