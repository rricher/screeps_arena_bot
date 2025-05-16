import { moveAsAttacker } from 'common/lib/creep';
import { Creep, StructureSpawn } from 'game/prototypes';
import { Core } from '../Core';

export function run(creep: Creep, core: Core) {
  const target = creep.findClosestByRange(core.hostileCreeps);
  if (target) {
    if (!moveAsAttacker(creep, core, target)) {
      creep.moveTo(target);
    }
    attack(creep, target);
    return;
  }

  if (core.enemySpawn) {
    creep.moveTo(core.enemySpawn);
    attack(creep, core.enemySpawn);
  }
}

function attack(creep: Creep, target: Creep | StructureSpawn) {
  if (creep.getRangeTo(target) <= 1) {
    creep.rangedMassAttack();
  } else if (creep.getRangeTo(target) <= 3) {
    creep.rangedAttack(target);
  }
}
