function Unit (name, img, description, meleeDamage, rangeDamage, health, faction, range, x, y) {
  Card.call(this, name, img, description);
  this.meleeDamage = meleeDamage;
  this.rangeDamage = rangeDamage;
  this.health = health;
  this.faction = faction;
  this.range = range;
  this.actions = ["move", "meleeAtack", "rangeAttack"];
  this.position = [x, y];
}

Unit.prototype.move = function(x, y) {
  this.position = [x, y];
}