var basicTestLogic = {
	global: {
		methods: {
			preload: function() {
				trace('basicTestLogic/preload');
				PWG.PhaserLoader.load(PWG.Game.config.global.assets);
			},
			create: function() {
				// var winW = document.documentElement.clientWidth;
				// PWG.Stage.zoomByWidth(winW, PWG.Game.phaser.canvas);
				setGameSize();
				PWG.EventCenter.trigger({ type: PWG.Events.CHANGE_STATE, value: 'home' });
			}
		},
		listeners: [
		]
	},
	states: {
		home: {
			methods: {
				create: function() {

				},
				shutdown: function() {

				}
			}
		},
		play: {
			methods: {
				start: function() {
					if(!this.tileDataInitialized) {
						DataTilemap.init();
						this.tileDataInitialized = true;
					}
				},
				create: function() {
				    this.cursors = PWG.Game.phaser.input.keyboard.createCursorKeys();
				},
				update: function() {
				    if(this.cursors.left.isDown || PWG.Game.leftDown) {
				        PWG.Game.phaser.camera.x -= 4;
				    } else if(this.cursors.right.isDown || PWG.Game.rightDown) {
				        PWG.Game.phaser.camera.x += 4;
				    }

				    // if(this.cursors.up.isDown) {
				    //     PWG.Game.phaser.camera.y -= 2;
				    // } else if(this.cursors.down.isDown) {
				    //     PWG.Game.phaser.camera.y += 2;
				    // }
				},
				shutdown: function() {

				}
			}
		}
	},
	input: {
		leftArrow: {
			inputDown: function() {
				PWG.Game.leftDown = true;
				PWG.Game.rightDown = false;
			},
			inputUp: function() {
				PWG.Game.leftDown = false;
			}
		},
		rightArrow: {
			inputDown: function() {
				PWG.Game.rightDown = true;
				PWG.Game.leftDown = false;
			},
			inputUp: function() {
				PWG.Game.rightDown = false;
			}
		}
	},
	buttonCallbacks: {
		gameStart: function() {
			PWG.EventCenter.trigger({ type: PWG.Events.CHANGE_STATE, value: 'play' });
		},
		quit: function() {
			PWG.EventCenter.trigger({ type: PWG.Events.CHANGE_STATE, value: 'home' });
		}
	}
}

window.addEventListener('resize', function() {
	// if(PWG.Stage && PWG.Stage.initialized) {
		setGameSize();
	// }
})

function setGameSize() {
	var winW = document.documentElement.clientWidth;
	PWG.Stage.sizeGame(winW);
}

PWG.Game.init(BasicTestConfig, basicTestLogic);
