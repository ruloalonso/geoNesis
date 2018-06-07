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

Board.prototype.checkSurroundings = function(hero, distance) {
  var zones = [];
  for (var x = 0; x < this.width; x++) {
    for (var y = 0; y < this.height; y++) {
      if ((hero.x - x >= -distance && hero.x - x <= distance) &&
       (hero.y - y >= -distance && hero.y - y <= distance)) {
        // debugger;
        if(!(hero.x === x && hero.y === y)){
          zones.push([x,y]); 
        }
      }
    }
  }
  return zones;
}

Board.prototype.checkMovility = function(hero) {
  return this.checkSurroundings(hero, 1);
}

Board.prototype.checkRangeAttack = function(hero) {
  return this.checkSurroundings(hero, hero.range);
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

Board.prototype.checkMeleeAttack = function(hero) {
  return hero.zone.find('div').not("#" + hero.name);
}

Board.prototype.clear = function() {
  var zones = this.getAllZones();
  zones.forEach(zone => {
    zone = this.getZone(zone[0], zone[1]);
    $(zone).removeClass("clickable selectable");
    $(zone).off('click');
  });
}
