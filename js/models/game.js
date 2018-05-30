function Game () {
  this.phases = ["heroes", "army", "battle"];
  this.activePhase = null;
  this.players = [new Player("revels"), new Player("inquisitors")];
  this.turnCounter = null;
}