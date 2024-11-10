let config = {
    type: Phaser.CANVAS, 
    width: 715, 
    height: 537,
    // add in Menu scene later if needed
    scene: [Title, Play],
    audio: {
        disableWebAudio: true // disable Web Audio to avoid autoplay issues
    },
    fps: {forceSetTimeOut: true, target: 60},
}

let game = new Phaser.Game(config);

// Set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

// Set keyboard variables
