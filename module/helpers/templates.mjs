/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function() {

  // Define template paths to load
  const templatePaths = [
    "systems/zombiciderpg/templates/actor/parts/actor-skill-item.html",
    "systems/zombiciderpg/templates/actor/parts/actor-weapon-item.html",
    "systems/zombiciderpg/templates/actor/parts/actor-action-item.html",
    "systems/zombiciderpg/templates/actor/parts/actor-config-item.html",
    "systems/zombiciderpg/templates/actor/parts/actor-bio.html"
  ];

  // Load the template parts
  return loadTemplates(templatePaths);
};