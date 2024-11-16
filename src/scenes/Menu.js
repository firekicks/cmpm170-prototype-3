class Menu extends Phaser.Scene {
  constructor() {
    super("menuScene");
  }

  preload() {
    this.load.setPath("./assets/");
    this.load.bitmapFont("pixel_square", "fonts/pixel_square_0.png", "fonts/pixel_square.fnt");
  }

  create() {
    // Set base positions for centering text
    const centerX = this.sys.game.config.width / 2;
    const centerY = this.sys.game.config.height / 2;

    // Add menu title
    this.add.bitmapText(centerX, 50, "pixel_square", "How to Play", 50).setOrigin(0.5);

    // Add game instructions
    const instructions = [
      "Objective: Find 3 hidden items to win.",
      "Use the magnifying glass to scan the room.",
      "Score +10 for each item found.",
      "Items are shuffled each time you play.",
      "Win by finding all items before time/energy runs out.",
      "As energy depletes, the background darkens and the scanner shrinks.",
      "",
      "Lose Conditions:",
      "- Timer reaches 0.",
      "- Energy depletes completely.",
      "",
      "Controls:",
      "Use mouse to move the magnifying glass.",
      "Press 'R' to restart after winning or losing."
    ];

    // Calculate line spacing and starting Y position for instructions
    const instructionFontSize = 18;
    const lineSpacing = 5;
    let currentY = centerY - (instructions.length * (instructionFontSize + lineSpacing)) / 2;

    // Display each instruction line with proper spacing
    instructions.forEach(line => {
      this.add.bitmapText(centerX, currentY, "pixel_square", line, instructionFontSize).setOrigin(0.5);
      currentY += instructionFontSize + lineSpacing;
    });

    // Add "Press Enter to Start" prompt at the bottom
    this.add.bitmapText(centerX, this.sys.game.config.height - 60, "pixel_square", 
      "Press Enter to Start", 35).setOrigin(0.5);

    // Add Enter key listener to start the Play scene
    this.startGame = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
  }

  update() {
    // Transition to Play scene if Enter is pressed
    if (Phaser.Input.Keyboard.JustDown(this.startGame)) {
      this.scene.start("playScene");
    }
  }
}
