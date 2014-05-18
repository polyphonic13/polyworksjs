var GameConfig = (function() {
	var module = {
		
	}
	
	module.init = function(callback, context) {
		trace('MODULE INIT, STAGE = ', Polyworks.Stage);
		var config = {
			gameType: 'phaser',
			assets: {
				images: {
					whiteBlock: 'images/white_rect32x32.png',
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
					},
					closeButton: {
						url: 'images/close_button.png',
						width: 50,
						height: 50,
						frames: 2
					}
				},
				tilemaps: {}
			},
			preload: {
				images: [
				'whiteBlock'
				],
				sprites: [
				'closeButton'
				],
				tilemaps: []
			},
			screens: [
			// start
			{
				id: 'start',
				world: {
					x: 0,
					y: 0,
					width: Polyworks.Stage.gameW,
					height: Polyworks.Stage.gameH
				},
				clearWorld: true,
				clearCache: false,
				assets: {
					images: [
					'startBg'
					],
					sprites: [
					'playButton'
					]
				},
				listeners: [
				{
					event: Polyworks.Events.HIDE_NOTIFICATION,
					handler: function(event) {
						this.views['notification'].hide();
					}
				},
				{
					event: Polyworks.Events.SHOW_NOTIFICATION,
					handler: function(event) {
						this.views['notification'].show();
					}
				}
				],
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
						input: {
							inputUp: function() {
								Polyworks.EventCenter.trigger({ type: Polyworks.Events.SHOW_NOTIFICATION });
							}
						}
					},
					{
						type: 'PhaserButton',
						id: 'play-button',
						img: 'playButton',
						width: Polyworks.Stage.gameW,
						height: ((Polyworks.Stage.gameW)/5),
						x: 0,
						y: (Polyworks.Stage.gameH * 0.7),
						callback: function() {
							Polyworks.EventCenter.trigger({ type: Polyworks.Events.CHANGE_STATE, value: 'play' });
						},
						context: this,
						frames: [0, 1, 1, 0]
					},
					{
						type: 'PhaserText',
						id: 'start-screen-title',
						text: 'This is a game',
						style: {
						    font: "24px Arial",
					        fill: "#ffffff"
						},
						x: 0,
						y: (Polyworks.Stage.unit * 2),
						centerX: true
					}
					]
				},
				{
					type: 'PhaserGroup',
					id: 'notification',
					attrs: {
						visible: false
					},
					views: [
					{
						type: 'PhaserSprite',
						id: 'white-bg',
						img: 'whiteBlock',
						width: (Polyworks.Stage.gameW - (Polyworks.Stage.unit * 2)),
						height: (Polyworks.Stage.gameH - (Polyworks.Stage.unit * 2)),
						x: Polyworks.Stage.unit,
						y: Polyworks.Stage.unit,
						attrs: {
							alpha: 0.95
						},
						input: {
							inputUp: function() {
								Polyworks.EventCenter.trigger({ type: Polyworks.Events.HIDE_NOTIFICATION });
							}
						}
					},
					{
						type: 'PhaserText',
						id: 'notification-title',
						text: 'This is a notification',
						style: {
						    font: "18px Arial",
					        fill: "#000000"
						},
						x: 0,
						y: 0,
						centerX: true,
						centerY: true
					}
					]
				}
				]
			},
			// play
			{
				id: 'play',
				world: {
					x: 0,
					y: 0,
					width: Polyworks.Stage.gameW,
					height: Polyworks.Stage.gameH
				},
				clearWorld: true,
				clearCache: false,
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
				}]//,
				// update: function() {
				// 	this.count++;
				// 	trace('StateController['+this.id+']/update, count = ' + this.count);
				// }
			},
			// game over
			{
				id: 'gameOver',
				world: {
					x: 0,
					y: 0,
					width: Polyworks.Stage.gameW,
					height: Polyworks.Stage.gameH
				},
				clearWorld: true,
				clearCache: false,
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