// OSD01, "Portée et distance": each band is a radius around the creature, in metres (yards in the English books).
export const RANGE_BANDS = [
  { key: "short", limit: 5 },
  { key: "medium", limit: 20 },
  { key: "long", limit: 100 },
  { key: "extreme", limit: 500 }
];

export const REACH = "reach";
export const BEYOND = "beyond";

export function bandForDistance(distance) {
  const band = RANGE_BANDS.find((candidate) => distance <= candidate.limit);
  if (!band) {
    return BEYOND;
  }
  return band.key;
}

// Sizes are written as in the books: "1", "2", "1/2", "1/4".
function parseSize(size) {
  const text = String(size ?? "").trim();
  const fraction = text.match(/^(\d+)\s*\/\s*(\d+)$/);
  if (fraction) {
    return Number(fraction[1]) / Number(fraction[2]);
  }
  const value = Number.parseFloat(text);
  if (Number.isNaN(value)) {
    return 1;
  }
  return value;
}

// A creature's reach is its Size rounded up; weapons with "Reach +N" add to it.
export function reachOf(size, bonus = 0) {
  return Math.max(1, Math.ceil(parseSize(size))) + bonus;
}

export function rangeLimit(range, reach) {
  if (range.band === REACH) {
    return reach;
  }
  return RANGE_BANDS.find((band) => band.key === range.band).limit;
}
