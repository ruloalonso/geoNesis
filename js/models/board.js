function Board (width, height) {
  this.zones = []
  this.width = width;
  this.height = height;
}

Board.prototype.build = function() {
  for (var i = 0; i < this.width; i++) {
    this.zones[i] = [];
    for (var j = 0; j < this.height; j++) {
      this.zones[i][j] = new Zone();
    }
  }
}

Board.prototype.checkMovility = function(hero) {
  var zones = [];
  for (var x = 0; x < this.width; x++) {
    for (var y = 0; y < this.height; y++) {
      if ((hero.x - x >= -1 && hero.x - x <=1) && (hero.y - y >= -1 && hero.y - y <=1)) {
        // debugger;
        if(!(hero.x === x && hero.y === y)){
          zones.push([x,y]); 
        }
      }
    }
  }
  return zones;
}

Board.prototype.getAllZones = function() {
  var zones = [];
  for (var x = 0; x < this.width; x++) {
    for (var y = 0; y < this.height; y++) {
      zones.push([x,y]); 
    }
  }
  return zones;
}

Board.prototype.getZone = function(x, y) {
  var col = $(".board").children()[x];
  return zone = $(col).children()[y];   
}
