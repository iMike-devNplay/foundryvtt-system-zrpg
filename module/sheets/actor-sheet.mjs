/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class ZombiciderpgActorSheet extends ActorSheet {

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["zombiciderpg", "sheet", "actor"],
      template: "systems/zombiciderpg/templates/actor-sheet.html",
      width: 600,
      height: 600,
      tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "actions"}]
    });
  }

  /** @override */
  get template() {
    return `systems/zombiciderpg/templates/actor/actor-${this.actor.data.type}-sheet.html`;
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  getData() {
    const context = super.getData();
    const actorData = context.actor.data;

    context.data = actorData.data;
    context.flags = actorData.flags;
    
    if (actorData.type == 'survivor') {
      this._prepareItems(context);
      this._prepareCharacterData(context);
    }
  
    // Prepare NPS data and items.
    if (actorData.type == 'nps') {
      this._prepareItems(context);
    }

    // Prepare Zombie
    if (actorData.type == 'zombie') {
      //this._prepareItems(context);
    }

    // Prepare active effects
    //context.effects = prepareActiveEffectCategories(this.actor.effects);

    return context;
  }

  /**
   * Organize and classify Items for Character sheets.
   *
   * @param {Object} actorData The actor to prepare.
   *
   * @return {undefined}
   */
  _prepareItems(context) {
    // Initialize containers.
    console.log(context.data.skills);
    // Iterate through items, allocating to containers
    for (let i of context.items) {
      console.log(i);
      i.img = i.img || DEFAULT_TOKEN;
      // Append to gear.
      if (i.type === 'weapon' || i.type === 'item') {
        //gear.push(i);
      }
      if (context.data.type === 'survivor'){
        // Append to actions.
        if (i.type === 'action') {
          //actions.push(i);
        }
        // Append to skills.
        else if (i.type === 'skill') {
          if (i.data.rank == 0) {
            context.data.skills.basicSkills.slot1 = i;
          }
        }
      }
    }
    console.log(context.data.skills);
  }

  /**
   * Organize and classify Items for Character sheets.
   *
   * @param {Object} actorData The actor to prepare.
   *
   * @return {undefined}
   */
  _prepareCharacterData(context) {
    for (let [k, v] of Object.entries(context.data.attributes)) {
      v.label = game.i18n.localize(CONFIG.ZOMBICIDERPG.attributes[k]) ?? v.label ?? k;
    }
    for (let [k, v] of Object.entries(context.data.proficiencies)) {
      v.label = game.i18n.localize(CONFIG.ZOMBICIDERPG.proficiencies[k]) ?? v.label ?? k;
    }
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Render the item sheet for viewing/editing prior to the editable check.
    html.find('.item-edit').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      item.sheet.render(true);
    });

    // -------------------------------------------------------------
    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Add Inventory Item
    html.find('.item-create').click(this._onItemCreate.bind(this));

    // Delete Inventory Item
    html.find('.item-delete').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      item.delete();
      li.slideUp(200, () => this.render(false));
    });
  }

  /* -------------------------------------------- */

  /**
   * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
   * @param {Event} event   The originating click event
   * @private
   */
  async _onItemCreate(event) {
    event.preventDefault();
    const header = event.currentTarget;
    // Get the type of item to create.
    const type = header.dataset.type;
    // Grab any data associated with this control.
    const data = duplicate(header.dataset);
    // Initialize a default name.
    const name = `New ${type.capitalize()}`;
    // Prepare the item object.
    const itemData = {
      name: name,
      type: type,
      data: data
    };
    // Remove the type from the dataset since it's in the itemData.type prop.
    delete itemData.data["type"];

    // Finally, create the item!
    return await Item.create(itemData, {parent: this.actor});
  }       
}
