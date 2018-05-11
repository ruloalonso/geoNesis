function Card (value, img) {
  this.value = value;
  this.img = img;
}

Card.prototype.status = "";
Card.prototype.toDeck = function() { this.status = "deck"; }
Card.prototype.toHand = function() { this.status = "hand"; }
Card.prototype.toBoard = function() { this.status = "play"; }
Card.prototype.discard = function() { this.status = "discarded"; }
