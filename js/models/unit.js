function Unit (name, img, description, meleeDamage, rangeDamage, health, faction, range, x, y) {
  Card.call(this, name, img, description);
  this.meleeDamage = meleeDamage;
  this.rangeDamage = rangeDamage;
  this.health = health;
  this.faction = faction;
  this.range = range;
  this.actions = ["move", "meleeAtack", "rangeAttack"];
  this.x = x;
  this.y = y;
}

Unit.prototype.move = function(x, y) {
  this.x = x;
  this.y = y;
}