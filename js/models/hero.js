function Hero (name, img, description, meleeDamage, rangeDamage, health, faction, range, x, y) {
  Unit.call(this, name, img, description, meleeDamage, rangeDamage, health, faction, range, x, y);
  this.leader = false;
}

Hero.prototype = Object.create(Unit.prototype);
Hero.prototype.constructor = Unit;