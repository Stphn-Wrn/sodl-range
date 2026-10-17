import { test } from "node:test";
import assert from "node:assert/strict";
import { spellRange, weaponRange } from "../../src/rules/range-text.js";

test("une arme sans portée écrite s'utilise à l'allonge", () => {
  const range = weaponRange("Finesse");

  assert.deepEqual(range, { band: "reach", reachBonus: 0, farShot: false });
});

test("la portée d'une arme à distance se lit dans ses propriétés, en anglais comme en français, et permet le tir distant", () => {
  assert.deepEqual(weaponRange("Range (long), Uses Arrows"), { band: "long", reachBonus: 0, farShot: true });
  assert.deepEqual(weaponRange("Finesse, Thrown, Range (short)"), { band: "short", reachBonus: 0, farShot: true });
  assert.deepEqual(weaponRange("Misfire, Range (medium), Reload, Uses Bullets"), { band: "medium", reachBonus: 0, farShot: true });
  assert.deepEqual(weaponRange("Lancer, Portée (moyenne)"), { band: "medium", reachBonus: 0, farShot: true });
  assert.deepEqual(weaponRange("Portée courte"), { band: "short", reachBonus: 0, farShot: true });
});

test("une arme avec Allonge +N reste une arme d'allonge, plus longue", () => {
  assert.deepEqual(weaponRange("Size +1, Reach +2"), { band: "reach", reachBonus: 2, farShot: false });
  assert.deepEqual(weaponRange("Allonge +1"), { band: "reach", reachBonus: 1, farShot: false });
});

test("des propriétés vides ou absentes donnent une arme d'allonge", () => {
  assert.deepEqual(weaponRange(""), { band: "reach", reachBonus: 0, farShot: false });
  assert.deepEqual(weaponRange(undefined), { band: "reach", reachBonus: 0, farShot: false });
});

test("la portée d'un sort se lit dans sa cible traduite", () => {
  assert.deepEqual(spellRange("Une créature à portée moyenne"), { band: "medium" });
  assert.deepEqual(spellRange("Une créature vivante que vous pouvez voir jusqu’à portée courte."), { band: "short" });
  assert.deepEqual(spellRange("Une créature ou un objet à portée longue."), { band: "long" });
  assert.deepEqual(spellRange("Une créature à portée de votre allonge"), { band: "reach" });
});

test("la portée d'un sort se lit aussi dans sa cible en anglais", () => {
  assert.deepEqual(spellRange("One creature within medium range"), { band: "medium" });
  assert.deepEqual(spellRange("One creature or object within long range"), { band: "long" });
  assert.deepEqual(spellRange("One creature within reach"), { band: "reach" });
});

test("un sort sans portée écrite dans sa cible n'est pas vérifié", () => {
  assert.equal(spellRange("Vous"), null);
  assert.equal(spellRange(""), null);
  assert.equal(spellRange(undefined), null);
});
