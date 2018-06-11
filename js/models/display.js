function Display () {
  this.fixMessage = "";
  this.tempMessage = '';
  this.display = null;
  this.interval = null;
}

Display.prototype.print = function(message) {
  if (this.interval) clearInterval(this.interval);
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
  player.heroes.forEach(hero => {
    actions += hero.actions;
  });
  this.fixMessage = "It's " + this.capitalizeFirstLetter(player.faction) + " turn #" + player.turn + ". You got " + actions + " actions remaining";
  debugger;
  this.print(this.fixMessage);
}

Display.prototype.capitalizeFirstLetter = function(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

Display.prototype.checkDeployStatus = function(player) {
  var faction = this.capitalizeFirstLetter(player.faction);
  var remHeroes = 3 - player.heroes.length;
  var heroes = '';
  var leader = '';  
  heroes = (remHeroes !== 0) ? faction + " must deploy " + remHeroes + " more heroes." : "";
  leader = (!player.hasLeader() && remHeroes === 0) ? faction + " must choose their Leader IN SECRET!!! Choose wisely, if your Leader gets killed, you loose!!!" : "";
  this.fixMessage = heroes + leader;
  this.print(this.fixMessage);
}