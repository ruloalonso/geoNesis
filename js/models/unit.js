function Unit (name, img, description, meleeDamage, rangeDamage, health, faction, range, x, y) {
  Card.call(this, name, img, description);
  this.meleeDamage = meleeDamage;
  this.rangeDamage = rangeDamage;
  this.health = health;
  this.faction = faction;
  this.range = range;
  this.x = x;
  this.y = y;
  this.zone = $(".board").find("[data-x=" + this.x + "][data-y=" + this.y + "]");
  this.div = this.zone.find('[id="' + this.name + '"]');
  this.active = false;
  this.actions = 2;
}

Unit.prototype.startAction = function(player) {
  player.heroes.forEach(hero => {
    if (hero.name !== this.name) {
      hero.removeClickable();
      hero.removeClickListener();
    }
  });
}

Unit.prototype.finishAction = function(player, display) {
  this.actions--;
  this.active = false;
  this.removeSelected();
  player.heroes.forEach(hero => {
    console.log(hero);
    if (hero.actions > 0) {
      hero.setClickListener(display);
      hero.addClickable();
    }
  });  
  display.checkTurnStatus(game.activePlayer);
}

// CLICKS and STYLE

Unit.prototype.setClickListener = function(display) {
  this.div.click(function() {
    this.toggleSelected();
    if (this.active) {
      this.active = false;
      display.checkTurnStatus(game.activePlayer);
    } else {
      this.active = true;
      display.fixMessage = this.name + " is selected. Now choose an action to perform.";
      display.print(display.fixMessage);
    };
  }.bind(this));
};

Unit.prototype.removeClickListener = function() {
  this.div.off('click');
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


// ACTIONS

Unit.prototype.move = function(x, y) {
  this.x = x;
  this.y = y;
  this.updateZoneAndDiv();
}

Unit.prototype.draw = function() {
  if (this.faction === "inquisitors") {
    this.zone.prepend('<div class="hero '+ this.faction +'" id="' + this.name + '"><img src="img/' + this.img + '"/></div>');
  } else {
    this.zone.append('<div class="hero '+ this.faction +'" id="' + this.name + '"><img src="img/' + this.img + '"/></div>');
  }  
  this.updateZoneAndDiv();
}

Unit.prototype.delete = function() {
  this.div.remove();
  this.updateZoneAndDiv();
}

Unit.prototype.updateZoneAndDiv = function() {
  this.zone = $(".board").find("[data-x=" + this.x + "][data-y=" + this.y + "]");
  this.div = this.zone.find('[id="' + this.name + '"]');
}

Unit.prototype.meleeAttack = function(hero) {
  hero.health -= this.meleeDamage;
}

Unit.prototype.rangeAttack = function(hero) {
  hero.health -= this.rangeAttack;
}
