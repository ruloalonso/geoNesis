function Player (faction) {
  this.faction = faction;
  this.points = 1000;
  this.heroes = null;
  this.leader = new Hero("perry", "perry.png", "test", 200, 30, "revels")
  this.platoons = null;
}
