
// You can write more code here

/* START OF COMPILED CODE */

class Preload extends Phaser.Scene {

	constructor() {
		super("Preload");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/** @returns {void} */
	editorPreload() {

		this.load.pack("asset-pack", "assets/asset-pack.json");
	}

	/** @returns {void} */
	editorCreate() {

		// button_container
		const button_container = this.add.container(401, 274);
		button_container.setInteractive(new Phaser.Geom.Rectangle(0, 0, 121, 69), Phaser.Geom.Rectangle.Contains);

		// text_1
		const text_1 = this.add.text(60.5, 34.5, "", {});
		text_1.setOrigin(0.5, 0.5);
		text_1.text = "Start";
		text_1.setStyle({ "align": "center", "fontFamily": "Athletic", "fontSize": "64px" });
		button_container.add(text_1);

		this.button_container = button_container;

		this.events.emit("scene-awake");
	}

	/** @type {Phaser.GameObjects.Container} */
	button_container;

	/* START-USER-CODE */

	preload() {

		this.editorCreate();
		this.button_container.setVisible(false)
		this.editorPreload();
		this.load.on(Phaser.Loader.Events.COMPLETE, () => this.button_container.setVisible(true));
		
		this.game.onSocketEvent.once('ready', () => {
			this.scene.start("Level")
		})
		this.button_container.on(Phaser.Input.Events.POINTER_UP,
		() => {
			if (Object.keys(this.game.players).length < 2) {
				alert("Waiting for other player to join")
				return
			}
			this.game.sendData('start',{playerNo:this.game.myProfile})
		}, this)

	}

	onStart() {

	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
