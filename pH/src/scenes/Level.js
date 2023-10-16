
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

		// timer
		const timer = new PrefabTimer(this, 676, 108);
		this.add.existing(timer);

		// timer2
		const timer2 = new PrefabTimer(this, 676, 650);
		this.add.existing(timer2);

		// avatar_2
		const avatar_2 = this.add.image(676, 109, "Avatar 2");

		// avatar
		const avatar = this.add.image(676, 650, "Avatar");

		// rook
		const rook = this.add.image(861, 197, "rook");
		rook.setInteractive(new Phaser.Geom.Rectangle(0, 0, 26, 26), Phaser.Geom.Rectangle.Contains);
		rook.scaleX = 1.4;
		rook.scaleY = 1.4;

		// prefabHint
		const prefabHint = new PrefabHint(this, 809, 207);
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
		this.timer = timer;
		this.timer2 = timer2;
		this.avatar_2 = avatar_2;
		this.avatar = avatar;
		this.rook = rook;
		this.prefabHint = prefabHint;
		this.onRookMoved = onRookMoved;
		this.hintListX = hintListX;
		this.hintListY = hintListY;

		this.events.emit("scene-awake");
	}

	/** @type {Phaser.GameObjects.Image} */
	reward;
	/** @type {PrefabTimer} */
	timer;
	/** @type {PrefabTimer} */
	timer2;
	/** @type {Phaser.GameObjects.Image} */
	avatar_2;
	/** @type {Phaser.GameObjects.Image} */
	avatar;
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
	isOpponentsTurn;
	didWin;
	timeout;
	totalTime;
	timerMask;
	timerShape;
	startTime;

	create() {

		this.editorCreate();
		this.didWin = false;

		//timer create
		this.timerShape = this.make.graphics()
		this.timerMask = new Phaser.Display.Masks.GeometryMask(this, this.timerShape)
		this.timer.setMask(this.timerMask)
		this.timer2.setMask(this.timerMask)
		this.timer2.setFillStyle(0x00ff00);
		this.timer.setFillStyle(0x00ff00);
		this.totalTime = 10000;

		//socket create
		this.socket = io();
		this.socket.on('rookMoved', (rookLoc) => {
			console.log("Received Rook moved event")
			this.state = rookLoc;
			this.events.emit(this.onRookMoved)
			this.isOpponentsTurn = false;
			this.toggleTimer(true)
		})
		this.initHints()
		this.hideHints()
		this.events.addListener(this.onRookMoved,()=>{
			console.log(`Rook Moved to ${this.state.xRook}, ${this.state.yRook}`)
			this.startTime = this.time.now;
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
		for (let i = 0; i < 7; i++) {
			this.hintListX[i].visible = false;
		}
		for (let i = 0; i < 7; i++) {
			this.hintListY[i].visible = false;
		}
	}

	showHints(xStep, yStep) {
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
		const tween = this.tweens.add({
			targets: this.rook,
			x: newX, // New X position
			y: newY, // New Y position
			duration: 1000, // Duration in milliseconds (e.g., 2000ms = 2 seconds)
			ease: 'Linear', // Easing function (Linear for constant speed)
			onComplete: () => {
				if (this.didWin) {
					alert("You Win !!")
				}
			}
		})
		tween.play()
	}

	initHints() {
		for (let i = 0; i < 7; i++) {
			//along x
			this.hintListX[i] = new PrefabHint(this, this.rook.x, this.rook.y)
			this.hintListX[i].on(Phaser.Input.Events.POINTER_UP,
				() => {
				if (this.isOpponentsTurn) {
					alert("Please wait for your turn")
					return
				}
				this.state.xRook = this.hintListX[i].xPos;
				this.state.yRook = this.hintListX[i].yPos;
				this.didWin = this.state.xRook == 0 && this.state.yRook == 0
				this.socket.emit('rookMovement', this.state)
				this.events.emit(this.onRookMoved)
				this.isOpponentsTurn = true;
				this.toggleTimer(false);
				console.log(`Emiting new rook position ${this.state.xRook}, ${this.state.yRook}`)
			}, this)
			this.add.existing(this.hintListX[i])
			//along y
			this.hintListY[i] = new PrefabHint(this, this.rook.x, this.rook.y)
			this.hintListY[i].on(Phaser.Input.Events.POINTER_UP,
				() => {
				if (this.isOpponentsTurn) {
					alert("Please wait for your turn")
					return
				}
				this.state.xRook = this.hintListY[i].xPos;
				this.state.yRook = this.hintListY[i].yPos;
				this.didWin = this.state.xRook == 0 && this.state.yRook == 0
				this.socket.emit('rookMovement', this.state)
				this.events.emit(this.onRookMoved)
				this.isOpponentsTurn = true;
				this.toggleTimer(false)
				console.log(`Emiting new rook position ${this.state.xRook}, ${this.state.yRook}`)
			}, this)
			this.add.existing(this.hintListY[i])
		}
	}

	toggleTimer(isOpponentMove) {
		if (isOpponentMove) {
			this.timer.setMask(null)
			this.timer2.setMask(this.timerMask)
		}
		else {
			this.timer2.setMask(null)
			this.timer.setMask(this.timerMask)
		}
	}

	update() {
    	const progress = (this.time.now - this.startTime) / this.totalTime;
		// if not myMove and progress > 1, game over
		if (!this.timeout && !this.isOpponentsTurn && progress > 1) {
			this.timeout = true
			alert("Timed Out. You Lose !! You can still continue with the game")
		}
		if (!this.timeout && this.isOpponentsTurn && progress > 1) {
			this.timeout = true
			alert("Timed Out. You Win !! You can still continue with the game")
		}
		//update timer
		this.timerShape.clear()
		this.timerShape.beginPath()
		this.timerShape.moveTo(this.isOpponentsTurn? this.timer.x:this.timer2.x, this.isOpponentsTurn? this.timer.y:this.timer2.y)
		this.timerShape.arc(this.isOpponentsTurn? this.timer.x:this.timer2.x, this.isOpponentsTurn? this.timer.y:this.timer2.y, 
			64, Phaser.Math.PI2*(1/4), Phaser.Math.PI2*(1/4) + Phaser.Math.PI2 * progress, true, 0, false);
    	this.timerShape.fillPath();
	}


	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
