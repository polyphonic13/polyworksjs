var GameConfig = (function() {
	var TIME_PER_TURN = 10;
	var TURN_TIME_INTERVAL = 1000;
	var GRID_CELLS = 9;
	
	var module = {};
	
	module.init = function(callback, context) {
		var config = {
			gameType: 'phaser',
			pallete: {
				darkRed: '#ba1d3a',
				lightRed: '#e21a49',
				black: '#000000',
				white: '#ffffff'
			},
			assets: {
				images: {
					startBg: 'images/screen_mocks_start.gif',
					manualBg: 'images/screen_mocks_manual.gif',
					briefBg: 'images/screen_mocks_brief.gif',
					buildBg: 'images/screen_mocks_build.gif',
					worldBg: 'images/screen_mocks_world.gif',
					whiteBlock: 'images/white_rect32x32.png',
					playBg: 'images/bg_green.gif',
					gameOverBg: 'images/bg_red.gif',
					greyTiles: 'images/grey_tiles.gif',
					grassTiles: 'images/grass-tiles-2-small.png'
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
					// },
					// greyTiles: {
					// 	url: 'images/grey_tiles.gif',
					// 	width: 32,
					// 	height: 32,
					// 	frames: 3
					}	
				},
				tilemaps: {
					grass01: 'data/grass_tile_map01.json',
					greyTiles: 'data/grass_tile_map02.json'
				}
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
					width: PWG.Stage.gameW,
					height: PWG.Stage.gameH
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
				listeners: [
				{
					event: PWG.Events.CLOSE_NOTIFICATION,
					handler: function(event) {
						this.views['notification'].hide();
					}
				},
				{
					event: PWG.Events.SHOW_NOTIFICATION,
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
						x: 0,
						y: 0,
						attrs: {
							width: PWG.Stage.gameW,
							height: PWG.Stage.gameH
						},
						input: {
							inputUp: function() {
								PWG.EventCenter.trigger({ type: PWG.Events.SHOW_NOTIFICATION });
							}
						}
					},
					{
						type: 'PhaserButton',
						id: 'game-start-button',
						img: 'gameStartButton',
						x: 0,
						y: (PWG.Stage.gameH * 0.7),
						attrs: {
							width: PWG.Stage.gameW,
							height: ((PWG.Stage.gameW)/5),
							alpha: 0.75
						},
						callback: function() {
							PWG.EventCenter.trigger({ type: PWG.Events.CHANGE_STATE, value: 'play' });
						},
						context: this,
						frames: [0, 1, 1, 0]
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
						x: PWG.Stage.unit,
						y: PWG.Stage.unit,
						attrs: {
							width: (PWG.Stage.gameW - (PWG.Stage.unit * 2)),
							height: (PWG.Stage.gameH - (PWG.Stage.unit * 2)),
							alpha: 0.95
						},
						input: {
							inputUp: function() {
								PWG.EventCenter.trigger({ type: PWG.Events.CLOSE_NOTIFICATION });
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
					width: PWG.Stage.gameW,
					height: PWG.Stage.gameH
				},
				clearWorld: true,
				clearCache: false,
				assets: {
					images: [
					'playBg',
					'greyTiles',
					'grassTiles'
					],
					sprites: [
					'pauseButton',
					'playButton'
					],
					tilemaps: [
					'greyTiles'
					]
				},
				attrs: {
				},
				listeners: [
				{
					event: PWG.Events.PAUSE_GAME,
					handler: function(event) {
						this.turnTimer.pause();
						this.views['pause-button'].hide();
						this.views['resume-button'].show();
					}
				},
				{
					event: PWG.Events.RESUME_GAME,
					handler: function(event) {
						this.turnTimer.resume();
						this.views['resume-button'].hide();
						this.views['pause-button'].show();
					}
				},
				{
					event: PWG.Events.TURN_ENDED,
					handler: function(event) {
						PWG.PhaserTime.removeTimer('turnTime');
						this.views['turn-time'].setText('Turn ended');
						this.views['pause-button'].hide();
					}
				}
				],
				create: function() {
					this.timePerTurn = TIME_PER_TURN;
					this.turnTimer = new PWG.PhaserTime.Controller('turnTime');
					this.turnTimer.loop(TURN_TIME_INTERVAL, function() {
							// trace('\ttimePerTurn = ' + this.timePerTurn);
							this.timePerTurn--;
							this.views['turn-time'].setText('Turn time: ' + this.timePerTurn);
							if(this.timePerTurn <= 0) {
								PWG.EventCenter.trigger({ type: PWG.Events.TURN_ENDED });
							}
						},
						this
					);
					// this.turnTimer.start();
				},
				shutdown: function() {
					PWG.PhaserTime.removeTimer('turnTime');
				},
				views: [
				{
					type: 'PhaserTileMap',
					id: 'tile-map',
					img: 'grassTiles',
					attrs: {
						x: 0,
						y: (PWG.Stage.unit * 3)
					},
					cellSize: (PWG.Stage.unit),
					layers: [
					{
						id: 'main',
						xCells: 10,
						yCells: 10
					}]
				},
				{
					type: 'PhaserGroup',
					id: 'mask-sprites',
					views: [
					{
						type: 'PhaserSprite',
						id: 'play-mask-top',
						img: 'playBg',
						x: 0,
						y: 0,
						attrs: {
							width: PWG.Stage.gameW,
							height: PWG.Stage.unit * 3
						},
						input: {
							inputUp: function() {
								trace('start background input up function');
								PWG.EventCenter.trigger({ type: PWG.Events.CHANGE_STATE, value: 'gameOver' });
							}
						}
					},
					{
						type: 'PhaserSprite',
						id: 'play-mask-bottom',
						img: 'playBg',
						x: 0,
						y: PWG.Stage.unit * 13,
						attrs: {
							width: PWG.Stage.gameW,
							height: PWG.Stage.unit * 3
						}
					}
					]
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
					y: (PWG.Stage.unit * 2),
					centerX: true
				},
				{
					type: 'PhaserButton',
					id: 'pause-button',
					img: 'pauseButton',
					x: (PWG.Stage.gameW - PWG.Stage.unit * 2.5),
					y: (PWG.Stage.gameH - PWG.Stage.unit * 2.5),
					attrs: {
						width: PWG.Stage.unit * 2,
						height: PWG.Stage.unit * 2,
						visible: true
					},
					callback: function() {
						PWG.EventCenter.trigger({ type: PWG.Events.PAUSE_GAME });
					},
					context: this,
					frames: [0, 1, 1, 0]
				},
				{
					type: 'PhaserButton',
					id: 'resume-button',
					img: 'playButton',
					x: (PWG.Stage.gameW - PWG.Stage.unit * 3),
					y: (PWG.Stage.gameH - PWG.Stage.unit * 3),
					attrs: {
						width: PWG.Stage.unit * 2,
						height: PWG.Stage.unit * 2,
						visible: false
					},
					callback: function() {
						PWG.EventCenter.trigger({ type: PWG.Events.RESUME_GAME });
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
					width: PWG.Stage.gameW,
					height: PWG.Stage.gameH
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
					attrs: {
						width: PWG.Stage.gameW,
						height: PWG.Stage.gameH
					},
					input: {
						inputUp: function() {
							trace('start background input up function');
							PWG.EventCenter.trigger({ type: PWG.Events.CHANGE_STATE, value: 'start' });
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
					y: (PWG.Stage.unit * 2),
					centerX: true
				}
				]
			}],
			defaultScreen: 'start'
		};
		callback.call(context, config);
	};
	return module;
}());