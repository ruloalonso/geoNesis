function Player (faction) {
  this.faction = faction;
  this.leader = null;
}

Player.prototype.addLeader = function(heroe) {
  if (this.leader !== null) return false;
  this.leader = heroe;
  return true;
}
