var GameConfig = (function() {
	var TIME_PER_TURN = 10;
	var TURN_TIME_INTERVAL = 1000;
	
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
					gameStartButton: {
						url: 'images/game_start_button.gif',
						width: 800,
						height: 160,
						frames: 2
					},
					pauseButton: {
						url: 'images/pause_button.png',
						width: 50,
						height: 50,
						frames: 2
					},
					playButton: {
						url: 'images/play_button.png',
						width: 50,
						height: 50,
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
					'gameStartButton'
					]
				},
				attrs: {
					count: 0
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
						id: 'game-start-button',
						img: 'gameStartButton',
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
						id: 'start-state-title',
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
						text: 'This is a notification about some very important game events that are happening',
						style: {
						    font: "18px Arial",
					        fill: "#000000",
							wordWrap: "true"
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
					],
					sprites: [
					'pauseButton',
					'playButton'
					]
				},
				listeners: [
				{
					event: Polyworks.Events.PAUSE_GAME,
					handler: function(event) {
						this.turnTimer.pause();
						this.views['pause-button'].hide();
						this.views['resume-button'].show();
					}
				},
				{
					event: Polyworks.Events.RESUME_GAME,
					handler: function(event) {
						this.turnTimer.resume();
						this.views['resume-button'].hide();
						this.views['pause-button'].show();
					}
				},
				{
					event: Polyworks.Events.TURN_ENDED,
					handler: function(event) {
						Polyworks.PhaserTime.removeTimer('turnTime');
						this.views['turn-time'].setText('Turn ended');
						this.views['pause-button'].hide();
					}
				}
				],
				create: function() {
					this.timePerTurn = TIME_PER_TURN;
					this.turnTimer = new Polyworks.PhaserTime.Controller('turnTime');
					this.turnTimer.loop(TURN_TIME_INTERVAL, function() {
							trace('\ttimePerTurn = ' + this.timePerTurn);
							this.timePerTurn--;
							this.views['turn-time'].setText('Turn time: ' + this.timePerTurn);
							if(this.timePerTurn <= 0) {
								Polyworks.EventCenter.trigger({ type: Polyworks.Events.TURN_ENDED });
							}
						},
						this
					);
					this.turnTimer.start();
				},
				// update: function() {
				// 	this.count++;
				// 	trace('StateController['+this.id+']/update, count = ' + this.count);
				// },
				shutdown: function() {
					Polyworks.PhaserTime.removeTimer('turnTime');
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
				},
				{
					type: 'PhaserText',
					id: 'turn-time',
					text: 'Turn time: ' + TIME_PER_TURN,
					style: {
					    font: "24px Arial",
				        fill: "#ffffff"
					},
					x: 0,
					y: (Polyworks.Stage.unit * 2),
					centerX: true
				},
				{
					type: 'PhaserButton',
					id: 'pause-button',
					img: 'pauseButton',
					width: Polyworks.Stage.unit * 2,
					height: Polyworks.Stage.unit * 2,
					x: (Polyworks.Stage.gameW - Polyworks.Stage.unit * 3),
					y: (Polyworks.Stage.gameH - Polyworks.Stage.unit * 3),
					attrs: {
						visible: true
					},
					callback: function() {
						Polyworks.EventCenter.trigger({ type: Polyworks.Events.PAUSE_GAME });
					},
					context: this,
					frames: [0, 1, 1, 0]
				},
				{
					type: 'PhaserButton',
					id: 'resume-button',
					img: 'playButton',
					width: Polyworks.Stage.unit * 2,
					height: Polyworks.Stage.unit * 2,
					x: (Polyworks.Stage.gameW - Polyworks.Stage.unit * 3),
					y: (Polyworks.Stage.gameH - Polyworks.Stage.unit * 3),
					attrs: {
						visible: false
					},
					callback: function() {
						Polyworks.EventCenter.trigger({ type: Polyworks.Events.RESUME_GAME });
					},
					context: this,
					frames: [0, 1, 1, 0]
				}
				]
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
				},
				{
					type: 'PhaserText',
					id: 'gameOver-title',
					text: 'Game Over',
					style: {
					    font: "24px Arial",
				        fill: "#ffffff"
					},
					x: 0,
					y: (Polyworks.Stage.unit * 2),
					centerX: true
				}
				]
			}],
			defaultScreen: 'start'
		};
		
		callback.call(context, config);
	}
	return module;
}());