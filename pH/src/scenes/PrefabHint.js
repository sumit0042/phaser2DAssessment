
// You can write more code here

/* START OF COMPILED CODE */

class PrefabHint extends Phaser.GameObjects.Image {

	constructor(scene, x, y, texture, frame) {
		super(scene, x ?? 0, y ?? 0, texture || "hint", frame);

		this.setInteractive(new Phaser.Geom.Rectangle(0, 0, 28, 28), Phaser.Geom.Rectangle.Contains);
		this.scaleX = 1.2;
		this.scaleY = 1.2;

		/* START-USER-CTR-CODE */
        // Write your code here.
        /* END-USER-CTR-CODE */
	}

	/** @type {number} */
	xPos = 0;
	/** @type {number} */
	yPos = 0;

	/* START-USER-CODE */

    // Write your code here.

    /* END-USER-CODE */
}

/* END OF COMPILED CODE */
// You can write more code here
