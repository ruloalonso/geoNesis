function Unit (name, img, description, meleeDamage, rangeDamage, health, faction, range) {
  Card.call(this, name, img, description);
  this.meleeDamage = meleeDamage;
  this.rangeDamage = rangeDamage;
  this.health = health;
  this.faction = faction;
  this.range = range;
  this.actions = ["move", "meleeAtack", "rangeAttack"];
  this.position = null;
  this.status = null;
}