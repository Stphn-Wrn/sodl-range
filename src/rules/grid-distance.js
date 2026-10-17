// The French books count in metres, the English ones in yards: both are one square.
const SQUARE_UNITS = ["m", "mètre", "mètres", "metre", "metres", "meter", "meters", "yd", "yds", "yard", "yards"];
const FOOT_UNITS = ["ft", "feet", "foot", "pi", "pied", "pieds"];

// Converts a scene distance to the game's unit; null when the scene uses a unit the rules do not know.
export function toRangeUnits(distance, units) {
  const unit = String(units ?? "").trim().toLowerCase();
  if (SQUARE_UNITS.includes(unit)) {
    return distance;
  }
  if (FOOT_UNITS.includes(unit)) {
    return distance / 3;
  }
  return null;
}

// Squares apart, then the straight-line length to break ties, so the straightest pair wins over a diagonal one.
// The other way round: a range from the book in the scene's unit, to draw it on the canvas.
export function fromRangeUnits(distance, units) {
  const perSquare = toRangeUnits(1, units);
  if (perSquare === null) {
    return null;
  }
  return distance / perSquare;
}

function isCloser(a, b, bestA, bestB) {
  const squares = Math.max(Math.abs(a.i - b.i), Math.abs(a.j - b.j));
  const bestSquares = Math.max(Math.abs(bestA.i - bestB.i), Math.abs(bestA.j - bestB.j));
  if (squares !== bestSquares) {
    return squares < bestSquares;
  }
  return (a.i - b.i) ** 2 + (a.j - b.j) ** 2 < (bestA.i - bestB.i) ** 2 + (bestA.j - bestB.j) ** 2;
}

// Large creatures fill several squares: the distance between two creatures runs between their nearest squares.
export function closestOffsets(fromOffsets, toOffsets) {
  let best = [fromOffsets[0], toOffsets[0]];
  for (const from of fromOffsets) {
    for (const to of toOffsets) {
      if (isCloser(from, to, best[0], best[1])) {
        best = [from, to];
      }
    }
  }
  return best;
}
