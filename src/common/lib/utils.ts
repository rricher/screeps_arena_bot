import { RoomPosition } from 'game/prototypes';

export function findInsideRect(target: RoomPosition, range: number) {
  const positions: RoomPosition[] = [];
  for (let x = target.x - range; x <= target.x + range; x++) {
    for (let y = target.y - range; y <= target.y + range; y++) {
      positions.push({ x, y });
    }
  }
  return positions;
}
