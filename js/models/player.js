function Player (faction) {
  this.faction = faction;
  this.leader = null;
}

Player.prototype.addLeader = function(heroe) {
  this.leader = heroe;
}
