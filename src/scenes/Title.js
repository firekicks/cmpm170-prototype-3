class Title extends Phaser.Scene {
    constructor() {
      super("titleScene");
    }
  
    preload() {
      this.load.setPath("./assets/");
      this.load.bitmapFont("pixel_square", "fonts/pixel_square_0.png", "fonts/pixel_square.fnt");
    }
  
    create() {
      // Add Enter key listener for starting the scene
      this.startGame = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
  
      // Center positions
      const centerX = game.config.width / 2;
      const centerY = game.config.height / 2;
  
      // Make the game title larger and position it higher
      this.add.bitmapText(centerX, centerY - 150, "pixel_square", "Mystery Quest", 60).setOrigin(0.5);
      
      // Add instructions for starting the game
    //   this.add.bitmapText(game.config.width / 2, game.config.height / 2, "pixel_square", "Press enter to start", 20).setOrigin(0.5);
  
      // Add instructions for reaching the menu scene, placed much lower on the screen
      this.add.bitmapText(centerX, game.config.height - 100, "pixel_square", "Press Enter to reach Menu Scene", 30).setOrigin(0.5);
    }
  
    update() {
        // Start the Menu scene when Enter key is pressed
        if (Phaser.Input.Keyboard.JustDown(this.startGame)) {
            this.scene.start("menuScene");
        }
        
        // Start the Play scene when Enter key is pressed
        // if (Phaser.Input.Keyboard.JustDown(this.startGame)) {
        //     this.scene.start("playScene");
        // }
    }
  }
  