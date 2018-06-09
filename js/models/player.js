function Player (faction) {
  this.faction = faction;
  this.leader = null;
  this.heroes = []
  this.actions = 2;
}

Player.prototype.addHero = function(heroe) {
  this.heroes.push(heroe);
}

Player.prototype.resetActions = function() {
  this.actions = 2;
}

Player.prototype.setLeader = function(heroe) {
  this.leader = heroe;
}