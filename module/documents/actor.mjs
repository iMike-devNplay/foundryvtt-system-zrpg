/**
 * Extend the base Actor document to support attributes and groups with a custom template creation dialog.
 * @extends {Actor}
 */
export class ZombiciderpgActor extends Actor {

  /** @override */
  prepareData() {
    // Prepare data for the actor. Calling the super version of this executes
    // the following, in order: data reset (to clear active effects),
    // prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
    // prepareDerivedData().
    super.prepareData();
  }

  /** @override */
  prepareBaseData() {
    // Data modifications in this step occur before processing embedded
    // documents or derived data.
  }

  /**
   * @override
   * Augment the basic actor data with additional dynamic data. Typically,
   * you'll want to handle most of your calculated/derived data in this step.
   * Data calculated in this step should generally not exist in template.json
   * (such as ability modifiers rather than ability scores) and should be
   * available both inside and outside of character sheets (such as if an actor
   * is queried and has a roll executed directly from it).
   */
  prepareDerivedData() {
    const actorData = this.data;
    const data = actorData.data;
    const flags = actorData.flags.zombiciderpg || {};

    // Make separate methods for each Actor type (character, npc, etc.) to keep
    // things organized.
    this._prepareSurvivorData(actorData);
    this._prepareNpsData(actorData);
    this._prepareZombieData(actorData);
  }

  /**
   * Prepare Survivor type specific data
   */
  _prepareSurvivorData(actorData) {
    if (actorData.type !== 'survivor') return;

    // Make modifications to data here. For example:
    const data = actorData.data;

    /* Define Stress and HitPoints */
    data.stress.max = (data.attributes.brains.value*1 + data.attributes.grit.value*1)*2;
    data.hitPoints.max = (data.attributes.muscle.value*1 + data.attributes.grit.value*1)*1;

    data.adrenaline.percentValue = (data.adrenaline.value-0.5)*100/43;
    data.adrenaline.percentBlue = 6*100/43;
    data.adrenaline.percentYellow = 18*100/43;
    data.adrenaline.percentOrange = 42*100/43;
    data.adrenaline.percentRed = 100;
  }

  /**
  * Prepare NPS type specific data
  */
  _prepareNpsData(actorData) {
    if (actorData.type !== 'nps') return;

    // Make modifications to data here. For example:
    const data = actorData.data;
  }

  /**
  * Prepare Zombie type specific data
  */
  _prepareZombieData(actorData) {
    if (actorData.type !== 'zombie') return;

    // Make modifications to data here. For example:
    const data = actorData.data;
  }
}
