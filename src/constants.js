export const MODULE_ID = "sodl-range";
export const RULER_SETTING = "rulerBands";
export const WARNING_SETTING = "attackWarning";
export const FAR_SHOT_SETTING = "farShotBane";

export function modulePath(relativePath) {
  return `modules/${MODULE_ID}/${relativePath}`;
}
