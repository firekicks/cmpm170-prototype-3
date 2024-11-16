let config = {
    type: Phaser.CANVAS, 
    width: 715, 
    height: 537,
    scene: [Title, Menu, Play],
    physics: {
        default: 'arcade',
        arcade: {
            debug: false // Set to true if you want to see physics boundaries for debugging
        }
    },
    audio: {
        disableWebAudio: true // Disable Web Audio to avoid autoplay issues
    },
    fps: {forceSetTimeOut: true, target: 60},
}

let game = new Phaser.Game(config);

// Set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

