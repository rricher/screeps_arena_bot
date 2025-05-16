import { ATTACK, BodyPartConstant, HEAL, OK, RANGED_ATTACK } from 'game/constants';
import { CostMatrix, searchPath } from 'game/path-finder';
import { Creep } from 'game/prototypes';
import { getDirection } from 'game/utils';
import { Visual } from 'game/visual';
import { Core } from '../Core';
import { findInsideRect } from './utils';

export function setCreepState(creep: Creep, state: number) {
  if (!creep._states) {
    creep._states = [];
  }
  creep._states.push(state);
  creep._state = state;
}

export function creepHadState(creep: Creep, state: number) {
  if (!creep._states) {
    creep._states = [];
  }
  return creep._states.includes(state);
}

export function setCreepStateAndRun<TCore extends Core>(
  core: TCore,
  creep: Creep,
  state: number,
  runFunction: (creep: Creep, core: TCore, ...args: unknown[]) => void,
  ...args: unknown[]
) {
  const canRunFunction = !creepHadState(creep, state);
  setCreepState(creep, state);
  if (canRunFunction) {
    runFunction(creep, core, args);
  }
}

export function creepHasPart(creep: Creep, part: BodyPartConstant): boolean {
  return creep.body.some(p => p.type === part && p.hits > 0);
}

export function findPartsAmount(creep: Creep, part: BodyPartConstant): number {
  return creep.body.filter(p => p.type === part && p.hits > 0).length;
}

export function moveAsAttacker<TCore extends Core>(creep: Creep, core: TCore, target: Creep): boolean {
  const cm = new CostMatrix();
  const attackCreeps = core.enemyCreeps.filter(c => creepHasPart(c, ATTACK));
  for (let enemyCreep of attackCreeps) {
    const positions = findInsideRect(enemyCreep, 2);
    // console.log(positions);
    new Visual().poly(positions, { opacity: 0.25 });
    for (let pos of positions) cm.set(pos.x, pos.y, 255);
  }
  const rangedAttackCreeps = core.enemyCreeps.filter(c => creepHasPart(c, RANGED_ATTACK));
  for (let enemyCreep of rangedAttackCreeps) {
    // if (findPartsAmount(enemyCreep, RANGED_ATTACK) <= findPartsAmount(creep, HEAL)) continue;
    const positions = findInsideRect(enemyCreep, 2);
    // console.log(positions);
    new Visual().poly(positions, { opacity: 0.25 });
    for (let pos of positions) cm.set(pos.x, pos.y, 255);
  }
  const path = searchPath(
    creep,
    { pos: target, range: 1 },
    {
      costMatrix: cm,
    }
  ).path;
  new Visual().poly(path);
  if (!path.length) return false;
  return creep.moveTo(path[0]) === OK;
}
