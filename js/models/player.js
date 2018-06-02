function Player (faction) {
  this.faction = faction;
  this.leader = null;
  this.actions = 2;
}

Player.prototype.addLeader = function(heroe) {
  this.leader = heroe;
}
