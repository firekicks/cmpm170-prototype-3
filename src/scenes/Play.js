class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
        this.maxEnergy = 100; // Maximum energy
        this.energy = this.maxEnergy; // Current energy
        this.energyRegenRate = 1; // Energy regenerated per second
        this.energyDepleteRate = 20; // Energy depleted per second during use
        this.minScannerScale = 0.1; // Minimum scanner scale when energy is very low
        this.maxScannerScale = 0.2; // Maximum scanner scale at full energy
    }

    preload() {
        this.load.setPath("./assets/");

        // Load font
        this.load.bitmapFont("pixel_square", "fonts/pixel_square_0.png", "fonts/pixel_square.fnt");

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
        this.background = this.add.image(0, 0, 'background')
            .setOrigin(0, 0)
            .setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);
        
        // Add scanner image and make it smaller
        this.scanner = this.add.image(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'scanner').setScale(this.maxScannerScale);
        this.scanner.setInteractive();
        this.input.setDraggable(this.scanner);

        // Create a semi-transparent overlay for the dimming effect
        this.dimmingOverlay = this.add.rectangle(0, 0, this.sys.game.config.width, this.sys.game.config.height, 0x000000)
            .setOrigin(0, 0)
            .setAlpha(0); // Start fully transparent
    
        // Enable dragging with energy depletion
        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            if (this.energy > 0) {
                gameObject.x = dragX;
                gameObject.y = dragY;
                this.energy -= this.energyDepleteRate * this.game.loop.delta / 1000; // Decrease energy based on drag time
                if (this.energy < 0) this.energy = 0;
                this.energyText.setText(`Energy: ${Math.floor(this.energy)}`);

                // Update both scanner scale and dimming effect
                this.updateScannerScale();
                this.updateDimmingEffect();
            } else {
                this.endGame(false); // End game when energy runs out
            }
        });
    
        // Display energy on the screen
        this.energyText = this.add.text(10, 70, `Energy: ${this.energy}`, { font: '20px pixel_square', fill: '#ffffff' });
    
        // Regenerate energy over time
        this.time.addEvent({
            delay: 1000, // Regenerate every second
            callback: () => {
                if (this.energy < this.maxEnergy) {
                    this.energy += this.energyRegenRate;
                    if (this.energy > this.maxEnergy) this.energy = this.maxEnergy;
                    this.energyText.setText(`Energy: ${Math.floor(this.energy)}`);
                    
                    // Adjust dimming effect and scanner scale as energy regenerates
                    this.updateScannerScale();
                    this.updateDimmingEffect();
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
        this.timerText = this.add.text(10, 10, `Time: ${this.timeLeft}`, { font: '20px pixel_square', fill: '#ffffff' });
        this.scoreText = this.add.text(10, 40, `Score: ${this.score}`, { font: '20px pixel_square', fill: '#ffffff' });
    
        // Timer event
        this.startTimer();
    }

    updateScannerScale() {
        // Adjust scanner scale based on current energy level
        const scale = Phaser.Math.Linear(this.minScannerScale, this.maxScannerScale, this.energy / this.maxEnergy);
        this.scanner.setScale(scale);
    }

    updateDimmingEffect() {
        // Calculate the dimming factor based on energy with faster increase as energy decreases
        const dimmingFactor = 1 - Math.pow((this.energy / this.maxEnergy), 3); // Exponentially increase dimming more strongly as energy goes down
        this.dimmingOverlay.setAlpha(dimmingFactor * 0.7); // Set max opacity at 70%
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
        if (this.timerEvent) {
            this.timerEvent.remove();
        }

        this.timerEvent = this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.timeLeft--;
                this.timerText.setText(`Time: ${this.timeLeft}`);
                if (this.timeLeft <= 0) {
                    this.endGame(false);
                }
            },
            callbackScope: this,
            loop: true
        });
    }

    update() {
        // Check for intersections with a reduced scanner range
        this.clues.forEach(clue => {
            if (Phaser.Geom.Intersects.RectangleToRectangle(this.scanner.getBounds(), clue.getBounds())) {
                if (!clue.visible) {
                    this.score += 10;
                    this.scoreText.setText(`Score: ${this.score}`);
                    clue.setVisible(true);

                    if (this.clues.every(c => c.visible)) {
                        this.endGame(true);
                    }
                }
            }
        });
    }

    endGame(win) {
        if (this.timerEvent) {
            this.timerEvent.remove();
        }

        this.energyRegenRate = 0; // Stop energy regeneration

        const message = win ? 'You Win!' : 'Game Over';
        this.add.bitmapText(
            this.sys.game.config.width / 2, 
            this.sys.game.config.height / 2, 
            "pixel_square", 
            message, 
            50 
        ).setOrigin(0.5).setTint(0x000000); 

        this.add.bitmapText(
            this.sys.game.config.width / 2, 
            this.sys.game.config.height / 2 + 60, 
            "pixel_square", 
            'Press R to Restart', 
            30
        ).setOrigin(0.5).setTint(0x000000);

        this.input.keyboard.once('keydown-R', () => {
            this.scene.restart();
        });

        this.input.off('drag');
    }
}
