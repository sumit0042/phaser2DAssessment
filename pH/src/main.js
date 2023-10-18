
window.addEventListener('load', function () {

	var game = new MultiplayerGame(false, {
		width: 1280,
		height: 720,
		type: Phaser.AUTO,
        backgroundColor: "#000000",
		scale: {
			mode: Phaser.Scale.FIT,
			autoCenter: Phaser.Scale.CENTER_BOTH
		}
	});

	game.scene.add("Preload", Preload);
	game.scene.add("Level", Level);
	game.scene.add("Boot", Boot, true);
});

class Boot extends Phaser.Scene {

	preload() {
		
		this.load.pack("pack", "assets/preload-asset-pack.json");
	}

	create() {

		this.scene.start("Preload");
	}
}

class MultiplayerGame extends Phaser.Game {

	socket;
	players;
	myProfile;
	  
	constructor(editor, args) {     
		super(args)
		
		// Dev Mode
		if(editor) {
		  return
		}

		this.socket = io();
		this.onSocketEvent = new Phaser.Events.EventEmitter()

		const eventTypes = ['connect', 'disconnect', 'currentPlayers', 'newPlayer', 'ready', 'rookMoved', 'turnChanged', 'changeOfTurn'];

		eventTypes.forEach((eventType) => {
		this.socket.on(eventType, (data) => {
			this.onSocketEvent.emit(eventType, data);
		});
		});

		this.socket.on('disconnect', ()=>{
			alert('Disconnected. 2 players already playing. Wait for some time, they will auto disconnect if no activity for 10 min')
		})

		this.socket.on('currentPlayers', (players) => {
			console.log(`Received Current Players data`)
			console.log(players)
			this.players = players;
			console.log(this.socket.id)
			const mySid = Object.keys(players).filter(pl => pl == this.socket.id)
			this.myProfile = 0
			if (mySid.length>0) {
				console.log(mySid[0])
				console.log(players[mySid[0]].playerNo)
				this.myProfile = players[mySid[0]].playerNo
			}
		})
	}

	// Send data to the server
	sendData(eventName, data) {
	  this.socket.emit(eventName, data);
	}
  
	// Clean up and disconnect the socket when needed
	disconnect() {
	  this.socket.disconnect();
	}
  }