import { rangeLimit } from "./range-bands.js";

export const IN_RANGE = "inRange";
export const FAR_SHOT = "farShot";
export const OUT_OF_RANGE = "outOfRange";

// A ranged or thrown weapon can still hit what is within reach, so the limit is never below the reach.
export function attackLimit(range, reach) {
  return Math.max(rangeLimit(range, reach), reach);
}

// OSD01, "Options des attaques à distance", Tir distant: a ranged weapon can hit up to twice its range, with 1 bane.
// Spells and melee weapons have no such option.
export function farShotLimit(range, reach) {
  if (!range.farShot) {
    return null;
  }
  return rangeLimit(range, reach) * 2;
}

export function checkRange({ distance, range, reach }) {
  const limit = attackLimit(range, reach);
  if (distance <= limit) {
    return { status: IN_RANGE, limit };
  }
  const farLimit = farShotLimit(range, reach);
  if (farLimit !== null && distance <= farLimit) {
    return { status: FAR_SHOT, limit };
  }
  return { status: OUT_OF_RANGE, limit };
}
