class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame); 

        // add object to existing scene
        scene.add.existing(this);       // add to existing, displayList, updateList
    }

    update() {
       
    }
}