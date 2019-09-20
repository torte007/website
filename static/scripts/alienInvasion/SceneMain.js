var static_url = document.querySelector("p").innerText;

class SceneMain extends Phaser.Scene{
    constructor(){
        super({
            key: "SceneMain"
        });
    }
    preload(){
        console.log(static_url)

        this.load.spritesheet("sprExplosion", static_url + "/sprExplosion.png", {
            frameWidth: 32,
            frameHeight: 32
        }); 
        this.load.image('bigAlien', static_url + "/monster-big.png"); 
        this.load.image('sprPlayer', static_url + "/rocket.png"); 
        this.load.image('smallAlien', static_url +  "/monster-small.png");
        this.load.image("sprLaserEnemy0", static_url +  "/sprLaserEnemy0.png");
        this.load.image("sprLaserPlayer", static_url +  "/sprLaserPlayer.png");
        this.load.audio("sndExplode0", static_url +  "/sndExplode0.wav"); 
        this.load.audio("sndExplode1", static_url +  "/sndExplode1.wav"); 
        this.load.audio("sndLaser", static_url + "/sndLaser.wav"); 
    }

    getEnemiesByType(type){
        var arr = [];
        for(var i = 0; i < this.enemies.getChildren().length; i++){
            var enemy = this.enemies.getChildren()[i];
            if(enemy.getData("type") == type){
                arr.push(enemy); 
            }
        }
        return arr; 
    }

    create(){
        this.sfx = {
            explosions:[
                this.sound.add("sndExplode0"),
                this.sound.add("sndExplode1")
            ],
            laser: this.sound.add("sndLaser")
        }; 
        this.backgrounds = [];
        for (var i = 0; i < 5; i++) {
            var bg = new ScrollingBackground(this, "sprBg0", i * 10);
            this.backgrounds.push(bg);
        }   
        this.anims.create({
            key: "sprExplosion",
            frames: this.anims.generateFrameNumbers("sprExplosion"),
            frameRate: 20,
            repeat: 0
        }); 
        this.player = new Player(this, this.game.config.width * 0.5, this.game.config.height * 0.5, "sprPlayer");
        this.cursor = this.input.keyboard.createCursorKeys(); 
        this.enemies = this.add.group(); 
        this.enemyLasers = this.add.group(); 
        this.playerLasers = this.add.group(); 
        this.time.addEvent({
            delay: 1000,
            callback: function(){
                var enemy = null;
                if (Phaser.Math.Between(0, 10) >= 3) {
                    enemy = new SmallAlien(
                        this,
                        Phaser.Math.Between(50, this.game.config.width - 50),
                        0
                    );
                }
                else{
                  if (this.getEnemiesByType("BigAlien").length < 5) {
                    enemy = new BigAlien(
                        this,
                        Phaser.Math.Between(0, this.game.config.width),
                        0
                    );
                  }else{
                    enemy = new SmallAlien(
                        this,
                        Phaser.Math.Between(0, this.game.config.width),
                        0
                    );
                  }
                } 
                if (enemy !== null) {
                    this.enemies.add(enemy);
                  }           
            },
            callbackScope: this,
            loop: true
        });
        this.physics.add.collider(this.playerLasers, this.enemies, function(playerLaser, enemy) {
            if (enemy) {
              if (enemy.onDestroy !== undefined) {
                enemy.onDestroy();
              }
              enemy.explode(true);
              playerLaser.destroy();
            }
          });
        this.physics.add.overlap(this.player, this.enemies, function(player, enemy) {
        if (!player.getData("isDead") &&
            !enemy.getData("isDead")) {
            player.explode(false);
            player.onDestroy();
            enemy.explode(true);
        }
        });
    
        this.physics.add.overlap(this.player, this.enemyLasers, function(player, laser) {
        if (!player.getData("isDead") &&
            !laser.getData("isDead")) {
            player.explode(false);
            player.onDestroy();
            laser.destroy();
        }
        });
    }

    update(){
        if(!this.player.getData("isDead")){
            this.player.update(); 
            if(this.cursor.left.isDown){
                this.player.moveLeft(); 
            }else if(this.cursor.right.isDown){
                this.player.moveRight(); 
            }else if(this.cursor.up.isDown){
                this.player.moveUp()
            }else if(this.cursor.down.isDown){
                this.player.moveDown(); 
            }
            if(this.cursor.space.isDown){
                this.player.setData("isShooting", true);
            }else{
                this.player.setData("isShooting", false); 
            }
            for(var i = 0; i < this.enemies.getChildren().length; i++){
                var enemy = this.enemies.getChildren()[i];
                enemy.update(); 
                if (enemy.x < -enemy.displayWidth ||
                    enemy.x > this.game.config.width + enemy.displayWidth ||
                    enemy.y < -enemy.displayHeight * 4 ||
                    enemy.y > this.game.config.height + enemy.displayHeight) {
                    if (enemy) {
                    if (enemy.onDestroy !== undefined) {
                        enemy.onDestroy();
                    }
                    enemy.destroy();
                    }
                }
                
            }

            for (var i = 0; i < this.enemyLasers.getChildren().length; i++) {
                var laser = this.enemyLasers.getChildren()[i];
                laser.update();
                if (laser.x < -laser.displayWidth ||
                laser.x > this.game.config.width + laser.displayWidth ||
                laser.y < -laser.displayHeight * 4 ||
                laser.y > this.game.config.height + laser.displayHeight) {
                if (laser) {
                    laser.destroy();
                }
                }
            }
        
            for (var i = 0; i < this.playerLasers.getChildren().length; i++) {
                var laser = this.playerLasers.getChildren()[i];
                laser.update();
                if (laser.x < -laser.displayWidth ||
                    laser.x > this.game.config.width + laser.displayWidth ||
                    laser.y < -laser.displayHeight * 4 ||
                    laser.y > this.game.config.height + laser.displayHeight) {
                    if (laser) {
                    laser.destroy();
                    }
                }
            }
        }
    }
}