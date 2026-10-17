import { REACH } from "./range-bands.js";

// Words used for each band in the English data and the French translation.
const BAND_WORDS = {
  short: ["short", "courte"],
  medium: ["medium", "moyenne"],
  long: ["long", "longue"],
  extreme: ["extreme", "extrême"]
};

function bandOf(word) {
  const lower = word.toLowerCase();
  const entry = Object.entries(BAND_WORDS).find(([, words]) => words.includes(lower));
  if (!entry) {
    return null;
  }
  return entry[0];
}

// Each reader recognises one way of writing a range; the first one that matches wins.
const WEAPON_READERS = [
  // "Range (long)", "Portée (moyenne)", "Portée courte"
  (text) => text.match(/\b(?:range|portée)\s*\(?\s*([\p{L}]+)/iu)?.[1]
];

const SPELL_READERS = [
  // "à portée de votre allonge", "within reach"
  (text) => {
    if (/portée de (?:votre|son|sa) allonge|within (?:your )?reach/i.test(text)) {
      return REACH;
    }
    return null;
  },
  // "à portée moyenne", "jusqu’à portée courte"
  (text) => bandOf(text.match(/portée\s+([\p{L}]+)/iu)?.[1] ?? ""),
  // "within medium range"
  (text) => bandOf(text.match(/\b([\p{L}]+)\s+range\b/iu)?.[1] ?? "")
];

function firstMatch(readers, text) {
  for (const read of readers) {
    const result = read(text);
    if (result) {
      return result;
    }
  }
  return null;
}

// A weapon's range is written in its properties ("Thrown, Range (short)", "Reach +1"); without one it is a melee weapon.
// Only weapons with a range can shoot further than it (Tir distant).
export function weaponRange(properties) {
  const text = String(properties ?? "");
  const reachBonus = Number(text.match(/\b(?:reach|allonge)\s*\+\s*(\d+)/i)?.[1] ?? 0);
  const band = bandOf(firstMatch(WEAPON_READERS, text) ?? "");
  if (!band) {
    return { band: REACH, reachBonus, farShot: false };
  }
  return { band, reachBonus, farShot: true };
}

// A spell's range is written in its target ("Une créature à portée moyenne"); null when there is none to check.
export function spellRange(target) {
  const band = firstMatch(SPELL_READERS, String(target ?? ""));
  if (!band) {
    return null;
  }
  return { band };
}
