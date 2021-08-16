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

    console.log("<=== ZombiciderpgItem.prepareData()")
    console.log(this.name);
    console.log(this.data);
    console.log("===> ZombiciderpgItem.prepareData()")
  }

  /** @inheritdoc */
  prepareDerivedData() {
    super.prepareDerivedData();


  }
}
