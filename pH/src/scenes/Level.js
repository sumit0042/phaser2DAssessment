
// You can write more code here

/* START OF COMPILED CODE */

class Level extends Phaser.Scene {

	constructor() {
		super("Level");

		/* START-USER-CTR-CODE */
		// Write your code here.
		this.state = {xRook:7,yRook:7}
		/* END-USER-CTR-CODE */
	}

	/** @returns {void} */
	editorCreate() {

		// squares
		const squares = this.add.image(676, 392, "Squares");
		squares.setInteractive(new Phaser.Geom.Rectangle(0, 0, 304, 304), Phaser.Geom.Rectangle.Contains);
		squares.scaleX = 1.4;
		squares.scaleY = 1.4;

		// labels
		const labels = this.add.image(640, 360, "Labels");
		labels.scaleX = 0.7;
		labels.scaleY = 0.7;

		// reward
		const reward = this.add.image(491, 578, "Group 77810");
		reward.scaleX = 0.7;
		reward.scaleY = 0.7;

		// avatar_2
		this.add.image(676, 108, "Avatar 2");

		// avatar
		this.add.image(676, 650, "Avatar");

		// rook
		const rook = this.add.image(861, 208, "rook");
		rook.setInteractive(new Phaser.Geom.Rectangle(0, 0, 26, 26), Phaser.Geom.Rectangle.Contains);
		rook.scaleX = 1.4;
		rook.scaleY = 1.4;

		// prefabHint
		const prefabHint = new PrefabHint(this, 809, 208);
		this.add.existing(prefabHint);
		prefabHint.visible = false;

		// onRookMoved
		const onRookMoved = new EmitEventActionScript(this);

		// lists
		const hintListX = [];
		const hintListY = [];

		// onRookMoved (prefab fields)
		onRookMoved.eventName = Phaser.Scenes.Events.UPDATE;
		onRookMoved.eventEmitter = "scene.events";

		this.reward = reward;
		this.rook = rook;
		this.prefabHint = prefabHint;
		this.onRookMoved = onRookMoved;
		this.hintListX = hintListX;
		this.hintListY = hintListY;

		this.events.emit("scene-awake");
	}

	/** @type {Phaser.GameObjects.Image} */
	reward;
	/** @type {Phaser.GameObjects.Image} */
	rook;
	/** @type {PrefabHint} */
	prefabHint;
	/** @type {EmitEventActionScript} */
	onRookMoved;
	/** @type {Array<any>} */
	hintListX;
	/** @type {Array<any>} */
	hintListY;

	/* START-USER-CODE */

	// Write more your code here
	state;
	socket;
	myMove;

	create() {

		this.editorCreate();
		//TODO: Uncomment below 5 lines
		this.socket = io();
		this.socket.on('rookMoved', (rookLoc) => {
			// check if new rook position is the same as old position, if so, then its other player's turn
			console.log("Received Rook moved event")
			// if (this.state.xRook == rookLoc.xRook && this.state.yRook == rookLoc.yRook) {
			// 	return
			// }
			this.state = rookLoc;
			this.events.emit(this.onRookMoved)
			this.myMove = false;
		})
		this.initHints()
		this.hideHints()
		this.events.addListener(this.onRookMoved,()=>{
			console.log(`Rook Moved to ${this.state.xRook}, ${this.state.yRook}`)
			const xMax = 861;
			const yMax = 208;
			const xMin = this.reward.x;
			const yMin = this.reward.y;
			const xStep = (xMax-xMin)/7;
			const yStep = (yMax-yMin)/7;
			this.showHints(xStep, yStep)
			this.moveRook(xMax - ((7-this.state.xRook)*xStep), yMax - ((7-this.state.yRook)*yStep))
		})
	}

	hideHints() {
		console.log('hiding hints')
		for (let i = 0; i < 7; i++) {
			this.hintListX[i].visible = false;
		}
		for (let i = 0; i < 7; i++) {
			this.hintListY[i].visible = false;
		}
	}

	showHints(xStep, yStep) {
		console.log('showing hints')
		console.log(this.hintListX)
		this.hintListX.forEach((hint,i) => {
			hint.visible = i<this.state.xRook;
			hint.setY(this.reward.y + (this.state.yRook*yStep))
			hint.setX(this.reward.x + (i*xStep))
			hint.xPos = i;
			hint.yPos = this.state.yRook;
		})
		this.hintListY.forEach((hint,i) => {
			hint.visible = i<this.state.yRook;
			hint.setX(this.reward.x + (this.state.xRook*xStep))
			hint.setY(this.reward.y + (i*yStep))
			hint.yPos = i;
			hint.xPos = this.state.xRook;
		})
	}

	moveRook (newX, newY) {
		console.log('Moving Rook')
		// this.hideHints()
		const tween = this.tweens.add({
			targets: this.rook,
			x: newX, // New X position
			y: newY, // New Y position
			duration: 1000, // Duration in milliseconds (e.g., 2000ms = 2 seconds)
			ease: 'Linear', // Easing function (Linear for constant speed)
			// onComplete: this.showHints,
		})
		tween.play()
	}

	initHints() {
		for (let i = 0; i < 7; i++) {
			//along x
			this.hintListX[i] = new PrefabHint(this, this.rook.x, this.rook.y)
			this.hintListX[i].on(Phaser.Input.Events.POINTER_UP,
				() => {
				if (this.myMove) {
					return
				}
				this.state.xRook = this.hintListX[i].xPos;
				this.state.yRook = this.hintListX[i].yPos;
				this.socket.emit('rookMovement', this.state)
				this.events.emit(this.onRookMoved)
				this.myMove = true;
				console.log(`Emiting new rook position ${this.state.xRook}, ${this.state.yRook}`)
			}, this)
			this.add.existing(this.hintListX[i])
			//along y
			this.hintListY[i] = new PrefabHint(this, this.rook.x, this.rook.y)
			this.hintListY[i].on(Phaser.Input.Events.POINTER_UP,
				() => {
				if (this.myMove) {
					return
				}
				this.state.xRook = this.hintListY[i].xPos;
				this.state.yRook = this.hintListY[i].yPos;
				this.socket.emit('rookMovement', this.state)
				this.events.emit(this.onRookMoved)
				this.myMove = true;
				console.log(`Emiting new rook position ${this.state.xRook}, ${this.state.yRook}`)
			}, this)
			this.add.existing(this.hintListY[i])
		}
	}


	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
