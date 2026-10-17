import { FAR_SHOT_SETTING, MODULE_ID, RULER_SETTING, WARNING_SETTING } from "./constants.js";
import { installAttackGuard } from "./foundry/attack-guard.js";
import { createRangeRuler } from "./foundry/range-ruler.js";

function setting(key) {
  return () => game.settings.get(MODULE_ID, key);
}

// The ruler and the warnings are personal; the far shot bane is a rule, so the GM sets it for the world.
const SETTINGS = [
  { key: RULER_SETTING, scope: "client" },
  { key: WARNING_SETTING, scope: "client" },
  { key: FAR_SHOT_SETTING, scope: "world" }
];

Hooks.once("init", () => {
  for (const { key, scope } of SETTINGS) {
    game.settings.register(MODULE_ID, key, {
      name: `SODLRANGE.Settings.${key}.Name`,
      hint: `SODLRANGE.Settings.${key}.Hint`,
      scope,
      config: true,
      type: Boolean,
      default: true
    });
  }
  CONFIG.Canvas.rulerClass = createRangeRuler(CONFIG.Canvas.rulerClass, setting(RULER_SETTING));
});

Hooks.once("ready", () => {
  installAttackGuard({ warnings: setting(WARNING_SETTING), autoFarShot: setting(FAR_SHOT_SETTING) });
});
