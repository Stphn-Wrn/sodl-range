# L'Ombre du Seigneur Démon - Portées

🇬🇧 [English version](README.md)

Module Foundry VTT pour **L'Ombre du Seigneur Démon** : les portées du livre sur la table.

**Compatibilité :** Foundry VTT v13+ (testé sur v14) | Système `demonlord` v6.1.0+

**Langues :** français et anglais, selon la langue choisie dans Foundry.

## Les portées du livre

| Allonge | Courte | Moyenne | Longue | Extrême |
|---|---|---|---|---|
| Gabarit arrondi au supérieur | 5 m | 20 m | 100 m | 500 m |

Le livre compte en mètres, les livres anglais en yards : une case vaut 1 m ou 1 yd. Une scène en pieds est convertie (3 pieds = 1 case).

## Ce qu'il y a dedans

### Portée sur la règle
Quand on mesure avec la règle :
- **des cercles de portée** sont dessinés autour du point de départ, jusqu'à la tranche atteinte, qui est légèrement remplie ;
- **le trait, les points et l'étiquette** prennent la couleur de la tranche : « 14 m **moyenne** ».

| Courte | Moyenne | Longue | Extrême | Tir distant | Hors portée |
|---|---|---|---|---|---|
| 🟢 vert | 🟠 orange | 🔵 bleu | 🟣 violet | 🟡 jaune | 🔴 rouge |

Avec plusieurs points de passage, la tranche suit la ligne droite depuis le départ, puisqu'une portée est un rayon autour de la créature.

**Avec un token sélectionné**, la règle se sert de ses armes équipées et de ses sorts (ceux qui ont une portée et des incantations restantes) :
- l'étiquette liste ce qui porte (✔), ce qui porte en tir distant avec 1 désavantage (⚠) et ce qui ne porte pas (✘) à cette distance ;
- un **cercle rouge** marque la limite au-delà de laquelle plus rien ne porte, tir distant compris ;
- le trait et l'étiquette passent **en jaune** quand seul un tir distant porte, et **en rouge** dès qu'aucune arme ni aucun sort n'atteint le point visé.

Cela ne concerne que votre propre règle : celle des autres joueurs ne montre que les tranches.

### Tir distant et hors de portée
Le livre (OSD01, *Options des attaques à distance*) permet le **tir distant** : une arme à distance peut atteindre jusqu'à deux fois sa portée, avec 1 désavantage.

- **Tir distant automatique** — Quand une cible est entre une et deux fois la portée de l'arme, son jet d'attaque reçoit automatiquement 1 désavantage, cible par cible : « Tir distant contre Gobelin (8 m) : 1 désavantage. » Le MJ peut couper ce réglage pour le monde.
- **Hors de portée** — Au-delà, ou au-delà de la portée d'un sort ou de l'allonge d'une arme de mêlée, le module prévient : « Gobelin est hors de portée de Dague (courte, 10 m max) : la cible est à 12 m. » Le jet n'est jamais bloqué : le MJ a le dernier mot.
- Les sorts n'ont pas de tir distant.

- **Armes** — La portée est lue dans les propriétés : `Range (short)`, `Portée (moyenne)`. Sans portée, l'arme est une arme d'allonge. `Reach +1` / `Allonge +1` allonge l'arme.
- **Sorts** — La portée est lue dans la cible : « Une créature à portée moyenne », « à portée de votre allonge », « within long range ». Un sort sans portée dans sa cible (« Vous », zones d'effet) n'est pas vérifié.
- **Allonge** — Gabarit arrondi à l'entier supérieur, plus le bonus d'allonge de l'arme. Une arme de jet reste utilisable au corps à corps.
- **Grandes créatures** — La distance se mesure entre les cases les plus proches des deux créatures.

Fonctionne aussi avec le HUD de combat de `sodl-custom`.

## Paramètres

Chacun, joueur ou MJ, active ou non pour lui-même :
- **Portée sur la règle**
- **Avertir hors de portée**

Pour tout le monde, réglé par le MJ :
- **Tir distant automatique**

## Installation

Dans Foundry : *Modules complémentaires → Installer un module*, puis collez l'URL du manifeste :

```
https://raw.githubusercontent.com/Stphn-Wrn/sodl-range/main/module.json
```

## Développement

```sh
npm test
```
