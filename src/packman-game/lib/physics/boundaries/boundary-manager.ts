import { type GlobalVariablesType } from '../../../config/types.ts';
import { type Boundary } from '../../../models/boundary.ts';
import { type Ghost } from '../../../models/ghost.ts';
import { type PacMan } from '../../../models/pacman.ts';

interface BoundaryManagerType {
  hitBoundaryConditional: (
    character: PacMan | Ghost,
    boundary: Boundary,
    { velocity }: { velocity: { x: number; y: number } },
  ) => boolean;
  implementTunnel: (
    character: PacMan | Ghost,
    variables: GlobalVariablesType,
  ) => void;
  stopPacmanCollision: (boundary: Boundary, pacman: PacMan) => void;
}

const BoundaryManager: BoundaryManagerType = {
  hitBoundaryConditional(character, boundary, { velocity }) {
    const padding = boundary.width / 2 - character.radius - 1;

    return (
      character.position.y - character.radius + velocity.y <=
        boundary.position.y + boundary.height + padding &&
      character.position.y + character.radius + velocity.y >=
        boundary.position.y - padding &&
      character.position.x + character.radius + velocity.x >=
        boundary.position.x - padding &&
      character.position.x - character.radius + velocity.x <=
        boundary.position.x + boundary.width + padding
    );
  },

  implementTunnel(character, variables) {
    if (character.position.x === (variables.tileLength * 57) / 2) {
      character.position.x = -variables.tileLength / 2;
    } else if (character.position.x === -variables.tileLength / 2) {
      character.position.x = (variables.tileLength * 57) / 2;
    }
  },

  stopPacmanCollision(boundary, pacman) {
    if (
      BoundaryManager.hitBoundaryConditional(pacman, boundary, {
        velocity: {
          x: pacman.velocity.x,
          y: pacman.velocity.y,
        },
      })
    ) {
      pacman.velocity.x = 0;
      pacman.velocity.y = 0;
    }
  },
};

export { BoundaryManager };
