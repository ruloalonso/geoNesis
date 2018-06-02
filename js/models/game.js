function Game () {
  this.phases = ["army", "battle"];
  this.activePhase = null;
  this.activePlayer = null;
  this.players = [new Player("inquisitors"), new Player("revels")];
  this.turnCounter = null;
  this.display = null;
  this.board = new Board();
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
  this.activePase = this.phases[1];
  this.turnCounter = 1;
  this.toggleClickable(this.activePlayer.leader);
  this.fixMessage = "You got X actions remaining";
  this.warn("Battle started!!! It's Inquisitors turn #1");
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
  this.fixMessage = "You got X actions remaining";
  this.toggleClickable(this.activePlayer.leader);
  if (this.activePlayer.faction === "inquisitors") {
    this.activePlayer = this.players[1];
    this.toggleClickable(this.activePlayer.leader);
    this.warn("Your turn has finished. It's Revels turn #" + this.turnCounter);
  } else {
    this.activePlayer = this.players[0];
    this.toggleClickable(this.activePlayer.leader);
    this.turnCounter++;
    this.warn("Your turn has finished. It's Inquisitors turn #" + this.turnCounter);
  }
}

Game.prototype.checkGameover = function() {
  if (this.players[0].leader.health <= 0 || this.players[1].leader.health <= 0) {
    return true;
  } else {
    return false;
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
  var faction = capitalizeFirstLetter(player.faction);
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

Game.prototype.toggleClickable = function(hero) {
  var zone = this.getZone(hero.x, hero.y);
  $(zone).children().toggleClass("clickable");
  $(zone).children().click(function() {
    $(zone).children().toggleClass("selected");
    this.selectedHero = hero;    
  }.bind(this));
}

Game.prototype.getZone = function(x, y) {
  var col = $(".board").children()[x];
  return zone = $(col).children()[y];   
}

Game.prototype.checkZonesToMove = function(hero) {
  this.fixMessage = "Select where you want to move your hero";
  this.print(this.fixMessage);
  

}




Game.prototype.setListeners = function() {
  $(document).ready(function() {
    mockInquisitorHero = new Hero("Perry Williams", "superman.jpg", "test", 200, 30, 500, "inquisitors", 2, 0, 1);
    mockRevelHero = new Hero("Harry Jovi", "batman.gif", "test", 200, 30, 500, "revels", 2, 4, 1);
    document.getElementById("startBattle").onclick = function(){
      game.startBattle();
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
    document.getElementById("moveHero").onclick = function(){
      if (game.selectedHero === null) {
        game.warn('YOu must select a hero before');
      } else {
        game.checkZonesToMove(game.selectedHero);
      }      
    }
    game.display = $(".display p");
  });
}


function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
