function Unit (name, img, description, meleeDamage, rangeDamage, health, faction, range, x, y) {
  Card.call(this, name, img, description);
  this.meleeDamage = meleeDamage;
  this.rangeDamage = rangeDamage;
  this.health = health;
  this.faction = faction;
  this.range = range;
  this.actions = ["move", "meleeAtack", "rangeAttack"];
  this.x = x;
  this.y = y;
  this.zone = $(".board").find("[data-x=" + this.x + "][data-y=" + this.y + "]");
  this.div = this.zone.find('[id="' + this.name + '"]');
  this.active = false;
}

Unit.prototype.move = function(x, y) {
  this.x = x;
  this.y = y;
  this.updateZoneAndDiv();
}

Unit.prototype.draw = function() {
  this.zone.append('<div class="hero" id="' + this.name + '"><img src="img/' + this.img + '"/></div>');
  this.updateZoneAndDiv();
}

Unit.prototype.delete = function() {
  this.div.remove();
  this.updateZoneAndDiv();
}

Unit.prototype.toggleClickable = function() {
  this.div.toggleClass("clickable");
}

Unit.prototype.removeClickable = function() {
  this.div.removeClass("clickable");
}

Unit.prototype.addClickable = function() {
  this.div.addClass("clickable");
}

Unit.prototype.toggleSelected = function() {
  this.div.toggleClass("selected");
}

Unit.prototype.removeSelected = function() {
  this.div.removeClass("selected");
}

Unit.prototype.removeClickListener = function() {
  this.div.off('click');
}

Unit.prototype.updateZoneAndDiv = function() {
  this.zone = $(".board").find("[data-x=" + this.x + "][data-y=" + this.y + "]");
  this.div = this.zone.find('[id="' + this.name + '"]');
}

Unit.prototype.meleeAttack = function(hero) {
  hero.health -= this.meleeDamage;
}
