import { test } from "node:test";
import assert from "node:assert/strict";
import { bandColor, ringsFor } from "../../src/rules/range-style.js";

test("chaque tranche de portée a sa couleur, et le hors portée est rouge", () => {
  assert.equal(bandColor("short"), 0x2ecc40);
  assert.equal(bandColor("medium"), 0xff851b);
  assert.equal(bandColor("long"), 0x0074d9);
  assert.equal(bandColor("extreme"), 0xb10dc9);
  assert.equal(bandColor("beyond"), 0xff4136);
});

test("la zone de tir distant est jaune", () => {
  assert.equal(bandColor("farShot"), 0xffdc00);
});

test("en portée courte, seul le cercle de 5 m est dessiné, mis en avant", () => {
  const rings = ringsFor("short");

  assert.deepEqual(rings, [{ band: "short", limit: 5, color: 0x2ecc40, current: true }]);
});

test("en portée moyenne, on voit le cercle de la portée courte et celui de la moyenne, mis en avant", () => {
  const rings = ringsFor("medium");

  assert.deepEqual(rings, [
    { band: "short", limit: 5, color: 0x2ecc40, current: false },
    { band: "medium", limit: 20, color: 0xff851b, current: true }
  ]);
});

test("hors portée, tous les cercles sont dessinés et aucun n'est mis en avant", () => {
  const rings = ringsFor("beyond");

  assert.deepEqual(rings.map((ring) => ring.band), ["short", "medium", "long", "extreme"]);
  assert.ok(rings.every((ring) => !ring.current));
});
