function Platoon (name, img, description, meleeDamage, rangeDamage, health, faction, range, value, type) {
  Unit.call(this, name, img, description, meleeDamage, rangeDamage, health, faction, range);
  this.meleeDamage = meleeDamage;
  this.rangeDamage = rangeDamage;
  this.health = health;
  this.faction = faction;
  this.range = range;
  this.actions = ["move", "meleeAtack", "rangeAttack"];
  this.position = null;
  this.status = null;
  this.amount = null
  this.value = null;
  this.type = null;
}
