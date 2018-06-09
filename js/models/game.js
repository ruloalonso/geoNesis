function Game () {
  this.activePhase = "deploy";
  this.players = [new Player("inquisitors"), new Player("revels")];
  this.activePlayer = null;
  this.inactivePlayer = null;
  this.turnCounter = null;
  this.board = new Board(5, 3);
  this.interval = null;
  this.selectedHero = null;
  this.display = new Display();
}


// PHASES 

Game.prototype.startBattle = function() {
  if (this.activePhase === "battle") {
    this.display.warn("What? The Battle already started...");
    return false;
  }
  if (this.players[0].leader === null || this.players[1].leader === null) {
    this.display.warn("There must be a leader in every army to start kicking asses");
    return false;  
  }
  this.activePlayer = this.players[0];
  this.inactivePlayer = this.players[1];
  this.activePhase = "battle";
  this.turnCounter = 1;
  this.startAction(this.activePlayer.leader);
  this.checkActionsRemaining(this.activePlayer.leader);
  this.display.warn("Battle started!!!");
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

// ACTIONS

Game.prototype.checkActionsRemaining = function(hero) {
  if (this.activePlayer.actions === 0) {
    this.passTurn();
  } else {
    this.startAction(hero);
  }
}

Game.prototype.startAction = function(hero) {
  if (!hero.active) {
    this.setClickListener(hero);
    hero.active = true;
  }  
  hero.addClickable();
  this.display.printTurn(this.activePlayer, this.turnCounter);
}

Game.prototype.finishAction = function(hero) {
  console.log(hero.name + " finishing action!!!");
  this.activePlayer.actions--;
  this.board.clear();
  this.selectedHero = null;
  hero.active = false;
  hero.removeClickListener();
  hero.removeSelected();
  this.checkActionsRemaining(hero);
}


// TURNS

Game.prototype.passTurn = function() {
  if (this.activePhase !== "battle") {
    this.display.warn("You can't pass turn, The Battle hasn't started yet!");
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
}


// MOVE

Game.prototype.checkZonesToMove = function(hero) {
  this.display.fixMessage = "Select where you want to move " + hero.name;
  this.display.print(this.display.fixMessage);
  return this.board.checkMovility(hero);
}

Game.prototype.previewMove = function(hero) {
  if (this.activePhase !== "battle") {
    this.display.warn("You can't move any hero, The Battle hasn't started yet!");
    return false;
  }
  if (this.selectedHero === null) {
    this.display.warn("You must select a Hero before moving it!");
    return false;
  }
  this.board.clear();
  this.checkZonesToMove(hero).forEach(zone => {
    zone = this.board.getZone(zone[0], zone[1]);
    $(zone).addClass("clickable selectable");
    $(zone).click(function(clicked) {
      var x = $(clicked.currentTarget).data("x");
      var y = $(clicked.currentTarget).data("y");
      this.moveHero(hero, x, y);
    }.bind(this));
  });
  hero.removeClickable();
  hero.removeSelected();
  hero.removeClickListener();
}

Game.prototype.moveHero = function(hero, x, y) {
  hero.delete();
  hero.move(x, y);
  hero.draw();
  this.display.warn(hero.name + " moved!");
  this.finishAction(hero);
}


// ATTACK

Game.prototype.checkAttack = function() {
  if (this.activePhase !== "battle") {
    this.display.warn("You can't attack, The Battle hasn't started yet!");
    return false;
  }
  if (this.selectedHero === null) {
    this.display.warn("You must select a Hero before attacking!");
    return false;
  }
  return true;
}

Game.prototype.previewMeleeAttack = function(hero) {
  if (!this.checkAttack()) return false;
  var heroes = this.board.checkMeleeAttack(hero);
  if (heroes.length > 0) {
    hero.meleeAttack(this.inactivePlayer.leader);
    this.display.warn(hero.name + " inflicted " + hero.meleeDamage + " points of damage to " + this.inactivePlayer.leader.name);
    this.finishAction(hero);
  } else {
    this.display.warn("Oops! You don't reach any enemy heroes...");
  }
}

Game.prototype.previewRangeAttack = function(hero) {
  if (!this.checkAttack()) return false;
  this.checkZonesToRangeAttack(hero).forEach(zone => {
    zone = this.board.getZone(zone[0], zone[1]);
    $(zone).addClass("selectable");
    $(zone).find('div').not("#" + hero.name).addClass("clickable");
    $(zone).find('div').not("#" + hero.name).click(function(clicked) {
      hero.rangeAttack(this.inactivePlayer.leader);
      this.display.warn(hero.name + " inflicted " + hero.rangeDamage + " points of damage to " + this.inactivePlayer.leader.name);
      this.inactivePlayer.leader.removeClickListener();
      this.inactivePlayer.leader.removeClickable();
      this.finishAction(hero);
    }.bind(this));
  })
  hero.removeClickable();
  hero.removeSelected();
  hero.removeClickListener();
}

Game.prototype.checkZonesToRangeAttack = function(hero) {
  this.display.fixMessage = "Select which hero you want to attack";
  this.display.print(this.display.fixMessage);
  return this.board.checkRangeAttack(hero);
}


// LISTENERS

Game.prototype.setListeners = function() {
  $(document).ready(function() {
    mockInquisitorHero = new Hero("Superman", "superman.jpg", "test", 200, 30, 500, "inquisitors", 2, 1, 1);
    mockRevelHero = new Hero("Batman", "batman.gif", "test", 200, 30, 500, "revels", 2, 4, 1);
    game.display.getDisplay();
    $("#startBattle").click(function(){game.startBattle()});
    $("#passTurn").click(function(){game.passTurn()});
    $("#addInquisitorHero").click(function(){game.addHero(inquisitorHeroes[game.players[0].heroes.length], game.players[0])});
    $("#addRevelHero").click(function(){game.addHero(revelHeroes[game.players[1].heroes.length], game.players[1])});
    $("#setInquisitorLeader").click(function(){game.setLeader(game.players[0])});
    $("#setRevelLeader").click(function(){game.setLeader(game.players[1])});
    $("#move").click(function(){game.previewMove(game.selectedHero)});
    $("#meleeAttack").click(function(){game.previewMeleeAttack(game.selectedHero)});
    $("#rangeAttack").click(function(){game.previewRangeAttack(game.selectedHero)});
  });
}

Game.prototype.setClickListener = function(hero) {
  hero.div.click(function() {
    hero.toggleSelected();
    if (this.selectedHero) {
      this.selectedHero = null;
      this.display.printTurn(this.activePlayer, this.turnCounter);
    } else {
      this.selectedHero = hero;
      this.display.fixMessage = hero.name + " is selected. Now choose an action to perform";
      this.display.print(this.display.fixMessage);
    };
  }.bind(this));
};


// EXTRA

Game.prototype.capitalizeFirstLetter = function(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// TODO: MOVE TO PLAYER

Game.prototype.addHero = function(hero, player) {
  if (player.heroes.length > 2) return false;
  var x = player.faction === "inquisitors" ? 1 : 3;
  this.display.print("Choose where you want to place " + hero.name);
  var zones = this.board.getSquare(x, 1, 1);
  zones.forEach(zone => {
    $(zone).addClass("clickable selectable");
    $(zone).click(function(clicked) {
      var x = $(clicked.currentTarget).data("x");
      var y = $(clicked.currentTarget).data("y");
      hero.move(x, y);
      hero.draw();
      this.board.clear();
      player.addHero(hero);
      this.display.checkDeployStatus(this.players);
    }.bind(this));
  });
  var faction = this.capitalizeFirstLetter(player.faction);
}

Game.prototype.setLeader = function(player) {
  if (player.heroes.length < 3) {
    this.display.warn("You must have 3 heroes before setting your Leader");
    return false;
  }
  var x = player.faction === "inquisitors" ? 1 : 3;
  this.display.print("Click on the hero you want to name Leader");
  var zones = this.board.getSquare(x, 1, 1);
  zones.forEach(zone => {
    var heroes = $(zone).find("."+player.faction);
    $(zone).find("."+player.faction).addClass("clickable");
    $(zone).find("."+player.faction).click(function(clicked) {
      console.log(clicked.currentTarget.id);
      player.heroes.forEach(hero => {
        if (hero.name === clicked.currentTarget.id) {
          player.leader = hero;
          player.heroes.splice(player.heroes.indexOf(hero), 1);
          player.leader.removeClickable();
          player.leader.removeClickListener();
          player.heroes.forEach(hero => {
            hero.removeClickable();
            hero.removeClickListener();
          })
          this.display.warn("Leader asigned to " +this.display.capitalizeFirstLetter(player.faction));
          this.display.checkDeployStatus(this.players);
        }
      })
      // console.log($(clicked.currentTarget).find("."+player.faction).attr("id"));
      // var x = $(clicked.currentTarget).data("x");
      // var y = $(clicked.currentTarget).data("y");
      // hero.move(x, y);
      // hero.draw();
      // this.board.clear();
      // player.addHero(hero);
      // this.display.checkDeployStatus(this.players);
    }.bind(this));
  });
}


