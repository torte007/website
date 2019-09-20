var config = {
    type: Phaser.WEBGL,
    parent: "game-container",
    width: 800,
    height: 600,
    backgroundColor: "black",
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 0, 
                x: 0
            },
        }
    },
    scene: [SceneMainMenu, SceneMain, SceneGameOver]
};

var game = new Phaser.Game(config); 