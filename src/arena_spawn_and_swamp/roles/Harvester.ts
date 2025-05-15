import { creepHadState, setCreepStateAndRun } from 'common/lib/creep';
import { ERR_NOT_IN_RANGE, OK, RESOURCE_ENERGY } from 'game/constants';
import { Creep } from 'game/prototypes';
import { Core } from '../Core';

enum State {
  HarvestEnergy = 1,
  TransferEnergy = 2,
}

export function run(creep: Creep, core: Core) {
  switch (creep._state) {
    case State.HarvestEnergy: {
      runHarvestEnergy(creep, core);
      break;
    }
    case State.TransferEnergy: {
      runTransferEnergy(creep, core);
      break;
    }
    default: {
      setCreepStateAndRun(core, creep, State.HarvestEnergy, runHarvestEnergy);
      break;
    }
  }
}

export function runHarvestEnergy(creep: Creep, core: Core) {
  if (!creepHadState(creep, State.TransferEnergy) && creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
    setCreepStateAndRun(core, creep, State.TransferEnergy, runTransferEnergy);
    return;
  }

  const container = creep.findClosestByPath(core.containers);
  if (container) {
    const result = creep.withdraw(container, RESOURCE_ENERGY);
    if (result === ERR_NOT_IN_RANGE) {
      creep.moveTo(container);
    }
  }
}

export function runTransferEnergy(creep: Creep, core: Core) {
  if (!creepHadState(creep, State.HarvestEnergy) && !creep.store.energy) {
    setCreepStateAndRun(core, creep, State.HarvestEnergy, runHarvestEnergy);
    return;
  }

  if (core.mySpawn.store.getFreeCapacity(RESOURCE_ENERGY)) {
    const result = creep.transfer(core.mySpawn, RESOURCE_ENERGY);
    if (result === OK) {
      setCreepStateAndRun(core, creep, State.HarvestEnergy, runHarvestEnergy);
    } else if (result === ERR_NOT_IN_RANGE) {
      creep.moveTo(core.mySpawn);
    }
  } else {
    if (creep.getRangeTo({ x: core.mySpawn.x, y: core.mySpawn.y }) > 1) creep.moveTo(core.mySpawn);
  }
}
