function Display () {
  this.fixMessage = "Welcome to GEONESYS!!! Choose your leaders";
  this.tempMessage = '';
  this.display = null;
}

Display.prototype.print = function(message) {
  clearInterval(this.interval);
  this.display.text(message);
}

Display.prototype.warn = function(message) {
  if (this.interval) clearInterval(this.interval);
  this.tempMessage = message; 
  this.print(this.tempMessage);
  this.interval = setTimeout(function(){
    this.print(this.fixMessage);
    this.tempMessage = '';
  }.bind(this), 3000);
}

Display.prototype.getDisplay = function() {
  this.display = $(".display p");
}