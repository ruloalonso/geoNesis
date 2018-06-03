function Player (faction) {
  this.faction = faction;
  this.leader = null;
  this.actions = 2;
}

Player.prototype.addLeader = function(heroe) {
  this.leader = heroe;
}

Player.prototype.resetActions = function() {
  this.actions = 2;
}

Player.prototype.getActions = function() {
  return this.actions;
}
