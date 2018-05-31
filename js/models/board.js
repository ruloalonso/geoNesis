function Board () {
  this.zones = []
}

Board.prototype.build = function(width, height) {
  for (var i = 0; i < width; ++i) {
    this.zones[i] = [];
    for (var j = 0; j < height; ++j) {
      this.zones[i][j] = new Zone();
    }
  }
}
