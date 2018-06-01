function Game () {
  this.phases = ["battle"];
  this.activePhase = null;
  this.activePlayer = null;
  this.players = [new Player("inquisitors"), new Player("revels")];
  this.turnCounter = null;
  this.display = null;
  this.warning = false;
  this.board = new Board();
}

Game.prototype.startGame = function() {
  if (this.turnCounter !== null) {
    this.warn("The game already started");
    return false;
  }
  if (this.players[0].leader === null || this.players[1].leader === null) {
    this.warn("There must be a leader in every army to start the game");
    return false;
  }
    
  this.activePhase = this.phases[0];
  this.activePlayer = 1;
  this.turnCounter = 1;
  this.print("Game started");
  this.checkPhase();
}

Game.prototype.startBattle = function() {
  this.activePlayer = this.players[0];
  this.print("Battle started");
  this.print("It's Inquisitors turn #1");
}

Game.prototype.checkPhase = function() {
  if (this.activePhase === "battle") {
    this.startBattle();
  };
}

Game.prototype.passTurn = function() {
  if (this.turnCounter === null) {
    this.warn("You can't pass turn, The Battle hasn't started yet");
    return false;
  }
  this.print("Your turn has finished");
  if (this.activePlayer.faction === "inquisitors") {
    this.activePlayer = this.players[1];
    this.print("It's Revels turn #" + this.turnCounter);
  } else {
    this.activePlayer = this.players[0];
    this.turnCounter++;
    this.print("It's Inquisitors turn #" + this.turnCounter);
  }
}

Game.prototype.checkGameover = function() {
  if (this.players[0].leader.health <= 0 || this.players[1].leader.health <= 0) {
    return true;
  } else {
    return false;
  }
}

Game.prototype.setListeners = function() {
  $(document).ready(function() {
    mockInquisitorHero = new Hero("Perry Williams", "superman.jpg", "test", 200, 30, 500, "inquisitors", 2, 0, 1);
    mockRevelHero = new Hero("Harry Jovi", "batman.gif", "test", 200, 30, 500, "revels", 2, 4, 1);
    document.getElementById("startGame").onclick = function(){
      game.startGame();
    }
    document.getElementById("passTurn").onclick = function(){
      game.passTurn();
    }
    document.getElementById("addInquisitorLeader").onclick = function(){
      game.addLeader(mockInquisitorHero, game.players[0]);  
    }
    document.getElementById("addRevelLeader").onclick = function(){
      game.addLeader(mockRevelHero, game.players[1]);
    }
    game.display = $(".display p");
  });
}

Game.prototype.print = function(message) {
  this.display.text(message);
}

Game.prototype.warn = function(message) {
  if (this.warning) return false;
  this.warning = true;
  var preText = this.display.text();
  this.print("WARNING! " + message);
  setTimeout(function(){
    this.warning = false; 
    this.print(preText);
  }.bind(this), 3000);
}

Game.prototype.addLeader = function(hero, player) {
  if (player.addLeader(hero)) {
    this.board.zones[hero.x][hero.y].heroes.push(hero);
    this.print(hero.name + " added to Inquisitor's army");
    this.drawHero(hero);
  } else {
    this.warn("Inquisitor's army already has a Leader");
  } 
}

Game.prototype.drawHero = function(hero) {
  // $("range1 zone:first-child").
  var x = hero.x;
  var y = hero.y;
  var col = $(".board").children()[x];
  var zone = $(col).children()[y];
  
  var selector = '.board:nth-child(' + x + '):nth-child('+y+')';
  // debugger;
  console.log(zone);

  var src = "img/" + hero.img;
  $(zone).prepend('<img id="theImg" src="' + src + '" height="140px"/>')
}
