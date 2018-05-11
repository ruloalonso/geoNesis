function War() {
  this.revelArmy = [];
  this.eclArmy = [];
}

War.prototype.addRevel = function(revel) {
  this.revelArmy.push(revel);
};

War.prototype.addEcl = function(ecl) {
  this.eclArmy.push(ecl);
};

War.prototype.removeRevel = function(revel) {
  this.revelArmy.splice(this.revelArmy.indexOf(revel), 1);
};

War.prototype.removeEcl = function(ecl) {
  this.eclArmy.splice(this.eclArmy.indexOf(ecl), 1);
};

War.prototype.attack = function(attacker, defender) {
  var result = defender.receiveDamage(attacker.damage);  
  if (defender.health <= 0 && defender.faction === "ecl") this.removeEcl(defender);
  if (defender.health <= 0 && defender.faction === "revel") this.removeRevel(defender); 
  return result;
};

var card = new Card(200, "test");
console.log(card);

var rulo = new Soldier("rulo", 200, "test", 100, 200, "revel");
console.log(rulo);

var war = new War();
var perry = new Leader("Perry", 150, "test", 150, 400, "revel", 100);

war.addRevel(rulo);
war.addEcl(perry);

console.log("Battle start!!!");
