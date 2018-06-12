function Game () {
  this.activePhase = "deploy";
  this.players = [new Player("inquisitors"), new Player("revels")];
  this.activePlayer = null;
  this.inactivePlayer = null;
  this.board = new Board(5, 3);
  this.display = new Display();
}


// PHASES 

Game.prototype.startGame = function() {
  $(".board").removeClass("hidden");
  $(".revel-buttons").removeClass("hidden");
  $(".welcome").addClass("hidden");
  this.activePlayer = this.players[1];
  this.display.print("It's Revels turn. Deploy 3 heroes and name your Leader");
}

Game.prototype.startBattle = function() {
  $(".deploy").addClass("hidden");
  $(".battle").removeClass("hidden");
  if (this.activePhase === "battle") {
    this.display.warn("What? The Battle already started...");
    return false;
  }
  this.activePhase = "battle";
  this.players[0].turn = 0;
  this.players[1].turn = 0;
  this.activePlayer = this.players[0];
  this.inactivePlayer = this.players[1];
}


// TURNS

Game.prototype.passTurn = function() {
  this.board.clear();
  this.activePlayer.passTurn(this.display);
  if (this.activePlayer.faction === "inquisitors" || null) {
    this.activePlayer = this.players[1];
    this.inactivePlayer = this.players[0];
  } else {
    this.activePlayer = this.players[0];
    this.inactivePlayer = this.players[1];
  }
  if (this.activePhase === "deploy") {
    $(".revel-buttons").addClass("hidden");
    $(".inquisitor-buttons").removeClass("hidden");
    if (this.activePlayer.faction === "revels") this.startBattle();
  }
  if (this.activePhase === 'battle') this.activePlayer.startTurn(this.display);
}


// MOVE

Game.prototype.previewMove = function() {
  if (this.activePhase !== "battle") {
    this.display.warn("You can't move any hero, The Battle hasn't started yet!");
    return false;
  }
  var hero = this.getActiveHero();
  if (hero === null) {
    this.display.warn("You must select a Hero before moving it!");
    return false;
  }
  this.board.clear();
  hero.startAction(this.activePlayer);
  this.checkZonesToMove(hero).forEach(zone => {
    zone = this.board.getZone(zone[0], zone[1]);
    $(zone).addClass("clickable selectable");
    $(zone).click(function(clicked) {
      var x = $(clicked.currentTarget).data("x");
      var y = $(clicked.currentTarget).data("y");
      if (this.board.zones[x][y].heroes.length > 1) {
        this.display.warn("There can only be 2 heroes per zone!!");
        return false;
      }
      this.moveHero(hero, x, y);
    }.bind(this));
  });
  hero.removeClickable();
  hero.removeSelected();
  hero.removeClickListener();
}

Game.prototype.moveHero = function(hero, x, y) {
  hero.delete();
  hero.move(x, y, this.board);
  hero.draw();
  this.board.clear();
  hero.finishAction(this.activePlayer, this.display);
  this.display.warn(hero.name + " moved!");
}

Game.prototype.checkZonesToMove = function(hero) {
  this.display.fixMessage = "Select where you want to move " + hero.name;
  this.display.print(this.display.fixMessage);
  return this.board.checkMovility(hero);
}


// ATTACK

Game.prototype.previewMeleeAttack = function() {
  if (this.activePhase !== "battle") {
    this.display.warn("You can't attack, The Battle hasn't started yet!");
    return false;
  }
  var hero = this.getActiveHero();
  if (hero === null) {
    this.display.warn("You must select a Hero before moving it!");
    return false;
  }
  var targets = this.board.checkMeleeAttack(hero);
  if (targets.length > 0) {
    this.board.clear();
    hero.startAction(this.activePlayer);  
    var target = targets[0].id;
    this.inactivePlayer.heroes.forEach(hero => {
      if (hero.name === target) target = hero;
    });
    hero.meleeAttack(target);
    this.display.warn("OUCHIE!!!!! " + hero.name + " inflicted " + hero.meleeDamage + " points of damage to " + target.name + ". ");
    this.checkDead(target);
    hero.finishAction(this.activePlayer, this.display);
  } else {
    this.display.warn("Oops! You don't reach any enemy heroes...");
    return false;
  }
}

Game.prototype.previewRangeAttack = function() {
  this.board.clear();
  var hero = this.getActiveHero();
  if (hero.range === 0) {
    this.display.warn("Oops, doggies doesn't throw hairballs....");
    return false;
  }
  hero.startAction(this.activePlayer);
  this.checkZonesToRangeAttack(hero).forEach(zone => {
    zone = this.board.getZone(zone[0], zone[1]);
    $(zone).addClass("selectable");
    $(zone).find('div').not("#" + hero.name).not("." + hero.faction).addClass("clickable");
    $(zone).find('div').not("#" + hero.name).not("." + hero.faction).click(function(clicked) {
      var target = clicked.currentTarget.id;
      this.inactivePlayer.heroes.forEach(hero => {
        if (hero.name === target) target = hero;
      });
      hero.rangeAttack(target);
      this.inactivePlayer.heroes.forEach(hero => {
        hero.removeClickable();
        hero.removeClickListener();
      });
      this.display.warn("OUCHIE!!!!! " + hero.name + " inflicted " + hero.rangeDamage + " points of damage to " + target.name + ". ");
      this.board.clear();
      this.checkDead(target);
      hero.finishAction(this.activePlayer, this.display);
    }.bind(this));
  })
  hero.removeClickable();
  hero.removeSelected();
  hero.removeClickListener();
}

Game.prototype.checkZonesToRangeAttack = function(hero) {
  this.display.print("Select which hero you want to attack");
  return this.board.checkRangeAttack(hero);
}

Game.prototype.checkDead = function(hero) {
  if (hero.health <= 0) {
    if (hero.leader) this.gameOver();
    this.inactivePlayer.removeHero(hero, this.display, this.board);
  }
}

Game.prototype.gameOver = function() {
  alert("CONGRATULATIONS!!!!! You killed the Leader :))))");
  alert("follow me on twitter: @ruloalonso_")
}

Game.prototype.seeHealth = function() {
  var result = ''
  this.players.forEach(player =>  {
    player.heroes.forEach(hero => {
      result+= hero.name + ": ";
      result+= hero.health + ". ";
     })
  })
  this.display.warn(result);
}


// EXTRA

Game.prototype.getActiveHero = function() {
  var hero;
  this.activePlayer.heroes.forEach(element => { if (element.active) hero = element; });
  if (!hero) hero = this.activePlayer.leader;
  return hero;
}

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
      console.log(this.board.zones[x][y]);
      if (this.board.zones[x][y].heroes.length > 1) {
        this.display.warn("There can only be 2 heroes per zone!!");
        return false;
      }
      hero.move(x, y, this.board);
      hero.draw();
      this.board.clear();
      player.addHero(hero);
      this.display.checkDeployStatus(this.activePlayer);
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
      player.heroes.forEach(hero => {
        if (hero.name === clicked.currentTarget.id) {
          player.setLeader(hero);
          this.passTurn();
          // player.heroes.forEach(hero => {
          //   hero.removeClickable();
          //   hero.removeClickListener();
          // })
          if (this.activePhase === "deploy") this.display.checkDeployStatus(this.activePlayer);
          this.display.warn("Leader asigned to " +this.display.capitalizeFirstLetter(player.faction) + "!!! ");
        }
      })
    }.bind(this));
  });
}


