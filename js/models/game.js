function Game () {
  this.activePhase = "army";
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
  if (this.activePhase === "battle") {
    this.warn("What? The Battle already started...");
    return false;
  }
  if (this.players[0].leader === null || this.players[1].leader === null) {
    this.warn("There must be a leader in every army to start kicking asses");
    return false;  
  }
  this.activePlayer = this.players[0];
  this.activePhase = "battle";
  this.turnCounter = 1;
  this.activePlayer.leader.toggleClickable();
  this.setClickListener(this.activePlayer.leader);
  this.checkActionsRemaining();
  this.warn("Battle started!!!");
}

Game.prototype.checkPhase = function() {
  if (this.activePhase === "battle") {
    if (this.turnCounter === null) {
      this.startBattle();
    } else {
      this.checkActionsRemaining();
    };
  }    
}

Game.prototype.setClickListener = function(hero) {
  hero.div.click(function() {
    hero.toggleSelected();
    if (this.selectedHero) {
      this.selectedHero = null;
      this.checkActionsRemaining();
      this.print(this.fixMessage);
    } else {
      this.selectedHero = hero;
      this.fixMessage = hero.name + " is selected. Now choose an action to perform";
      this.print(this.fixMessage);
    };
  }.bind(this));
};

Game.prototype.checkActionsRemaining = function() {
  this.fixMessage = "It's " + this.capitalizeFirstLetter(this.activePlayer.faction) + " turn #" + this.turnCounter + ". You got " + this.activePlayer.actions + " actions remaining";
  // this.print(this.fixMessage);
  if (this.activePlayer.actions === 0) {
    this.warn(this.capitalizeFirstLetter(this.activePlayer.faction) + " turn has finished. You've used up all your actions!");
    this.passTurn();
  }  
}

Game.prototype.passTurn = function() {
  if (this.activePhase !== "battle") {
    this.warn("You can't pass turn, The Battle hasn't started yet!");
    return false;
  }
  if (this.selectedHero) {
    var zone = this.board.getZone(this.selectedHero.x, this.selectedHero.y);
    $(zone).removeClass("selectable");
    this.selectedHero = null;
  }  
  this.activePlayer.resetActions();
  this.activePlayer.leader.removeClickListener();
  this.activePlayer.leader.toggleClickable();
  if (this.activePlayer.faction === "inquisitors") {
    this.activePlayer = this.players[1];
  } else {
    this.activePlayer = this.players[0];
    this.turnCounter++;
  }
  this.activePlayer.leader.toggleClickable();
  this.setClickListener(this.activePlayer.leader);
  this.checkActionsRemaining();
  this.warn("Turn passed!");
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
    hero.draw();
  } else {
    this.warn(faction + " army already has a Leader");
  } 
}

Game.prototype.checkZonesToMove = function(hero) {
  this.fixMessage = "Select where you want to move " + hero.name;
  this.print(this.fixMessage);
  return this.board.checkMovility(hero);
}

Game.prototype.setListeners = function() {
  $(document).ready(function() {
    mockInquisitorHero = new Hero("Gryphon", "superman.jpg", "test", 200, 30, 500, "inquisitors", 2, 1, 1);
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
    zone = this.board.getZone(zone[0], zone[1]);
    $(zone).addClass("clickable selectable");
    $(zone).click(function(clicked) {
      var x = $(clicked.currentTarget).data("x");
      var y = $(clicked.currentTarget).data("y");
      this.moveHero(hero, x, y)
    }.bind(this));
  });
  hero.toggleClickable();
  hero.toggleSelected();
  hero.removeClickListener();
}

Game.prototype.clearBoard = function() {
  var zones = this.board.getAllZones();
  zones.forEach(zone => {
    zone = this.board.getZone(zone[0], zone[1]);
    $(zone).removeClass("clickable selectable");
    $(zone).off('click');
  });
}

Game.prototype.moveHero = function(hero, x, y) {
  this.activePlayer.actions--;
  hero.delete();
  hero.move(x, y);
  hero.draw();
  this.clearBoard();
  this.selectedHero = null;
  hero.toggleClickable();
  this.setClickListener(hero);
  this.warn(hero.name + " moved!");
  this.checkActionsRemaining();
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



