var GameConfig = (function() {
	var module = {
		
	}
	
	module.init = function(callback, context) {
		trace('MODULE INIT, STAGE = ', Polyworks.Stage);
		var config = {
			gameType: 'phaser',
			assets: {
				images: {
					startBg: 'images/bg_blue.gif',
					playBg: 'images/bg_green.gif',
					gameOverBg: 'images/bg_red.gif',
					playButton: 'images/play_button.gif'
				},
				sprites: {},
				tilemaps: {}
			},
			preload: {
				images: [
				'playButton'
				],
				sprites: [],
				tilemaps: []
			},
			screens: [
			{
				id: 'start',
				assets: {
					images: [
					'startBg',
					'playButton'
					]
				},
				views: [
				{
					type: 'PhaserGroup',
					id: 'start-state-group',
					views: [
					{
						type: 'PhaserSprite',
						id: 'start-background',
						img: 'startBg',
						width: Polyworks.Stage.gameW,
						height: Polyworks.Stage.gameH,
						x: 0,
						y: 0,
					},
					{
						type: 'PhaserSprite',
						id: 'play-button',
						img: 'playButton',
						width: Polyworks.Stage.gameW,
						height: ((Polyworks.Stage.gameW)/5),
						x: 0,
						y: (Polyworks.Stage.gameH * 0.6),
						input: {
							attrs: {
								enableHandCursor: true
							},
							// enableDrag: [ false, true ],
							inputUp: function() {
								trace('start background input up function');
								Polyworks.EventCenter.trigger({ type: Polyworks.Events.CHANGE_STATE, value: 'play' });
							}
						}
					}]
				}]
			},
			{
				id: 'play',
				assets: {
					images: [
					'playBg'
					]
				},
				views: [
				{
					type: 'PhaserSprite',
					id: 'play-background',
					img: 'playBg',
					x: 0,
					y: 0,
					width: Polyworks.Stage.gameW,
					height: Polyworks.Stage.gameH,
					input: {
						inputUp: function() {
							trace('start background input up function');
							Polyworks.EventCenter.trigger({ type: Polyworks.Events.CHANGE_STATE, value: 'gameOver' });
						}
					}
				}]
			},
			{
				id: 'gameOver',
				assets: {
					images: [
					'gameOverBg'
					]
				},
				views: [
				{
					type: 'PhaserSprite',
					id: 'gameOver-background',
					img: 'gameOverBg',
					x: 0,
					y: 0,
					width: Polyworks.Stage.gameW,
					height: Polyworks.Stage.gameH,
					input: {
						inputUp: function() {
							trace('start background input up function');
							Polyworks.EventCenter.trigger({ type: Polyworks.Events.CHANGE_STATE, value: 'start' });
						}
					}
				}]
			}],
			defaultScreen: 'start'
		};
		
		callback.call(context, config);
	}
	return module;
}());