import { reachOf } from "./range-bands.js";
import { attackLimit, farShotLimit } from "./range-check.js";
import { spellRange, weaponRange } from "./range-text.js";

// The system counts castings as used / max; a max of 0 means no limit.
function hasCastingsLeft(spell) {
  const used = Number.parseInt(spell.system.castings?.value, 10) || 0;
  const max = Number.parseInt(spell.system.castings?.max, 10) || 0;
  return max === 0 || used < max;
}

// What a creature can attack with right now, and how far it reaches; null when the item is not an option.
const OPTION_READERS = {
  weapon: (weapon) => {
    if (!weapon.system.wear) {
      return null;
    }
    return weaponRange(weapon.system.properties);
  },
  spell: (spell) => {
    if (!hasCastingsLeft(spell)) {
      return null;
    }
    return spellRange(spell.system.target);
  }
};

// `size` is the creature's Size: weapons with Reach +N add to the reach it gives.
export function attackOptions(items, size) {
  const options = [];
  for (const item of items) {
    const range = OPTION_READERS[item.type]?.(item);
    if (range) {
      const reach = reachOf(size, range.reachBonus ?? 0);
      options.push({ name: item.name, limit: attackLimit(range, reach), farLimit: farShotLimit(range, reach) });
    }
  }
  return options;
}

function isFarShot(option, distance) {
  return distance > option.limit && option.farLimit !== null && distance <= option.farLimit;
}

export function sortByRange(options, distance) {
  const names = (keep) => options.filter(keep).map((option) => option.name);
  return {
    inRange: names((option) => distance <= option.limit),
    farShot: names((option) => isFarShot(option, distance)),
    outOfRange: names((option) => distance > Math.max(option.limit, option.farLimit ?? 0))
  };
}

// The furthest the creature can attack, a far shot included: beyond it, nothing reaches.
export function furthestReach(options) {
  return Math.max(...options.map((option) => Math.max(option.limit, option.farLimit ?? 0)));
}
