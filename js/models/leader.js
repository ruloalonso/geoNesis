function Leader (name, value, img, damage, health, faction, armor) {
    Soldier.call(this, armor);
    this.armor = armor;
  }
  
  Leader.prototype = Object.create(Soldier.prototype);
  Leader.prototype.constructor = Leader;

  Leader.prototype.receiveDamage = function(damage) {
    if (this.armor > 0) {
      this.armor -= damage;
      if (this.armor < 0) {
        this.health += this.armor;
        this.armor = 0;
      }
    } else {
      this.health -= damage;
    }    
    return this.health > 0 ?
      this.name + " has received " + damage + " points of damage. Health: " + this.health + ". Armor: " + this.armor : 
      this.name + " has died in act of combat";
  }

  Leader.prototype.battleCry = function() {
    army.forEach(soldier => {
      soldier.damage += 20;
    });
    return "Odin Owns You All!";
  };