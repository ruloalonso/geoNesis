function Game () {
  this.phases = ["army", "battle"];
  this.activePhase = null;
  this.players = [new Player("inquisitors"), new Player("revels")];
  this.activePlayer = null;
  this.turnCounter = null;
  this.display = null;
  this.board = new Board(5, 3);
  this.interval = null;
  this.fixMessage = "Welcome to GEONESYS!!! Choose your leaders";
  this.leaderCount = 0;
  this.selectedHero = null;
}

Game.prototype.startBattle = function() {
  this.activePhase = this.phases[0];
  if (this.turnCounter !== null) {
    this.warn("What? The Battle already started...");
    return false;
  }
  if (this.players[0].leader === null || this.players[1].leader === null) {
    this.warn("There must be a leader in every army to start kicking asses");
    return false;  
  }
  this.activePlayer = this.players[0];
  this.activePhase = this.phases[1];
  this.turnCounter = 1;
  this.toggleClickable(this.activePlayer.leader);
  this.setClickListener(this.activePlayer.leader);
  this.fixMessage = "You got " + this.activePlayer.getActions() +" actions remaining";
  this.warn("Battle started!!! It's Inquisitors turn #1");
}

Game.prototype.checkPhase = function() {
  if (this.activePhase === "battle") {
    this.startBattle();
  };
}

Game.prototype.passTurn = function() {
  if (this.activePhase !== "battle") {
    this.warn("You can't pass turn, The Battle hasn't started yet!");
    return false;
  }
  this.activePlayer.resetActions();
  this.removeClickListener(this.activePlayer.leader);
  this.selectedHero = null;
  this.fixMessage = "You got " + this.activePlayer.getActions() + " actions remaining";
  this.toggleClickable(this.activePlayer.leader);
  if (this.activePlayer.faction === "inquisitors") {
    this.activePlayer = this.players[1];
    this.toggleClickable(this.activePlayer.leader);
    this.setClickListener(this.activePlayer.leader);
    this.fixMessage = "You got " + this.activePlayer.getActions() + " actions remaining";
    this.warn("Your turn has finished. It's Revels turn #" + this.turnCounter);
  } else {
    this.activePlayer = this.players[0];
    this.toggleClickable(this.activePlayer.leader);
    this.turnCounter++;
    this.setClickListener(this.activePlayer.leader);
    this.fixMessage = "You got " + this.activePlayer.getActions() + " actions remaining";
    this.warn("Your turn has finished. It's Inquisitors turn #" + this.turnCounter);
  }
}

Game.prototype.print = function(message) {
  clearInterval(this.interval);
  this.display.text(message);
}

Game.prototype.warn = function(message) {
  if (this.interval) clearInterval(this.interval);  
  this.print(message);
  this.interval = setTimeout(function(){
    this.print(this.fixMessage);
  }.bind(this), 3000);
}

Game.prototype.addLeader = function(hero, player) {
  var faction = this.capitalizeFirstLetter(player.faction);
  if (player.leader === null) {
    player.addLeader(hero);
    this.leaderCount++;
    this.board.zones[hero.x][hero.y].heroes.push(hero);
    this.warn(hero.name + " added to " + faction + " army");
    if (this.leaderCount == 1) this.fixMessage = "Choose the other's army leader";
    if (this.leaderCount == 2) this.fixMessage = "All armys are setted up! Now you can start The Battle when you are ready";
    this.drawHero(hero);
  } else {
    this.warn(faction + " army already has a Leader");
  } 
}

Game.prototype.drawHero = function(hero) {
  var zone = this.getZone(hero.x, hero.y);
  var src = "img/" + hero.img;
  $(zone).append('<img id="theImg" src="' + src + '" height="100px"/>');
}

Game.prototype.deleteHero = function(hero) {
  var zone = this.getZone(hero.x, hero.y);
  $(zone).children().remove();
}

Game.prototype.toggleClickable = function(hero) {
  var zone = this.getZone(hero.x, hero.y);
  $(zone).children().toggleClass("clickable");
}

