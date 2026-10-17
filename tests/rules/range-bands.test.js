import { test } from "node:test";
import assert from "node:assert/strict";
import { bandForDistance, rangeLimit, reachOf } from "../../src/rules/range-bands.js";

test("une distance tombe dans la première tranche de portée qui la contient", () => {
  assert.equal(bandForDistance(3), "short");
  assert.equal(bandForDistance(5), "short");
  assert.equal(bandForDistance(5.5), "medium");
  assert.equal(bandForDistance(20), "medium");
  assert.equal(bandForDistance(100), "long");
  assert.equal(bandForDistance(500), "extreme");
});

test("au-delà de la portée extrême, la distance est hors portée", () => {
  const band = bandForDistance(501);

  assert.equal(band, "beyond");
});

test("l'allonge est le Gabarit arrondi à l'entier supérieur, 1 au minimum", () => {
  assert.equal(reachOf("1"), 1);
  assert.equal(reachOf("1/2"), 1);
  assert.equal(reachOf("1/4"), 1);
  assert.equal(reachOf("2"), 2);
  assert.equal(reachOf("3"), 3);
});

test("une arme avec Allonge +1 ajoute 1 à l'allonge de son porteur", () => {
  const reach = reachOf("2", 1);

  assert.equal(reach, 3);
});

test("un Gabarit illisible compte comme un Gabarit 1", () => {
  assert.equal(reachOf(""), 1);
  assert.equal(reachOf(undefined), 1);
  assert.equal(reachOf("grand"), 1);
});

test("la limite d'une portée est le rayon de sa tranche, ou l'allonge de la créature", () => {
  assert.equal(rangeLimit({ band: "short" }, 1), 5);
  assert.equal(rangeLimit({ band: "long" }, 1), 100);
  assert.equal(rangeLimit({ band: "reach" }, 2), 2);
});
