class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
        this.maxEnergy = 100; // Maximum energy
        this.energy = this.maxEnergy; // Current energy
        this.energyRegenRate = 1; // Energy regenerated per second
        this.energyDepleteRate = 20; // Energy depleted per second during use
    }

    preload() {
        this.load.setPath("./assets/");

        // Load background and scanner images
        this.load.image('background', 'background.jpg');
        this.load.image('scanner', 'scanner.png');
        this.load.image('balaclava', 'balaclava.png');
        this.load.image('bloody_knife', 'bloody_knife.png');
        this.load.image('bloody_napkin', 'bloody_napkin.png');
        this.load.image('case', 'case.png');
        this.load.image('key', 'key.png');
        this.load.image('termination_notice', 'termination_notice.png');
    }

    create() {
        // Reset energy at the start of the game
        this.energy = this.maxEnergy;
    
        // Add background image to the scene
        const background = this.add.image(0, 0, 'background')
            .setOrigin(0, 0)
            .setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);
        
        // Add scanner image and make it smaller
        this.scanner = this.add.image(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'scanner').setScale(0.2);
        this.scanner.setInteractive();
        this.input.setDraggable(this.scanner);
    
        // Enable dragging with energy depletion
        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            if (this.energy > 0) {
                gameObject.x = dragX;
                gameObject.y = dragY;
                this.energy -= this.energyDepleteRate * this.game.loop.delta / 1000; // Decrease energy based on drag time
                if (this.energy < 0) this.energy = 0;
                this.energyText.setText(`Energy: ${Math.floor(this.energy)}`);
            } else {
                // Call the endGame method with a lose condition
                this.endGame(false);
            }
        });
    
        // Display energy on the screen
        this.energyText = this.add.text(10, 70, `Energy: ${this.energy}`, { font: '20px Arial', fill: '#ffffff' });
    
        // Regenerate energy over time
        this.time.addEvent({
            delay: 1000, // Regenerate every second
            callback: () => {
                if (this.energy < this.maxEnergy) {
                    this.energy += this.energyRegenRate;
                    if (this.energy > this.maxEnergy) this.energy = this.maxEnergy;
                    this.energyText.setText(`Energy: ${Math.floor(this.energy)}`);
                }
            },
            loop: true
        });
    
        // Generate random positions for clues
        this.clues = this.generateRandomClues(3); // Generate 3 clues
        this.clues.forEach(clue => clue.setVisible(false));
    
        // Initialize score and timer
        this.score = 0;
        this.timeLeft = 30; // Set a 30-second timer
        this.timerText = this.add.text(10, 10, `Time: ${this.timeLeft}`, { font: '20px Arial', fill: '#ffffff' });
        this.scoreText = this.add.text(10, 40, `Score: ${this.score}`, { font: '20px Arial', fill: '#ffffff' });
    
        // Timer event
        this.startTimer();
    }
    

    generateRandomClues(numClues) {
        const clues = [];
        let imgArr = ["balaclava", "bloody_knife", "bloody_napkin", "case", "key", "termination_notice"];
        for (let i = 0; i < numClues; i++) {
            const randomX = Phaser.Math.Between(50, this.sys.game.config.width - 50);
            const randomY = Phaser.Math.Between(50, this.sys.game.config.height - 50);
            const clue = this.add.image(randomX, randomY, imgArr[Math.floor(Math.random() * imgArr.length)]).setScale(0.2);
            clues.push(clue);
        }
        return clues;
    }

    startTimer() {
        // Clear any existing timer events to avoid duplicates
        if (this.timerEvent) {
            this.timerEvent.remove();
        }

        // Create a new timer event
        this.timerEvent = this.time.addEvent({
            delay: 1000, // Decrease time every second
            callback: () => {
                this.timeLeft--;
                this.timerText.setText(`Time: ${this.timeLeft}`);
                if (this.timeLeft <= 0) {
                    this.endGame(false); // Lose condition if time runs out
                }
            },
            callbackScope: this,
            loop: true
        });
    }

    update() {
        // Check for intersections with a reduced scanner range
        this.clues.forEach(clue => {
            const reducedBounds = this.scanner.getBounds();
            const reducedRange = 0.5;
            reducedBounds.width *= reducedRange;
            reducedBounds.height *= reducedRange;
            reducedBounds.centerX = this.scanner.x;
            reducedBounds.centerY = this.scanner.y;

            if (Phaser.Geom.Intersects.RectangleToRectangle(reducedBounds, clue.getBounds())) {
                if (!clue.visible) {
                    this.score += 10; // Increase score when a clue is found
                    this.scoreText.setText(`Score: ${this.score}`);
                    clue.setVisible(true);

                    // Win condition: all clues found
                    if (this.clues.every(c => c.visible)) {
                        this.endGame(true);
                    }
                }
            }
        });
    }

    endGame(win) {
        // Stop the timer
        if (this.timerEvent) {
            this.timerEvent.remove();
        }

        // Determine the message based on the game outcome
        const message = win ? 'You Win!' : 'Game Over';

        // Display the win/lose message with a larger font size and black color
        this.add.bitmapText(
            this.sys.game.config.width / 2, 
            this.sys.game.config.height / 2, 
            "pixel_square", 
            message, 
            50 // Larger font size
        ).setOrigin(0.5).setTint(0x000000); // Set color to black

        // Display the restart instruction
        this.add.bitmapText(
            this.sys.game.config.width / 2, 
            this.sys.game.config.height / 2 + 60, 
            "pixel_square", 
            'Press R to Restart', 
            30 // Font size for the restart message
        ).setOrigin(0.5).setTint(0x000000); // Set color to black

        // Add keyboard input to restart the game when "R" is pressed
        this.input.keyboard.once('keydown-R', () => {
            this.scene.restart();
        });

        // Stop player interaction
        this.input.off('drag');
    }
}
