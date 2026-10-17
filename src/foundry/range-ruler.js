import { modulePath } from "../constants.js";
import { attackOptions, furthestReach, sortByRange } from "../rules/attack-options.js";
import { BEYOND, bandForDistance } from "../rules/range-bands.js";
import { FAR_SHOT } from "../rules/range-check.js";
import { fromRangeUnits } from "../rules/grid-distance.js";
import { bandColor, ringsFor } from "../rules/range-style.js";
import { measure } from "./token-distance.js";

const RING_WIDTH = 3;
const RING_ALPHA = 0.9;
const CURRENT_FILL_ALPHA = 0.12;
const OPTION_SEPARATOR = " · ";

function firstWaypoint(waypoint) {
  let first = waypoint;
  while (first.previous) {
    first = first.previous;
  }
  return first;
}

function ringRadius(limit) {
  return fromRangeUnits(limit, canvas.grid.units) * canvas.dimensions.distancePixels;
}

function drawRing(graphics, center, { limit, color, filled }) {
  if (filled) {
    graphics.beginFill(color, CURRENT_FILL_ALPHA);
  }
  graphics.lineStyle({ width: RING_WIDTH * canvas.dimensions.uiScale, color, alpha: RING_ALPHA });
  graphics.drawCircle(center.x, center.y, ringRadius(limit));
  if (filled) {
    graphics.endFill();
  }
}

// The weapons and spells of the token the user has selected, for their own ruler only:
// nobody knows what the other users have selected.
function selectedOptions(user) {
  const controlled = canvas.tokens.controlled;
  if (!user.isSelf || controlled.length !== 1 || !controlled[0].actor) {
    return [];
  }
  const actor = controlled[0].actor;
  return attackOptions(actor.items, actor.system.characteristics?.size);
}

// Builds on whatever ruler is configured, so the system's or another module's ruler keeps working.
export function createRangeRuler(BaseRuler, enabled) {
  return class RangeRuler extends BaseRuler {
    static WAYPOINT_LABEL_TEMPLATE = modulePath("templates/waypoint-label.hbs");

    #rings = new PIXI.Graphics();

    #options = [];

    async draw() {
      await super.draw();
      // Under every ruler path, so the rings never hide a line.
      canvas.controls._rulerPaths.addChildAt(this.#rings, 0);
    }

    destroy() {
      this.#rings.destroy();
      super.destroy();
    }

    _refresh() {
      this.#options = [];
      if (this.visible && enabled()) {
        this.#options = selectedOptions(this.user);
      }
      super._refresh();
      this.#drawRings();
    }

    _getSegmentStyle(waypoint) {
      return this.#colored(super._getSegmentStyle(waypoint), waypoint);
    }

    _getWaypointStyle(waypoint) {
      return this.#colored(super._getWaypointStyle(waypoint), waypoint);
    }

    _getWaypointLabelContext(waypoint, state) {
      const context = super._getWaypointLabelContext(waypoint, state);
      if (!context || waypoint.next || !enabled()) {
        return context;
      }
      const reading = this.#read(firstWaypoint(waypoint), waypoint);
      if (!reading) {
        return context;
      }
      context.range = {
        band: reading.band,
        label: game.i18n.localize(`SODLRANGE.Bands.${reading.band}`),
        detailed: this.#options.length > 0,
        inRange: reading.inRange.join(OPTION_SEPARATOR),
        farShot: reading.farShot.join(OPTION_SEPARATOR),
        farShotNote: game.i18n.localize("SODLRANGE.Ruler.FarShot"),
        outOfRange: reading.outOfRange.join(OPTION_SEPARATOR)
      };
      return context;
    }

    // The band between two points; with a token selected, also what it can reach there.
    // Yellow when only a far shot reaches, red as soon as none of its weapons or spells reaches that far.
    #read(from, to) {
      const distance = measure(from, to);
      if (distance === null) {
        return null;
      }
      const { inRange, farShot, outOfRange } = sortByRange(this.#options, distance);
      let band = bandForDistance(distance);
      if (this.#options.length && !inRange.length && farShot.length) {
        band = FAR_SHOT;
      }
      if (this.#options.length && !inRange.length && !farShot.length) {
        band = BEYOND;
      }
      return { band, distance, inRange, farShot, outOfRange };
    }

    // The start keeps the user's colour; every other point takes the colour of its band.
    #colored(style, waypoint) {
      if (!enabled() || !waypoint.previous) {
        return style;
      }
      const reading = this.#read(firstWaypoint(waypoint), waypoint);
      if (!reading) {
        return style;
      }
      return { ...style, color: bandColor(reading.band) };
    }

    // The book's bands up to the one measured, plus a red ring where the selected token stops reaching, far shots included.
    #drawRings() {
      this.#rings.clear();
      if (!this.visible || !enabled() || this.path.length < 2) {
        return;
      }
      const distance = measure(this.origin, this.destination);
      if (distance === null) {
        return;
      }
      const band = bandForDistance(distance);
      // Outer rings first, so the current band's fill sits under the inner rings' lines.
      for (const ring of ringsFor(band).reverse()) {
        drawRing(this.#rings, this.origin, { limit: ring.limit, color: ring.color, filled: ring.current });
      }
      if (this.#options.length) {
        drawRing(this.#rings, this.origin, { limit: furthestReach(this.#options), color: bandColor(BEYOND), filled: false });
      }
    }
  };
}
