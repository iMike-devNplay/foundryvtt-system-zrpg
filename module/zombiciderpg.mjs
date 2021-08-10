/**
 * A simple and flexible system for world-building using an arbitrary collection of character and item attributes
 * Author: Atropos
 */

// Import Modules
import { ZombiciderpgActor } from "./documents/actor.mjs";
import { ZombiciderpgItem } from "./documents/item.mjs";

import { ZombiciderpgActorSheet } from "./sheets/actor-sheet.mjs";
import { ZombiciderpgItemSheet } from "./sheets/item-sheet.mjs";

import { preloadHandlebarsTemplates } from "./helpers/templates.mjs";
import { ZOMBICIDERPG } from "./helpers/config.mjs"

/* -------------------------------------------- */
/*  Foundry VTT Initialization                  */
/* -------------------------------------------- */

/**
 * Init hook.
 */
Hooks.once("init", async function() {
  console.log(`Initializing Zombiciderpg System`);

  game.zombiciderpg = {
    ZombiciderpgActor,
    ZombiciderpgItem
  };

  CONFIG.ZOMBICIDERPG = ZOMBICIDERPG;

  /**
   * Set an initiative formula for the system. This will be updated later.
   * @type {String}
   */
  CONFIG.Combat.initiative = {
    formula: "1d20",
    decimals: 2
  };

  // Define custom Entity classes
  CONFIG.Actor.documentClass = ZombiciderpgActor;
  CONFIG.Item.documentClass = ZombiciderpgItem;

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("zombiciderpg", ZombiciderpgActorSheet, { makeDefault: true });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("zombiciderpg", ZombiciderpgItemSheet, { makeDefault: true });

  // Preload template partials
  await preloadHandlebarsTemplates();
});

Hooks.once("ready", function() {
  // include steps that need to happen after Foundry has fully loaded here.
});

