/**
 * Extend the base Item document to support attributes and groups with a custom template creation dialog.
 * @extends {Item}
 */
export class ZombiciderpgItem extends Item {

  prepareData(){
    super.prepareData();

    const itemData = this.data;
    const actorData = this.actor ? this.actor.data : {};
    const data = itemData.data;
  }

  /** @inheritdoc */
  prepareDerivedData() {
    super.prepareDerivedData();


  }
}
