# Shadow of the Demon Lord - Ranges

🇫🇷 [Version française](README.fr.md)

Foundry VTT module for **Shadow of the Demon Lord**: the book's ranges on the table.

**Compatibility:** Foundry VTT v13+ (tested on v14) | `demonlord` system v6.1.0+

**Languages:** French and English, following Foundry's language setting.

## The book's ranges

| Reach | Short | Medium | Long | Extreme |
|---|---|---|---|---|
| Size rounded up | 5 yd | 20 yd | 100 yd | 500 yd |

The English books count in yards, the French ones in metres: one square is 1 yd or 1 m. Scenes in feet are converted (3 feet = 1 square).

## Features

### Range on the ruler
While measuring with the ruler:
- **range rings** are drawn around the starting point, up to the band reached, which is lightly filled;
- **the line, the waypoints and the label** take the band's colour: "14 yd **medium**".

| Short | Medium | Long | Extreme | Far shot | Out of range |
|---|---|---|---|---|---|
| 🟢 green | 🟠 orange | 🔵 blue | 🟣 purple | 🟡 yellow | 🔴 red |

With several waypoints, the band follows the straight line from the start, since a range is a radius around the creature.

**With a token selected**, the ruler uses its equipped weapons and its spells (those with a range and castings left):
- the label lists what reaches (✔), what reaches with a far shot and 1 bane (⚠) and what does not (✘) at that distance;
- a **red ring** marks the limit beyond which nothing reaches, far shots included;
- the line and the label turn **yellow** when only a far shot reaches, and **red** as soon as no weapon or spell reaches the measured point.

Only your own ruler does this: other users' rulers show the bands only.

### Far shot and out of range
The core rules (*ranged attack options*) allow a **far shot**: a ranged weapon can reach up to twice its range, with 1 bane.

- **Automatic far shot** — When a target is between one and two times the weapon's range, its attack roll automatically gets 1 bane, target by target: "Far shot against Goblin (8 yd): 1 bane." The GM can turn this off for the world.
- **Out of range** — Beyond that, or beyond a spell's range or a melee weapon's reach, the module warns: "Goblin is out of range of Dagger (short, 10 yd max): it is 12 yd away." The roll is never blocked: the GM has the last word.
- Spells have no far shot.

- **Weapons** — The range is read from the properties: `Range (short)`, `Portée (moyenne)`. Without one, the weapon is a reach weapon. `Reach +1` / `Allonge +1` extends it.
- **Spells** — The range is read from the target: "One creature within medium range", "within reach", "Une créature à portée moyenne". Spells with no range in their target ("You", areas) are not checked.
- **Reach** — Size rounded up, plus the weapon's reach bonus. Thrown weapons can still be used in melee.
- **Large creatures** — Distance is measured between the nearest squares of both creatures.

Also works with the `sodl-custom` combat HUD.

## Settings

Each player and the GM turn them on or off for themselves:
- **Range on the ruler**
- **Out of range warning**

For everyone, set by the GM:
- **Automatic far shot**

## Installation

In Foundry: *Add-on Modules → Install Module*, then paste the manifest URL:

```
https://raw.githubusercontent.com/Stphn-Wrn/sodl-range/main/module.json
```

## Development

```sh
npm test
```
