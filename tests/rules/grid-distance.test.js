import { test } from "node:test";
import assert from "node:assert/strict";
import { closestOffsets, fromRangeUnits, toRangeUnits } from "../../src/rules/grid-distance.js";

test("les mètres et les yards valent un pour un, comme dans la VF", () => {
  assert.equal(toRangeUnits(12, "m"), 12);
  assert.equal(toRangeUnits(12, "yd"), 12);
  assert.equal(toRangeUnits(12, "Mètres"), 12);
  assert.equal(toRangeUnits(12, " yards "), 12);
});

test("les pieds sont convertis en yards", () => {
  assert.equal(toRangeUnits(30, "ft"), 10);
  assert.equal(toRangeUnits(15, "pieds"), 5);
});

test("une unité inconnue ne donne pas de distance de jeu", () => {
  assert.equal(toRangeUnits(3, "km"), null);
  assert.equal(toRangeUnits(3, ""), null);
});

test("entre deux créatures, on mesure depuis les cases les plus proches qu'elles occupent", () => {
  const ogre = [{ i: 0, j: 0 }, { i: 0, j: 1 }, { i: 1, j: 0 }, { i: 1, j: 1 }];
  const goblin = [{ i: 1, j: 5 }];

  const [from, to] = closestOffsets(ogre, goblin);

  assert.deepEqual(from, { i: 1, j: 1 });
  assert.deepEqual(to, { i: 1, j: 5 });
});

test("deux créatures d'une case se mesurent de case à case", () => {
  const [from, to] = closestOffsets([{ i: 2, j: 2 }], [{ i: 4, j: 7 }]);

  assert.deepEqual(from, { i: 2, j: 2 });
  assert.deepEqual(to, { i: 4, j: 7 });
});

test("une portée du livre se convertit dans l'unité de la scène pour dessiner son cercle", () => {
  assert.equal(fromRangeUnits(20, "m"), 20);
  assert.equal(fromRangeUnits(20, "yd"), 20);
  assert.equal(fromRangeUnits(5, "ft"), 15);
  assert.equal(fromRangeUnits(5, "km"), null);
});
