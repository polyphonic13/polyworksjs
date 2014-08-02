var basicTestLogic = {
	global: {
		methods: {
			preload: function() {
				trace('basicTestLogic/preload');
				PWG.PhaserLoader.load(PWG.Game.config.global.assets);
			},
			create: function() {
				PWG.EventCenter.trigger({ type: PWG.Events.CHANGE_STATE, value: 'home' });
			    this.cursors = PWG.Game.phaser.input.keyboard.createCursorKeys();
			},
			update: function() {
			    if (this.cursors.left.isDown)
			    {
			        PWG.Game.phaser.camera.x -= 4;
			    }
			    else if (this.cursors.right.isDown)
			    {
			        PWG.Game.phaser.camera.x += 4;
			    }

			    if (this.cursors.up.isDown)
			    {
			        PWG.Game.phaser.camera.y -= 4;
			    }
			    else if (this.cursors.down.isDown)
			    {
			        PWG.Game.phaser.camera.y += 4;
			    }
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
				create: function() {

				},
				shutdown: function() {

				}
			}
		}
	},
	input: {
		
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

PWG.Game.init(BasicTestConfig, basicTestLogic);
