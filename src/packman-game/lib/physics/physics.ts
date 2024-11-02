import {
  type FactoryAssetsType,
  type GlobalVariablesType,
} from '../../config/types.ts';

import { BoundaryManager } from './boundaries/boundary-manager.ts';
import { GhostManager } from './ghosts/ghost-manager.ts';
import { PacmanManager } from './pacman/pacman-manager.ts';
import { PelletManager } from './pellets/pellet-manager.ts';
import { PowerUpManager } from './power-ups/power-up-manager.ts';

interface PhysicsType {
  implementBoundaries: (
    assets: FactoryAssetsType,
    context: CanvasRenderingContext2D,
  ) => void;
  implementPellets: (
    assets: FactoryAssetsType,
    context: CanvasRenderingContext2D,
    variables: GlobalVariablesType,
  ) => void;
  implementPowerUps: (
    assets: FactoryAssetsType,
    context: CanvasRenderingContext2D,
    variables: GlobalVariablesType,
  ) => void;
  implementGhosts: (
    assets: FactoryAssetsType,
    context: CanvasRenderingContext2D,
    variables: GlobalVariablesType,
  ) => void;
  implementPacman: (
    variables: GlobalVariablesType,
    assets: FactoryAssetsType,
    context: CanvasRenderingContext2D,
  ) => void;
}

const Physics: PhysicsType = {
  implementBoundaries(assets, context) {
    for (const boundary of assets.props.boundaries) {
      boundary.draw(context);
      BoundaryManager.stopPacmanCollision(boundary, assets.characters.pacman);
    }
  },

  implementPellets(assets, context, variables) {
    for (const pellet of assets.props.pellets) {
      if (!pellet.hasBeenEaten) {
        pellet.draw(context);
        PelletManager.eatPellet(pellet, assets.characters.pacman, variables);
      }
    }
    PelletManager.checkLevelUpCondition(assets, variables, context);
  },

  implementPowerUps(assets, context, variables) {
    for (const powerUp of assets.props.powerUps) {
      if (!powerUp.hasBeenEaten) {
        powerUp.update(context);
        PowerUpManager.eatPowerUp(powerUp, assets, variables);
      }
    }
  },

  implementGhosts(assets, context, variables) {
    for (const ghost of Object.values(assets.characters.ghosts)) {
      const collisions: string[] = [];
      ghost.update(context);
      BoundaryManager.implementTunnel(ghost, variables);
      GhostManager.updateCollisions(assets.props.boundaries, collisions, ghost);

      if (JSON.stringify(collisions) !== JSON.stringify(ghost.prevCollisions)) {
        GhostManager.chooseMovement({ ghost, assets, collisions, variables });
      }
      GhostManager.checkPacmanGhostCollision({
        ghost,
        assets,
        variables,
        context,
      });
    }
  },

  implementPacman(variables, assets, context) {
    PacmanManager.changeDirection(variables, assets);
    PacmanManager.checkIfPacmanIsEating(assets);
    assets.characters.pacman.update(context);
    BoundaryManager.implementTunnel(assets.characters.pacman, variables);
  },
};

export { Physics };
