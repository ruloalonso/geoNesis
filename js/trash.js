// FONT AWESOME
"https://fontawesome.com/icons/crosshairs?style=solid";
"https://fontawesome.com/icons/walking?style=solid"
"https://fontawesome.com/icons/angle-double-right?style=solid"
"https://fontawesome.com/icons/skull?style=solid"


// SKILLS EASY TO IMPLEMENT
teleport
sniper

// TODO
comentar codigo:
  lo que mas funciona
  lo que menos funciona

capacidad de mejora del juego
  qué habrías hecho si tuvieras más tiempo
  capaz de hacer el juego que quiera





// CARD MODEL
function Card(name, img, description) {
  this.name = name;
  this.img = img;
  this.description = description;
}

// HERO MODEL
function Hero (name, img, description, health, meleeDamage, faction) {
  Unit.call(this, name, img, description);
  this.health = health;
  this.meleeDamage = meleeDamage;
  this.rangeDamage = rangeDamage;
  this.faction = faction;
}

Hero.prototype = Object.create(Unit.prototype);
Hero.prototype.constructor = Hero;

Hero.prototype.level = 1;
Hero.prototype.exp = 0;
Hero.prototype.actions = 2;

Hero.prototype.receiveDamage = function(damage) {
  this.health -= damage;
  return this.health > 0 ?
    this.name + " has received " + damage + " points of damage. Health: " + this.health : 
    this.name + " has died in act of combat";
}

Hero.prototype.meleeAttack = function() {
  return this.meleeDamage;
}

Hero.prototype.rangeAttack = function() {
  return this.rangeDamage;
}

// LEADER MODEL
function Leader (name, value, img, damage, health, faction, armor) {
  Hero.call(this, armor);
  this.armor = armor;
}

Leader.prototype = Object.create(Hero.prototype);
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


// WAR
function War() {
  this.revels = {
    army: {
      leader: {},
      heroes: [],
      platoons: []
    },
    turn: false
  };
  this.inquisitors = {
    army: {
      leader: {},
      heroes: [],
      platoons: []
    }, 
    turn: false
  };
  this.board = [
    [{}, {}, {}],
    [{}, {}, {}],
    [{}, {}, {}],
    [{}, {}, {}],
    [{}, {}, {}],
  ]
  this.turn = "inquisitors";
}

War.prototype.start = function() {
  print("War starts!!! " + (this.revels.army.heroes.length + 1) + " revel heroes are facing " + (this.inquisitors.army.heroes.length + 1) + " echlesiastics.");
};

War.prototype.addRevelLeader = function(revel) {
  this.revels.army.leader = revel;
  return "Revel Leader added: " + revel.name;
};

War.prototype.addInqLeader = function(inq) {
  this.inquisitors.army.leader = inq;
  return "Inquisitor Leader added: " + inq.name;
};

War.prototype.removeRevel = function(revel) {
  this.revelArmy.splice(this.revelArmy.indexOf(revel), 1);
};

War.prototype.removeInq = function(inq) {
  this.inqArmy.splice(this.inqArmy.indexOf(inq), 1);
};

War.prototype.attack = function(attacker, defender) {
  var result = defender.receiveDamage(attacker.damage);  
  if (defender.health <= 0 && defender.faction === "inq") this.removeInq(defender);
  if (defender.health <= 0 && defender.faction === "revel") this.removeRevel(defender); 
  return result;
};


// EXAMPLE
document.getElementById("war").onclick = function(){
  print(war.start());
}

document.getElementById("revel").onclick = function(){
  print(war.addRevelLeader(revel));
}

document.getElementById("inq").onclick = function(){
  print(war.addInqLeader(echl));
}

war = new War();
var echl = new Leader("Perry", 150, "test", 150, 400, "revel", 100);
var revel = new Leader("Rulo", 180, "test", 120, 420, "inq", 80);

function print(string) {
  var element = document.createElement('p');
  element.innerHTML = string;
  document.body.appendChild(element);
}

function getInput() {
  var input = document.getElementById('input');
  return input.innerText;
}

function clearInput() {
  var input = document.getElementById('input');
  input.innerText = '';
}






// TRASH


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


Card.prototype.status = "";
Card.prototype.toDeck = function() { this.status = "deck"; }
Card.prototype.toHand = function() { this.status = "hand"; }
Card.prototype.toBoard = function() { this.status = "play"; }
Card.prototype.discard = function() { this.status = "discarded"; }


function Soldier (name, value, img, damage, health, faction) {
  Card.call(this, name, value, img, damage, health, faction);
  this.name = name;
  this.damage = damage;
  this.health = health;
  this.faction = faction;
}

Soldier.prototype = Object.create(Card.prototype);
Soldier.prototype.constructor = Soldier;

Soldier.prototype.receiveDamage = function(damage) {
  this.health -= damage;
  return this.health > 0 ?
    this.name + " has received " + damage + " points of damage. Health: " + this.health : 
    this.name + " has died in act of combat";
}

Soldier.prototype.attack = function() {
  return this.strength;
}

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