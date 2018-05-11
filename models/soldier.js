function Soldier (name, value, img, damage, health, faction) {
  Card.call(this, name, value, img, damage, health, faction);
  this.name = name;
  this.damage = damage;
  this.health = health;
  this.faction = faction;
}

Soldier.prototype = Object.create(Card.prototype);
Soldier.prototype.constructor = Soldier;

Soldier.prototype.receiveDamage = function(damage) {
  this.health -= damage;
  return this.health > 0 ?
    this.name + " has received " + damage + " points of damage. Health: " + this.health : 
    this.name + " has died in act of combat";
}

Soldier.prototype.attack = function() {
  return this.strength;
}