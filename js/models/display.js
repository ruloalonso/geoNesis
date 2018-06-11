function Display () {
  this.fixMessage = "";
  this.tempMessage = '';
  this.display = null;
  this.interval = null;
}

Display.prototype.print = function(message) {
  clearInterval(this.interval);
  this.display.text(message);
}

Display.prototype.warn = function(message) {
  if (this.interval) clearInterval(this.interval);
  this.tempMessage = message; 
  this.print(this.tempMessage);
  this.interval = setTimeout(function(){
    this.print(this.fixMessage);
    this.tempMessage = '';
  }.bind(this), 3000);
}

Display.prototype.getDisplay = function() {
  this.display = $(".display p");
}

Display.prototype.checkTurnStatus = function(player) {
  var actions = 0;
  player.heroes.forEach(hero =>{
    actions += hero.actions;
  });
  this.fixMessage = "It's " + this.capitalizeFirstLetter(player.faction) + " turn #" + player.turn + ". You got " + actions + " actions remaining";
  this.print(this.fixMessage);
}

Display.prototype.capitalizeFirstLetter = function(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

Display.prototype.checkDeployStatus = function(players) {
  var remInqHeroes = 3 - players[0].heroes.length;
  var remRevHeroes = 3 - players[1].heroes.length;
  var inqHeroes = '';
  var revHeroes = '';
  var inqLeader = '';
  var revLeader = '';
  inqHeroes = (remInqHeroes > 0 && !players[0].leader) ? "Inquisitors must deploy " + remInqHeroes + " more heroes. " : '';
  revHeroes = (remRevHeroes > 0 && !players[1].leader) ? "Revels must deploy " + remRevHeroes + " more heroes. " : '';
  inqLeader = (!players[0].hasLeader() && remInqHeroes === 0) ? "Inquisitors must choose their Leader. " : "";
  revLeader = (!players[1].hasLeader() && remRevHeroes === 0) ? "Revels must choose their Leader. " : "";
  this.fixMessage = inqHeroes + revHeroes + inqLeader + revLeader;
  if (remInqHeroes === 0 && remRevHeroes === 0 && players[0].hasLeader() && players[1].hasLeader()) {
    this.fixMessage = "All armys are setted up! Now you can start The Battle";
  }
  this.print(this.fixMessage);
}