function Board () {
  this.zones = []
}

Board.prototype.buildBoard = function(width, height) {
  for (var i = 0; i < height; ++i) {
    this.zones[i] = [];
    for (var j = 0; j < width; ++j) {
      this.zones[i][j] = new Zone();
    }
  }
}
