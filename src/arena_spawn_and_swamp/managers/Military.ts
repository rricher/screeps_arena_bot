import { Order } from 'common/classes/Order';
import { Priority } from 'common/enums/priority';
import { RoleSAS as Role } from 'common/enums/role';
import { getRangedAttackerBody } from 'common/lib/bodyParts';
import { Core } from '../Core';
import { getCreepsInQueue, orderCreep } from '../lib/orders';
import { run as runRangedAttacker } from '../roles/RangedAttacker';

const MAX_ACTIVE = 6;
const MAX_LEVEL = 3;

let lastRun = 0;

export function runMilitary(core: Core) {
  core.runCreeps(Role.RangedAttacker, runRangedAttacker);

  if (!lastRun || lastRun + 10 <= core.tick) {
    if (shouldOrderRangedAttacker(core)) {
      orderRangedAttacker(core);
    }
    lastRun = core.tick;
  }
}

function shouldOrderRangedAttacker(core: Core): boolean {
  if (core.getCreeps(Role.Harvester).length === 0) {
    return false;
  }

  const active = core.getCreeps(Role.RangedAttacker).length;
  const ordered = getCreepsInQueue(Role.RangedAttacker);
  return active < MAX_ACTIVE && !ordered;
}

function orderRangedAttacker(core: Core) {
  const order = new Order();
  order.role = Role.RangedAttacker;
  order.level = MAX_LEVEL;
  order.body = getRangedAttackerBody(order.level);
  order.priority = Priority.Normal;
  orderCreep(order, core);
}
