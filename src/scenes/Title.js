class Title extends Phaser.Scene {
    constructor() {
        super("titleScene");
    }
    
    preload() {
        this.load.setPath("./assets/");
        this.load.bitmapFont("pixel_square", "fonts/pixel_square_0.png", "fonts/pixel_square.fnt");
    }

    create() {
        this.startGame = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        // Add the game title "Detective Puzzle" at the top
        this.add.bitmapText(game.config.width / 2, game.config.height / 2 - 120, "pixel_square", 
            "Detective Puzzle", 30).setOrigin(0.5);

        // Add instructions for using the mouse / what to do
        this.add.bitmapText(game.config.width / 2, (game.config.height / 2) - 40, "pixel_square",
        "Use mouse to explore with the magnifying glass", 20).setOrigin(0.5);

        // Add instructions for starting the game
        this.add.bitmapText(game.config.width / 2, game.config.height / 2, "pixel_square",
        "Press enter to start", 20).setOrigin(0.5);
    }

    update() {
        // Start the Play scene when Enter key is pressed
        if (Phaser.Input.Keyboard.JustDown(this.startGame)) {
            this.scene.start("playScene");
        }
    }   
}