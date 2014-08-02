var basicTestLogic = {
	global: {
		methods: {
			preload: function() {
				trace('basicTestLogic/preload');
				PWG.PhaserLoader.load(PWG.Game.config.global.assets);
			},
			create: function() {
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
