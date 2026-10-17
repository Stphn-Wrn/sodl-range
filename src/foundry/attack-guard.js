import { reachOf } from "../rules/range-bands.js";
import { FAR_SHOT, OUT_OF_RANGE, checkRange, farShotLimit } from "../rules/range-check.js";
import { spellRange, weaponRange } from "../rules/range-text.js";
import { tokenDistance } from "./token-distance.js";

// Each item type keeps its range in a different field; null means there is nothing to check.
const RANGE_READERS = {
  weapon: (item) => weaponRange(item.system.properties),
  spell: (item) => spellRange(item.system.target)
};

function attackerToken(actor) {
  const tokens = actor.getActiveTokens();
  return tokens.find((token) => token.controlled) ?? tokens[0] ?? null;
}

function rounded(distance) {
  return Math.round(distance * 10) / 10;
}

// Where the target stands for this attack: in range, far shot or out of range. Null when it cannot be told.
function targetRange(actor, item, target) {
  const range = RANGE_READERS[item?.type]?.(item);
  const token = attackerToken(actor);
  if (!range || !token) {
    return null;
  }
  const distance = tokenDistance(token, target);
  if (distance === null) {
    return null;
  }
  const reach = reachOf(actor.system.characteristics?.size, range.reachBonus ?? 0);
  const { status, limit } = checkRange({ distance, range, reach });
  return { status, distance, range, furthest: farShotLimit(range, reach) ?? limit };
}

function messageData(item, target, reading) {
  return {
    target: target.name,
    item: item.name,
    band: game.i18n.localize(`SODLRANGE.Bands.${reading.range.band}`),
    limit: reading.furthest,
    distance: rounded(reading.distance)
  };
}

// Before the dialog: warns about every target out of range. It never blocks the roll: the GM has the last word.
function warnBeforeRoll(actor, item, autoFarShot) {
  for (const target of game.user.targets) {
    const reading = targetRange(actor, item, target);
    if (reading?.status === OUT_OF_RANGE) {
      ui.notifications.warn(game.i18n.format("SODLRANGE.Warning.OutOfRange", messageData(item, target, reading)));
    }
    if (reading?.status === FAR_SHOT && !autoFarShot) {
      ui.notifications.info(game.i18n.format("SODLRANGE.Warning.FarShotPossible", messageData(item, target, reading)));
    }
  }
}

// The system rolls once per target with these boons: a target in far shot range gets 1 bane on its own roll.
function farShotBoons(actor, item, target, inputBoons) {
  const reading = targetRange(actor, item, target);
  if (reading?.status !== FAR_SHOT) {
    return inputBoons;
  }
  ui.notifications.info(game.i18n.format("SODLRANGE.Warning.FarShotApplied", messageData(item, target, reading)));
  return (Number.parseInt(inputBoons, 10) || 0) - 1;
}

// The system opens its attack dialog from rollWeaponAttack / rollSpell (also used by the sodl-custom combat HUD),
// then rolls each target with rollItemAttack.
export function installAttackGuard({ warnings, autoFarShot }) {
  const prototype = CONFIG.Actor.documentClass.prototype;

  const rollWeaponAttack = prototype.rollWeaponAttack;
  prototype.rollWeaponAttack = function (itemId, options) {
    if (warnings()) {
      warnBeforeRoll(this, this.items.get(itemId), autoFarShot());
    }
    return rollWeaponAttack.call(this, itemId, options);
  };

  const rollSpell = prototype.rollSpell;
  prototype.rollSpell = function (itemId, options) {
    if (warnings()) {
      warnBeforeRoll(this, this.items.get(itemId), autoFarShot());
    }
    return rollSpell.call(this, itemId, options);
  };

  const rollItemAttack = prototype.rollItemAttack;
  prototype.rollItemAttack = function (item, inputBoons = 0, inputModifier = 0, token = null) {
    let boons = inputBoons;
    if (token && autoFarShot()) {
      boons = farShotBoons(this, item, token, inputBoons);
    }
    return rollItemAttack.call(this, item, boons, inputModifier, token);
  };
}