Game.prototype.toggleSelected = function(hero) {
  var zone = this.getZone(hero.x, hero.y);
  $(zone).children().toggleClass("selected");
}

Game.prototype.setClickListener = function(hero) {
  var zone = this.getZone(hero.x, hero.y);
  debugger;
  $(zone).children().click(function() {
    this.toggleSelected(hero);
    if (this.selectedHero) {
      this.selectedHero = null;
      this.fixMessage = "You got " + this.activePlayer.getActions() + " actions remaining";
      this.print(this.fixMessage);
    } else {
      this.selectedHero = hero;
      this.fixMessage = hero.name + " is selected. Now choose an action to perform";
      this.print(this.fixMessage);
    };
  }.bind(this));
};

Game.prototype.removeClickListener = function(hero) {
  var zone = this.getZone(hero.x, hero.y);
  $(zone).children().off('click');
}

Game.prototype.getZone = function(x, y) {
  var col = $(".board").children()[x];
  return zone = $(col).children()[y];   
}

Game.prototype.checkZonesToMove = function(hero) {
  this.fixMessage = "Select where you want to move " + hero.name;
  this.print(this.fixMessage);
  return this.board.checkMovility(hero);
}

Game.prototype.setListeners = function() {
  $(document).ready(function() {
    mockInquisitorHero = new Hero("Perry Williams", "superman.jpg", "test", 200, 30, 500, "inquisitors", 2, 1, 1);
    mockRevelHero = new Hero("Harry Jovi", "batman.gif", "test", 200, 30, 500, "revels", 2, 4, 1);
    $("#startBattle").click(function(){game.startBattle()});
    $("#passTurn").click(function(){game.passTurn()});
    $("#addInquisitorLeader").click(function(){game.addLeader(mockInquisitorHero, game.players[0])});
    $("#addRevelLeader").click(function(){game.addLeader(mockRevelHero, game.players[1])});
    $("#moveHero").click(function(){game.previewMove(game.selectedHero)});
    game.display = $(".display p");
  });
}

Game.prototype.previewMove = function(hero) {
  if (this.activePhase !== "battle") {
    this.warn("You can't move any hero, The Battle hasn't started yet!");
    return false;
  }
  if (this.selectedHero === null) {
    this.warn("You must select a Hero before moving it!");
    return false;
  }
  this.checkZonesToMove(hero).forEach(zone => {
    zone = this.getZone(zone[0], zone[1]);
    $(zone).addClass("clickable selectable");
    $(zone).click(function(clicked) {
      this.moveHero(hero, clicked.target.dataset.x, clicked.target.dataset.y)
    }.bind(this));
  });
  this.toggleClickable(hero);
  this.toggleSelected(hero);
  this.removeClickListener(hero);

}

Game.prototype.clearBoard = function() {
  var zones = this.board.getAllZones();
  zones.forEach(zone => {
    zone = this.getZone(zone[0], zone[1]);
    $(zone).removeClass("clickable selectable");
    $(zone).off('click');
  });
}

Game.prototype.moveHero = function(hero, x, y) {
  this.activePlayer.actions--;
  this.deleteHero(hero);
  hero.move(x, y);
  this.drawHero(hero);
  this.clearBoard();
  this.selectedHero = null;
  this.toggleClickable(hero);
  this.setClickListener(hero);
  this.warn(hero.name + " moved!");
  this.fixMessage = "You got " + this.activePlayer.getActions() + " actions remaining";
}

Game.prototype.capitalizeFirstLetter = function(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Game.prototype.cancelAction = function() {
//   this.board.getAllZones().forEach(function(zone) {
//     $(this.getZone(zone[0], zone[1])).removeClass("clickable selectable");
//   }.bind(this));
//   this.warn("Action cancelled!");
//   this.setClickListener(this.activePlayer.leader);
// }

// $(this.getZone(hero.x, hero.y)).children().click(function() {
//   this.cancelAction();
// }.bind(this));     



