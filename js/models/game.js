function Game () {
  this.activePhase = "army";
  this.players = [new Player("inquisitors"), new Player("revels")];
  this.activePlayer = null;
  this.inactivePlayer = null;
  this.turnCounter = null;
  this.board = new Board(5, 3);
  this.interval = null;
  this.fixMessage = "Welcome to GEONESYS!!! Choose your leaders";
  this.tempMessage = '';
  this.leaderCount = 0;
  this.selectedHero = null;
  this.display = null;
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
  this.inactivePlayer = this.players[1];
  this.activePhase = "battle";
  this.turnCounter = 1;
  this.activePlayer.leader.toggleClickable();
  this.checkActionsRemaining(this.activePlayer.leader);
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
  debugger;
  hero.div.click(function() {
    hero.toggleSelected();
    if (this.selectedHero) {
      this.selectedHero = null;
      this.checkActionsRemaining(hero);
      this.print(this.fixMessage);
    } else {
      this.selectedHero = hero;
      this.fixMessage = hero.name + " is selected. Now choose an action to perform";
      this.print(this.fixMessage);
    };
  }.bind(this));
};

Game.prototype.checkActionsRemaining = function(hero) {
  this.fixMessage = "It's " + this.capitalizeFirstLetter(this.activePlayer.faction) + " turn #" + this.turnCounter + ". You got " + this.activePlayer.actions + " actions remaining";
  if (this.activePlayer.actions === 0) {
    this.warn(this.capitalizeFirstLetter(this.activePlayer.faction) + " turn has finished. You've used up all your actions!");
    this.passTurn();
  } else {
    this.setClickListener(hero);
  }
}

Game.prototype.passTurn = function() {
  if (this.activePhase !== "battle") {
    this.warn("You can't pass turn, The Battle hasn't started yet!");
    return false;
  }
  this.selectedHero = null;  
  this.activePlayer.resetActions();
  this.activePlayer.leader.removeClickListener();
  this.activePlayer.leader.removeClickable();
  this.activePlayer.leader.removeSelected();
  this.board.clear();
  if (this.activePlayer.faction === "inquisitors") {
    this.activePlayer = this.players[1];
    this.inactivePlayer = this.players[0];
  } else {
    this.activePlayer = this.players[0];
    this.inactivePlayer = this.players[1];
    this.turnCounter++;
  }
  this.activePlayer.leader.toggleClickable();
  this.checkActionsRemaining(this.activePlayer.leader);
  this.warn("Turn passed!");
}

Game.prototype.print = function(message) {
  clearInterval(this.interval);
  this.display.text(message);
}

Game.prototype.warn = function(message) {
  if (this.interval) clearInterval(this.interval);
  this.tempMessage = this.tempMessage === '' ? message : this.tempMessage + " /// " + message;  
  this.print(this.tempMessage);
  this.interval = setTimeout(function(){
    this.print(this.fixMessage);
    this.tempMessage = '';
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
    mockInquisitorHero = new Hero("Superman", "superman.jpg", "test", 200, 30, 500, "inquisitors", 2, 1, 1);
    mockRevelHero = new Hero("Batman", "batman.gif", "test", 200, 30, 500, "revels", 2, 4, 1);
    $("#startBattle").click(function(){game.startBattle()});
    $("#passTurn").click(function(){game.passTurn()});
    $("#addInquisitorLeader").click(function(){game.addLeader(mockInquisitorHero, game.players[0])});
    $("#addRevelLeader").click(function(){game.addLeader(mockRevelHero, game.players[1])});
    $("#move").click(function(){game.previewMove(game.selectedHero)});
    $("#meleeAttack").click(function(){game.previewMeleeAttack(game.selectedHero)});
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

Game.prototype.moveHero = function(hero, x, y) {
  hero.delete();
  hero.move(x, y);
  hero.draw();
  this.finishAction(hero);
  this.warn(hero.name + " moved!");
}

Game.prototype.capitalizeFirstLetter = function(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

Game.prototype.previewMeleeAttack = function(hero) {
  if (this.activePhase !== "battle") {
    this.warn("You can't attack, The Battle hasn't started yet!");
    return false;
  }
  if (this.selectedHero === null) {
    this.warn("You must select a Hero before attacking!");
    return false;
  }
  var heroes = this.board.checkMeleeAttack(hero);
  if (heroes.length > 0) {
    hero.meleeAttack(this.inactivePlayer.leader);
    this.warn(hero.name + " inflicted " + hero.meleeDamage + " points of damage to " + this.inactivePlayer.leader.name);
    this.finishAction(hero);
  } else {
    this.warn("Oops! You don't reach any enemy heroes...");
  }
}

Game.prototype.finishAction = function(hero) {
  this.activePlayer.actions--;
  this.board.clear();
  this.selectedHero = null;
  hero.addClickable();
  hero.removeSelected();
  this.checkActionsRemaining(hero);
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



