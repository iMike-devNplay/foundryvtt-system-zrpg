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
      width: 720,
      height: 750,
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
    console.log("<=== ZombiciderpgActorSheet.getData()")
    console.log(actorData);
    console.log("===> ZombiciderpgActorSheet.getData()")
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
    context.data.skills.basicSkills.slot1 = undefined;
    context.data.skills.advancedSkills.slot1 = undefined;
    context.data.skills.advancedSkills.slot2 =undefined;
    context.data.skills.masterSkills.slot1 = undefined;
    context.data.skills.masterSkills.slot2 = undefined;
    context.data.skills.ultimateSkills.slot1 = undefined;
    context.data.skills.ultimateSkills.slot2 = undefined;
    context.data.skills.ultimateSkills.slot3 = undefined;
    context.data.readySlot.slot1 = undefined;
    context.data.readySlot.slot2 = undefined;
    context.data.holsterSlot.slot1 = undefined;
    context.data.holsterSlot.slot2 = undefined;
    context.data.backpackSlot.slot1 = undefined;
    context.data.backpackSlot.slot2 = undefined;

    for (let i of context.items)
    {
      i.img = i.img || DEFAULT_TOKEN;
      if (context.actor.data.type == 'survivor') 
      {
        if (i.type == 'skill') 
        {
          if (i.data.assignedRank == 'basic') 
          {
            if (!context.data.skills.basicSkills.slot1) context.data.skills.basicSkills.slot1 = i;
          }
          else if (i.data.assignedRank == 'advanced') {
            if (!context.data.skills.advancedSkills.slot1) context.data.skills.advancedSkills.slot1 = i;
            else if (!context.data.skills.advancedSkills.slot2)context.data.skills.advancedSkills.slot2 = i;
          }
          else if (i.data.assignedRank == 'master') {
            if (!context.data.skills.masterSkills.slot1) context.data.skills.masterSkills.slot1 = i;
            else if (!context.data.skills.masterSkills.slot2) context.data.skills.masterSkills.slot2 = i;
          }
          else if (i.data.assignedRank == 'ultimate') {
            if (!context.data.skills.ultimateSkills.slot1) context.data.skills.ultimateSkills.slot1 = i;
            else if (!context.data.skills.ultimateSkills.slot2) context.data.skills.ultimateSkills.slot2 = i;
            else if (!context.data.skills.ultimateSkills.slot3) context.data.skills.ultimateSkills.slot3 = i;
          }
        }
        else if (i.type == 'weapon' || i.type == 'item')
        {
          if(i.data.assignedSlot == "ready-slot")
          {
            if (!context.data.readySlot.slot1) context.data.readySlot.slot1 = i;
            else if (!context.data.readySlot.slot2) context.data.readySlot.slot2 = i;
          }
          else if(i.data.assignedSlot == "holster-slot")
          {
            if (!context.data.holsterSlot.slot1) context.data.holsterSlot.slot1 = i;
            else if (!context.data.holsterSlot.slot2) context.data.holsterSlot.slot2 = i;
          }
          else if(i.data.assignedSlot == "backpack-slot")
          {
            if (!context.data.backpackSlot.slot1) context.data.backpackSlot.slot1 = i;
            else if (!context.data.backpackSlot.slot2) context.data.backpackSlot.slot2 = i;
          }
        }
      }
    }
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
      //console.log(item);
      item.sheet.render(true);
    });

    // -------------------------------------------------------------
    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Add Inventory Item
    html.find('.item-create').click(this._onItemCreate.bind(this));

    html.find('.item-unassign').click(ev => {
      console.log("Unassign");
      const li = $(ev.currentTarget).parents(".item");
      const itemId = li.data("itemId");
      const item = this.actor.items.get(itemId);
      console.log(item.data.data)
      item.data.data.assignedRank = undefined;
      this.render(false);
    });

    // Delete Inventory Item
    html.find('.item-delete').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      //console.log("<=== activateListeners");
      const itemId = li.data("itemId");
      const item = this.actor.items.get(itemId);
      item.delete();
      li.slideUp(200, () => this.render(false));
      //console.log("<=== activateListeners");
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


  assignSkill(itemData, rank)
  {
    console.log("Choose " + rank);
    itemData.data.assignedRank = rank;
    return super._onDropItemCreate(itemData);
  };

  /** @override */
  async _onDropItemCreate(itemData) {
    console.log(itemData);
    itemData.data.isOwned = true;

    /* Skill management */
    if (itemData.type == "skill")
    {
      const actorSkills = this.actor.data.data.skills;
      console.log(actorSkills);
      new Dialog({
        title: "New Skill : Choose rank",
        content: "<p>Choose rank for this new skill: </p>",
        buttons: {
          basic: {
            icon: '<i class="fas fa-check"></i>',
            label: "Basic",
            callback: () => this.assignSkill(itemData, "basic")
          },
          advanced: {
            icon: '<i class="fas fa-check"></i>',
            label: "Advanced",
            callback: () => this.assignSkill(itemData, "advanced")
          },
          master: {
            icon: '<i class="fas fa-check"></i>',
            label: "Master",
            callback: () => this.assignSkill(itemData, "master")
          },
          ultimate: {
            icon: '<i class="fas fa-check"></i>',
            label: "Ultimate",
            callback: () => this.assignSkill(itemData, "ultimate")
          },
          cancel: {
            icon: '<i class="fas fa-times"></i>',
            callback: () => {}
          }
        }
      }).render(true);
    }

    /* Weapon management */
    if (itemData.type == 'weapon')
    {
      return super._onDropItemCreate(itemData);
    }

    /* Item management */
    if (itemData.type == 'item')
    {
      return super._onDropItemCreate(itemData);
    }

    //itemData.data.assignedRank = item.data.rank;
  }
}
