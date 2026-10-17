import { test } from "node:test";
import assert from "node:assert/strict";
import { checkRange } from "../../src/rules/range-check.js";

test("une cible à portée moyenne d'un arc (portée longue) est à portée", () => {
  const result = checkRange({ distance: 18, range: { band: "long", farShot: true }, reach: 1 });

  assert.deepEqual(result, { status: "inRange", limit: 100 });
});

test("au-delà de sa portée et jusqu'au double, une arme à distance peut faire un tir distant", () => {
  const result = checkRange({ distance: 7, range: { band: "short", farShot: true }, reach: 1 });

  assert.deepEqual(result, { status: "farShot", limit: 5 });
});

test("pile au double de la portée, le tir distant est encore possible", () => {
  const result = checkRange({ distance: 10, range: { band: "short", farShot: true }, reach: 1 });

  assert.equal(result.status, "farShot");
});

test("au-delà du double de la portée, la cible est hors de portée", () => {
  const result = checkRange({ distance: 11, range: { band: "short", farShot: true }, reach: 1 });

  assert.deepEqual(result, { status: "outOfRange", limit: 5 });
});

test("un sort n'a pas de tir distant : au-delà de sa portée, il ne porte pas", () => {
  const result = checkRange({ distance: 7, range: { band: "short" }, reach: 1 });

  assert.deepEqual(result, { status: "outOfRange", limit: 5 });
});

test("une arme de mêlée touche une cible adjacente, pas une cible à 2 m", () => {
  assert.equal(checkRange({ distance: 1, range: { band: "reach", farShot: false }, reach: 1 }).status, "inRange");
  assert.equal(checkRange({ distance: 2, range: { band: "reach", farShot: false }, reach: 1 }).status, "outOfRange");
});

test("une lance d'allonge +1 tenue par une créature de Gabarit 1 touche à 2 m", () => {
  const result = checkRange({ distance: 2, range: { band: "reach", farShot: false }, reach: 2 });

  assert.deepEqual(result, { status: "inRange", limit: 2 });
});

test("une arme de jet reste utilisable au corps à corps, même si l'allonge dépasse sa portée", () => {
  const result = checkRange({ distance: 6, range: { band: "short", farShot: true }, reach: 6 });

  assert.deepEqual(result, { status: "inRange", limit: 6 });
});
