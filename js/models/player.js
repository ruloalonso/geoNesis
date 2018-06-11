function Player (faction) {
  this.faction = faction;
  this.heroes = [];
  this.turn = 0;  
}

Player.prototype.startTurn = function(display) {
  this.turn++;
  this.heroes.forEach(hero => {
    hero.actions = 2;
    hero.addClickable();
    hero.setClickListener(display);
  });
  display.checkTurnStatus(this);
}

Player.prototype.passTurn = function(display) {
  this.heroes.forEach(hero => {
    hero.removeClickListener();
    hero.removeClickable();
    hero.removeSelected();  
  });
  display.warn("Turn passed!!!");
}

Player.prototype.addHero = function(hero) {
  this.heroes.push(hero);
}

Player.prototype.setLeader = function(hero) {
  hero.leader = true;
}

Player.prototype.hasLeader = function() {
  var result = false;
  this.heroes.forEach(hero => {
    if (hero.leader) result = true;;
  });
  return result;
}