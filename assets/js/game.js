var map;
var layer;
var p;
var door;
var bullet;
var cursors;
var stars;
var score = 0;
var scoreText;
var scoreText2;
var lives = 3;  
var livesText;
var aliens;
var y = 2400;
var pos = 0;      
var jumpButton;
var jumpTimer = 0;
var count = 800;  
var music;

var Game = {
    preload : function() {
    game.load.tilemap('World1', 'assets/tilemaps/maps/World1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', 'assets/tilemaps/tiles/super_mario.png');
    game.load.spritesheet('player', 'assets/sprites/wario3.png',40, 40);
    game.load.spritesheet('live', 'assets/img/live.png',64, 44);
    game.load.spritesheet('coinScore', 'assets/img/coinScore.png',32, 32);
    game.load.spritesheet('livebg', 'assets/img/livebg.png',160, 35);
    game.load.spritesheet('enemies', 'assets/sprites/dude.png',32, 48);
    game.load.spritesheet('bulletBill', 'assets/sprites/bulletBill.png',32, 48);
    //game.load.spritesheet('bulletBill', 'assets/sprites/bulletBill2.png',32, 60);
    game.load.spritesheet('door', 'assets/sprites/door.png',79, 92);
    game.load.image('star', 'assets/sprites/stone.png');
    game.load.image('right', 'assets/img/right.png');
    game.load.image('left', 'assets/img/left.png');
    game.load.image('jump', 'assets/img/jump.png');
    game.load.spritesheet('coin', 'assets/sprites/coin.png', 32, 32);
    
    game.load.audio('boden', 'assets/music/mario___ukulele.mp3');
    game.load.audio('jump', 'assets/music/jump_08.wav');
   
    game.load.audio('dead', 'assets/music/mariodie.wav');
    game.load.audio('coin', 'assets/music/mario_coin_sound.mp3');
    game.load.audio('killBulletSound', 'assets/music/smb_fireball.wav');
    game.load.audio('restart', 'assets/music/restart.wav');    
    },

    create : function() {
    
    this.createMap();   
    music = game.sound.play('boden');
    //music.stop();
    this.coinSound = game.add.audio('coin', 0.1);
    this.jumpSound = game.add.audio('jump', 0.1);
    this.deadSound = game.add.audio('dead', 0.1);
    this.killBulletSound = game.add.audio('killBulletSound', 0.1);
    this.restartSound = game.add.audio('restart', 0.1);

    this.createCoins();   
    this.createEnemies();   
    this.createPlayer();
    
    game.camera.follow(p, Phaser.Camera.FOLLOW_PLATFORMER);    
    game.camera.y = game.camera.bounds.height;
    cursors = game.input.keyboard.createCursorKeys();  
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    //  The score
    scoreText = game.add.text(70, 20, score, { fontSize: '32px', fill: '#000' });
    scoreText2 = game.add.sprite(16, 20, 'coinScore'); 
    scoreText.fixedToCamera = true;
    scoreText2.fixedToCamera = true;
   
    //  The lives
    livebg = game.add.sprite(game.world.width - 159, 17.5, 'livebg'); 
    livebg.fixedToCamera = true;  
    livesText = game.add.group();
    for (var i = 0; i < 3; i++) 
    {
        var ship = livesText.create( game.world.width - 150 + (50 * i), 20, 'live');        
        ship.fixedToCamera = true;
    }
    
    emitter = game.add.emitter(0, 0, 20);
    emitter.makeParticles('star');
    emitter.gravity = 200;
    //Detected device
    if (!game.device.desktop)
        this.addMobileInputs();    
    },
 createMap : function (){
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.gravity.y = 300;
    game.stage.backgroundColor = '#787878';
    map = game.add.tilemap('World1');
    map.addTilesetImage('World1', 'tiles');
    map.setCollisionBetween(1043, 1045);  
    map.setCollisionBetween(581, 583);   
    map.setCollisionBetween(875, 876);
    map.setCollision(637);  
    map.setCollision(40);       
    layer = map.createLayer('World1');
    layer.resizeWorld();
    //game.camera.deadzone = new Phaser.Rectangle(100, 100, 600, count);    
},

createPlayer : function (){
    //game.camera.bounds.height
    p = game.add.sprite(layer.centerX, game.camera.bounds.height -400, 'player');    
    
    game.physics.enable(p, Phaser.Physics.ARCADE);
    p.body.collideWorldBounds = true;
    p.body.gravity.y = 1000;
    p.body.maxVelocity.y = 500;
    p.body.collideWorldBounds = true;
    p.body.checkCollision.up = false;
    p.body.checkCollision.left = false;
    p.body.checkCollision.right = false;
    p.animations.add('left', [0, 1, 2, 3 ,4], 10, true);
    p.animations.add('right', [5, 6, 7, 8, 9], 10, true);
    playerDead = false;
},

createEnemies : function (){
  
    bullet = game.add.group();
    bullet.enableBody = true;

    map.createFromObjects('Object Layer 2', 1357, 'bulletBill', 0, true, false, bullet);
    //bullet.callAll('animations.add', 'animations', 'spin', [0, 1, 2, 3], 10, true);
    //bullet.callAll('animations.play', 'animations', 'spin');
    for (i = 0; i < bullet.length; i++){
        game.physics.enable(bullet.children[i]);
        bullet.children[i].body.allowGravity = false;  

        bullet.children[i].body.checkCollision.up = true;
        bullet.children[i].body.checkCollision.left = false;
        bullet.children[i].body.checkCollision.right = false;
        bullet.children[i].body.checkCollision.down = false;     
    }

    door = game.add.group();
    door.enableBody = true;
    game.physics.enable(door);
    map.createFromObjects('Object Layer 3', 1359, 'door', 0, true, false, door);

    coins.callAll('animations.add', 'animations', 'spin', [0, 1, 2, 3, 4, 5], 10, true);
    coins.callAll('animations.play', 'animations', 'spin');
    },

    createCoins : function (){
    coins = game.add.group();
    coins.enableBody = true;
    //  And now we convert all of the Tiled objects with an ID of 34 into sprites within the coins group
    map.createFromObjects('Object Layer 1', 1351, 'coin', 0, true, false, coins);
    //  Add animations to all of the coin sprites
    coins.callAll('animations.add', 'animations', 'spin', [0, 1, 2, 3, 4, 5], 10, true);
    coins.callAll('animations.play', 'animations', 'spin');
    },
    update: function() {    
    game.physics.arcade.collide(p, layer);
    game.physics.arcade.collide(door, layer);
    game.physics.arcade.collide(coins, layer);
    game.physics.arcade.collide(bullet, layer);
    game.physics.arcade.overlap(p, coins, this.collectCoin, null, this);
    game.physics.arcade.overlap(p, door, this.nextLevel, null, this);
    game.physics.arcade.collide(p, bullet, this.killBullet, null, this);
    game.physics.arcade.overlap(p, bullet, this.collectBullet, null, this);  

    p.body.velocity.x = 0;       
    livesText.text = 'Lives: ' + lives;    
    this.cameraDeadzone();
    this.movePlayer();

    var tween = game.add.tween(p).to( { alpha: 1 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);


    },
    cameraDeadzone : function(){     
        camPos = (game.camera.bounds.height - game.camera.y ) - game.height ;
        spritePos = game.camera.bounds.height - p.y ;    
        
        if(spritePos >= count ){        
            game.camera.deadzone = new Phaser.Rectangle(100, 100, 600, count);    
            count = count + count; 
            
        } 
        if(camPos > spritePos){         
          console.log('lives ' + lives  +  ' camPos '+ camPos + ' spritePos ' + spritePos + ' count ' + count);
          
          this.newGame();         
        }
        if(lives == 0){            
            game.state.start('Game_Over');
            music.stop();
            this.restartSound.stop();
            this.deadSound.play();
            lives= 2;
            score = 0;
        }
    },
    newGame : function(){   
        count = game.height;
        p.y = game.camera.bounds.height - p.height;       
        p.x = game.width/2;  
        //game.camera.deadzone = new Phaser.Rectangle(100, 100, 600, count); 
        game.camera.y = game.camera.bounds.height;
        p.animations.stop();     
        this.restartSound.play();  
        lives--;  
        live = livesText.getFirstAlive();
        if (live)
        {
            live.kill();
            console.log("e");
        }
        
    },
    movePlayer : function(){
        
	if (cursors.left.isDown || this.moveLeft)
        {
            //  Move to the left
            p.body.velocity.x = -150;

            p.animations.play('left');
        }
        else if (cursors.right.isDown || this.moveRight)
        {
            //  Move to the right
            p.body.velocity.x = 150;

            p.animations.play('right');
        }
        else
        {
            //  Stand still
            p.animations.stop();
            p.frame = 4;
        }

        if (cursors.up.isDown)
        {
            this.jumpPlayer();
        }


    for (i = 0; i < bullet.length; i++){
       
        game.physics.arcade.collide(p, bullet.children[i]);
        if(bullet.children[i].world.x >=  game.width){
             bullet.children[i].x = -14;
             
        }else{
            bullet.children[i].x += 2;
        }
         
        }

    },
    jumpPlayer: function(){
        if (p.body.onFloor() && game.time.now > jumpTimer)
        {
            p.body.velocity.y = -600;
            jumpTimer = game.time.now + 750;
            this.jumpSound.play();
        }
    },
    destroyEmitter : function() {

        //emitter.destroy();

    },

    collectCoin: function(p, coin) {
    //game.add.tween(coin.scale).to({x:0}, 150).start();
    //game.add.tween(coin).to({y:50}, 150).start();
    this.coinSound.play();
    coin.kill();
    score += 10;
    scoreText.text = score;
    },

    killBullet: function(p, bullet) {
    this.killBulletSound.play();
    this.shakeEffect(bullet);
    //game.add.tween(bullet.scale).to({x:0}, 150).start();
    //game.add.tween(bullet).to({y:50}, 150).start();
    bullet.kill();
    score += 10;
    scoreText.text = score;
    },
    collectBullet : function (player, bullet) {        
    this.newGame();
    },
    nextLevel : function  (player, bullet) {    
        game.state.start('Level2');
    },
    shakeEffect : function(g) {
        var move = 5;
        var time = 20;

        game.add.tween(g)
                .to({y:"-"+move}, time).to({y:"+"+move*2}, time*2).to({y:"-"+move}, time)
                .to({y:"-"+move}, time).to({y:"+"+move*2}, time*2).to({y:"-"+move}, time)
                .to({y:"-"+move/2}, time).to({y:"+"+move}, time*2).to({y:"-"+move/2}, time)
                .start();

        game.add.tween(g)
                .to({x:"-"+move}, time).to({x:"+"+move*2}, time*2).to({x:"-"+move}, time)
                .to({x:"-"+move}, time).to({x:"+"+move*2}, time*2).to({x:"-"+move}, time)
                .to({x:"-"+move/2}, time).to({x:"+"+move}, time*2).to({x:"-"+move/2}, time)
                .start();
    },
    particleBurst: function(head) {

    emitter.x = p.x;
    emitter.y = p.y+48;
    emitter.width = 10;
    emitter.start(true, 4000, null, 10);

    //  And 2 seconds later we'll destroy the emitter
    game.time.events.add(2000, this.destroyEmitter, this);

    },    addMobileInputs: function() {
        this.jumpButton = game.add.sprite(game.width - 70, game.height - 70, 'jump');
        this.jumpButton.fixedToCamera = true;
        this.jumpButton.inputEnabled = true;
        this.jumpButton.events.onInputDown.add(this.jumpPlayer, this);
        this.jumpButton.alpha = 0.5;

        this.moveLeft = false;
        this.moveRight = false;

        this.leftButton = game.add.sprite(5, game.height - 70, 'left');
        this.leftButton.fixedToCamera = true;
        this.leftButton.inputEnabled = true;
        this.leftButton.events.onInputOver.add(function(){this.moveLeft=true;}, this);
        this.leftButton.events.onInputOut.add(function(){this.moveLeft=false;}, this);
        this.leftButton.events.onInputDown.add(function(){this.moveLeft=true;}, this);
        this.leftButton.events.onInputUp.add(function(){this.moveLeft=false;}, this);
        this.leftButton.alpha = 0.5;

        this.rightButton = game.add.sprite(90, game.height - 70, 'right');
        this.rightButton.fixedToCamera = true;
        this.rightButton.inputEnabled = true;
        this.rightButton.events.onInputOver.add(function(){this.moveRight=true;}, this);
        this.rightButton.events.onInputOut.add(function(){this.moveRight=false;}, this);
        this.rightButton.events.onInputDown.add(function(){this.moveRight=true;}, this);
        this.rightButton.events.onInputUp.add(function(){this.moveRight=false;}, this);
        this.rightButton.alpha = 0.5;
    },

};
