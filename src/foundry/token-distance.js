import { closestOffsets, toRangeUnits } from "../rules/grid-distance.js";

// Distance between two points of the scene, in the game's unit, or null if the scene's unit is unknown.
export function measure(from, to) {
  const { distance } = canvas.grid.measurePath([from, to]);
  return toRangeUnits(distance, canvas.grid.units);
}

// Distance between two tokens, from their nearest occupied squares (centre to centre on gridless scenes).
export function tokenDistance(fromToken, toToken) {
  const fromOffsets = fromToken.document.getOccupiedGridSpaceOffsets();
  const toOffsets = toToken.document.getOccupiedGridSpaceOffsets();
  if (!fromOffsets.length || !toOffsets.length) {
    return measure(fromToken.center, toToken.center);
  }
  const [from, to] = closestOffsets(fromOffsets, toOffsets);
  return measure(canvas.grid.getCenterPoint(from), canvas.grid.getCenterPoint(to));
}
