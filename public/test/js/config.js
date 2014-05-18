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
					gameOverBg: 'images/bg_red.gif'
				},
				sprites: {
					playButton: {
						url: 'images/play_button_sprite_800x320.gif',
						width: 800,
						height: 160,
						frames: 2
					}
				},
				tilemaps: {}
			},
			preload: {
				images: [],
				sprites: [],
				tilemaps: []
			},
			screens: [
			{
				id: 'start',
				assets: {
					images: [
					'startBg'
					],
					sprites: [
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
						type: 'PhaserButton',
						id: 'play-button',
						img: 'playButton',
						width: Polyworks.Stage.gameW,
						height: ((Polyworks.Stage.gameW)/5),
						x: 0,
						y: (Polyworks.Stage.gameH * 0.6),
						callback: function() {
							Polyworks.EventCenter.trigger({ type: Polyworks.Events.CHANGE_STATE, value: 'play' });
						},
						context: this,
						frames: [0, 1, 1, 0]
					}
					]
				}]
			},
			{
				id: 'play',
				assets: {
					images: [
					'playBg'
					]
				},
				attrs: {
					count: 0
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
				}],
				update: function() {
					this.count++;
					trace('StateController['+this.id+']/update, count = ' + this.count);
				}
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