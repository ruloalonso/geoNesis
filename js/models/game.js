function Game () {
  this.phases = ["battle"];
  this.activePhase = null;
  this.activePlayer = null;
  this.players = [new Player("inquisitors"), new Player("revels")];
  this.turnCounter = null;
}

Game.prototype.startGame = function() {
  this.activePhase = this.phases[0];
  this.activePlayer = 1;
  this.turnCounter = 1;
  console.log("Game started");
  this.checkPhase();
}

Game.prototype.startBattle = function() {
  this.activePlayer = this.players[0];
  console.log("Battle started");
  console.log("It's Inquisitors turn #1");
}

Game.prototype.checkPhase = function() {
  if (this.activePhase === "battle") {
    this.startBattle();
  };
}

Game.prototype.passTurn = function() {
  console.log("Your turn has finished");
  if (this.activePlayer.faction === "inquisitors") {
    this.activePlayer = this.players[1];
    console.log("It's Revels turn #" + this.turnCounter);
  } else {
    this.activePlayer = this.players[0];
    this.turnCounter++;
    console.log("It's Inquisitors turn #" + this.turnCounter);
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
  window.onload = function() {
    startGameButton = document.getElementById("startGame");
    passTurnButton = document.getElementById("passTurn");
    startGameButton.onclick = function(){
      game.startGame();
    }
    passTurnButton.onclick = function(){
      game.passTurn();
    }
  }  
}
