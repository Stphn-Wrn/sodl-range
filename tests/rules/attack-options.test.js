import { test } from "node:test";
import assert from "node:assert/strict";
import { attackOptions, furthestReach, sortByRange } from "../../src/rules/attack-options.js";

test("les armes équipées et les sorts avec une portée deviennent des options d'attaque", () => {
  const items = [
    { type: "weapon", name: "Arc long", system: { properties: "Range (long), Uses Arrows", wear: true } },
    { type: "weapon", name: "Dague", system: { properties: "Finesse, Thrown, Range (short)", wear: true } },
    { type: "spell", name: "Projectile de feu", system: { target: "Une créature ou un objet à portée longue.", castings: { value: "0", max: "3" } } },
    { type: "item", name: "Corde", system: {} }
  ];

  const options = attackOptions(items, 1);

  assert.deepEqual(options, [
    { name: "Arc long", limit: 100, farLimit: 200 },
    { name: "Dague", limit: 5, farLimit: 10 },
    { name: "Projectile de feu", limit: 100, farLimit: null }
  ]);
});

test("une arme rangée dans le sac n'est pas une option", () => {
  const items = [{ type: "weapon", name: "Épée", system: { properties: "", wear: false } }];

  const options = attackOptions(items, 1);

  assert.deepEqual(options, []);
});

test("un sort sans portée dans sa cible ou sans incantation restante n'est pas une option", () => {
  const items = [
    { type: "spell", name: "Armure de feu", system: { target: "Vous", castings: { value: "0", max: "2" } } },
    { type: "spell", name: "Éclair", system: { target: "Une créature à portée moyenne", castings: { value: "2", max: "2" } } }
  ];

  const options = attackOptions(items, 1);

  assert.deepEqual(options, []);
});

test("un sort sans maximum d'incantations reste toujours disponible", () => {
  const items = [{ type: "spell", name: "Contact glacial", system: { target: "Une créature à portée de votre allonge", castings: { value: "5", max: "0" } } }];

  const options = attackOptions(items, 2);

  assert.deepEqual(options, [{ name: "Contact glacial", limit: 2, farLimit: null }]);
});

test("une arme d'allonge porte à l'allonge de la créature, plus son bonus, sans tir distant", () => {
  const items = [{ type: "weapon", name: "Hallebarde", system: { properties: "Reach +1", wear: true } }];

  const options = attackOptions(items, 1);

  assert.deepEqual(options, [{ name: "Hallebarde", limit: 2, farLimit: null }]);
});

test("à une distance donnée, on sépare ce qui porte, ce qui porte en tir distant et ce qui ne porte pas", () => {
  const options = [
    { name: "Arc long", limit: 100, farLimit: 200 },
    { name: "Dague", limit: 5, farLimit: 10 },
    { name: "Épée", limit: 1, farLimit: null }
  ];

  const sorted = sortByRange(options, 8);

  assert.deepEqual(sorted, { inRange: ["Arc long"], farShot: ["Dague"], outOfRange: ["Épée"] });
});

test("une cible pile à la limite est à portée", () => {
  const sorted = sortByRange([{ name: "Dague", limit: 5, farLimit: 10 }], 5);

  assert.deepEqual(sorted, { inRange: ["Dague"], farShot: [], outOfRange: [] });
});

test("le plus loin qu'une créature puisse attaquer compte le tir distant", () => {
  const options = [
    { name: "Dague", limit: 5, farLimit: 10 },
    { name: "Éclair", limit: 20, farLimit: null }
  ];

  assert.equal(furthestReach(options), 20);
  assert.equal(furthestReach([{ name: "Fronde", limit: 20, farLimit: 40 }]), 40);
});
