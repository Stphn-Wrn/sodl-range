import { BEYOND, RANGE_BANDS } from "./range-bands.js";

// Green for close, then warmer and further away; yellow for a far shot (1 bane); red when nothing reaches that far.
const BAND_COLORS = {
  short: 0x2ecc40,
  medium: 0xff851b,
  long: 0x0074d9,
  extreme: 0xb10dc9,
  farShot: 0xffdc00,
  beyond: 0xff4136
};

export function bandColor(band) {
  return BAND_COLORS[band];
}

// The rings drawn around the ruler's start: every band up to the one being measured, which stands out.
export function ringsFor(band) {
  let last = RANGE_BANDS.findIndex((candidate) => candidate.key === band);
  if (band === BEYOND) {
    last = RANGE_BANDS.length - 1;
  }
  return RANGE_BANDS.slice(0, last + 1).map(({ key, limit }) => ({
    band: key,
    limit,
    color: bandColor(key),
    current: key === band
  }));
}
