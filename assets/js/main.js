var game;

game = new Phaser.Game(400, "100%", Phaser.CANVAS/*Phaser.CANVAS*/, '');

game.state.add('Menu', Menu);
game.state.add('Game', Game);
game.state.add('Level2', Level2);
game.state.add('Game_Over', Game_Over);


game.state.start('Menu');
