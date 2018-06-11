var game = new Game();

game.board.build(5, 3);

$(document).ready(function() {
  $("#startBattle").click(function(){game.startBattle()});
  $("#passTurn").click(function(){game.passTurn()});
  $("#addInquisitorHero").click(function(){game.addHero(inquisitorHeroes[game.players[0].heroes.length], game.players[0])});
  $("#addRevelHero").click(function(){game.addHero(revelHeroes[game.players[1].heroes.length], game.players[1])});
  $("#setInquisitorLeader").click(function(){game.setLeader(game.players[0])});
  $("#setRevelLeader").click(function(){game.setLeader(game.players[1])});
  $("#move").click(function(){game.previewMove()});
  $("#meleeAttack").click(function(){game.previewMeleeAttack(game.selectedHero)});
  $("#rangeAttack").click(function(){game.previewRangeAttack(game.selectedHero)});
  game.display.getDisplay();
});

