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
					blockWhite: 'images/block_white.png',
					blockClear: 'images/block_clear.png',
					blockBlue: 'images/block_blue.gif',
					blockGreen: 'images/block_green.gif',
					blockRed: 'images/block_red.gif',
					greyTiles: 'images/grey_tiles2.gif',
					iconFactory: 'images/icon_factory.gif',
					iconShowroom: 'images/icon_showroom.gif',
					buttonPlus: 'images/button_plus.png',
					buttonMinus: 'images/button_minus.png'
				},
				sprites: {
					buttonGameStart: {
						url: 'images/button_game_start.gif',
						width: 800,
						height: 160,
						frames: 2
					},
					buttonPause: {
						url: 'images/button_pause.png',
						width: 50,
						height: 50,
						frames: 2
					},
					buttonPlay: {
						url: 'images/button_play.png',
						width: 50,
						height: 50,
						frames: 2
					},
					buttonClose: {
						url: 'images/button_close.png',
						width: 50,
						height: 50,
						frames: 2
					}	
				},
				tilemaps: {
					grass01: 'data/grass_tile_map01.json',
					// greyTiles: 'data/grass_tile_map02.json'
					// greyTiles: 'data/grass_tile_map02.json',
					greyTiles: 'data/factory_world.json'
				}
			},
			preload: {
				images: [
				'blockWhite',
				'blockClear'
				],
				sprites: [
				'buttonClose'
				],
				tilemaps: []
			},
			stage: {
				fullScreen: true,
				scaleMode: Phaser.ScaleManager.SHOW_ALL
			},
			defaultScreen: 'play',
			screens: [
			// start
			{
				name: 'start',
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
					'startBg',
					'blockClear',
					'blockRed',
					'blockBlue',
					'blockWhite'
					],
					sprites: [
					'buttonGameStart'
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
				// bg
				{
					type: 'sprite',
					name: 'start-background',
					img: 'startBg',
					x: 0,
					y: 0,
					attrs: {
						width: Polyworks.Stage.gameW,
						height: Polyworks.Stage.gameH
					}
				},
				// game start button
				{
					type: 'button',
					name: 'game-start-button',
					img: 'buttonGameStart',
					x: 0,
					y: (Polyworks.Stage.gameH * 0.7),
					attrs: {
						width: Polyworks.Stage.gameW,
						height: ((Polyworks.Stage.gameW)/5),
						alpha: 0.75
					},
					callback: function() {
						Polyworks.EventCenter.trigger({ type: Polyworks.Events.CHANGE_STATE, value: 'play' });
					},
					context: this,
					frames: [0, 1, 1, 0]
				},
				// manual button
				{
					type: 'button',
					name: 'manual-button',
					img: 'blockClear',
					x: 0,
					y: (Polyworks.Stage.gameH - Polyworks.Stage.unit * 2.5),
					attrs: {
						width: Polyworks.Stage.unit * 2.5,
						height: Polyworks.Stage.unit * 2.5,
						alpha: 0.75
					},
					callback: function() {
						Polyworks.EventCenter.trigger({ type: Polyworks.Events.CHANGE_STATE, value: 'manual' });
					},
					context: this,
					frames: [0, 1, 1, 0]
				}
				]
			},
			// play
			{
				name: 'play',
				world: {
					x: -1000,
					y: -1000,
					// width: Polyworks.Stage.gameW,
					// height: Polyworks.Stage.gameH
					width: 2000,
					height: 2000
				},
				clearWorld: true,
				clearCache: false,
				assets: {
					images: [
					'worldBg',
					'greyTiles',
					'grassTiles',
					'buttonPlus',
					'buttonMinus',
					'iconFactory',
					'iconShowroom'
					],
					sprites: [
					'buttonPause',
					'buttonPlay'
					],
					tilemaps: [
					'greyTiles'
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
						this.views['turn-time'].callMethod('setText', ['Turn ended']);
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
							var text = 'Turn time: ' + this.timePerTurn;
							this.views['turn-time'].callMethod('setText', [text]);
							if(this.timePerTurn <= 0) {
								Polyworks.EventCenter.trigger({ type: Polyworks.Events.TURN_ENDED });
							}
						},
						this
					);
					// this.turnTimer.start();
				},
				shutdown: function() {
					Polyworks.PhaserTime.removeTimer('turnTime');
				},
				// inputs: [
				// {
				// 	type: 'CameraDragger',
				// 	name: 'camera-dragger'
				// }
				// ],
				tilemaps: [
				{
					type: 'PhaserTileMap',
					name: 'tile-map',
					img: 'grassTiles',
					attrs: {
						x: 0,
						y: (Polyworks.Stage.unit * 3)
					},
					cellSize: (Polyworks.Stage.unit),
					deafultLayer: 'TileLayer1',
					attrs: {
						zoomFactor: 0.25,
						zoomCeil: 2.5,
						zoomFloor: .25
					},
					layers: [
					{
						name: 'layer1',
						resizeWorld: true,
						attrs: {
							alpha: 0.75
						}
					}
					]
				}
				],
				views: [
				// bg
				{
					type: 'sprite',
					name: 'play-background',
					img: 'worldBg',
					x: 0,
					y: 0,
					attrs: {
						width: Polyworks.Stage.gameW,
						height: Polyworks.Stage.gameH,
						fixedToCamera: true
					}
				},
				// turn timer text
				{
					type: 'group',
					name: 'start-state-text',
					attrs: {
						fixedToCamera: true
					},
					views: [
					{
						type: 'text',
						name: 'turn-time',
						text: 'Turn time: ' + TIME_PER_TURN,
						style: {
						    font: "24px Arial",
					        fill: "#ffffff"
						},
						x: 0,
						y: (Polyworks.Stage.unit * 2),
						position: {
							centerX: true
						}
					}
					]
				},
				// buttons group
				{
					type: 'group',
					name: 'start-state-buttons',
					attrs: {
						fixedToCamera: true
					},
					views: [
					{
						type: 'sprite',
						name: 'plus-button',
						img: 'buttonPlus',
						x: Polyworks.Stage.unit * 0.2,
						y: Polyworks.Stage.unit * 4,
						attrs: {
							width: Polyworks.Stage.unit,
							height: Polyworks.Stage.unit,
							collideWorldBounds: true
						},
						input: {
							inputUp: function() {
								// trace('plus pressed');
								Polyworks.EventCenter.trigger({ type: Polyworks.Events.ZOOM_IN });
							}
						}
					},
					{
						type: 'sprite',
						name: 'minus-button',
						img: 'buttonMinus',
						x: Polyworks.Stage.unit * 0.2,
						y: Polyworks.Stage.unit * 5.2,
						attrs: {
							width: Polyworks.Stage.unit,
							height: Polyworks.Stage.unit
						},
						input: {
							inputUp: function() {
								// trace('minus pressed');
								Polyworks.EventCenter.trigger({ type: Polyworks.Events.ZOOM_OUT });
							}
						}
					},
					// pause button
					{
						type: 'button',
						name: 'pause-button',
						img: 'buttonPause',
						x: (Polyworks.Stage.gameW - Polyworks.Stage.unit * 1.75),
						y: (Polyworks.Stage.gameH - Polyworks.Stage.unit * 4.75),
						attrs: {
							width: Polyworks.Stage.unit * 1.5,
							height: Polyworks.Stage.unit * 1.5,
							visible: true
						},
						callback: function() {
							Polyworks.EventCenter.trigger({ type: Polyworks.Events.PAUSE_GAME });
						},
						context: this,
						frames: [0, 1, 1, 0]
					},
					// play button
					{
						type: 'button',
						name: 'resume-button',
						img: 'buttonPlay',
						x: (Polyworks.Stage.gameW - Polyworks.Stage.unit * 1.75),
						y: (Polyworks.Stage.gameH - Polyworks.Stage.unit * 4.75),
						attrs: {
							width: Polyworks.Stage.unit * 1.5,
							height: Polyworks.Stage.unit * 1.5,
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
				// icons group
				{
					type: 'group',
					name: 'start-state-icons',
					attrs: {
						fixedToCamera: true
					},
					views: [
					{
						type: 'sprite',
						name: 'factory-icon',
						img: 'iconFactory',
						x: Polyworks.Stage.unit,
						y: Polyworks.Stage.unit * 11,
						attrs: {
							width: Polyworks.Stage.unit * 2,
							height: Polyworks.Stage.unit * 1
						},
						input: {
							inputDown: function() {
								trace('factory-icon/inputDown, this = ', this);
								if(this.selected) {
									PhaserGame.selectedIcon = '';
									this.selected = false;
								} else {
									PhaserGame.selectedIcon = this.name;
									this.selected = true;
								}
							}
						}
					},
					{
						type: 'sprite',
						name: 'showroom-icon',
						img: 'iconShowroom',
						x: Polyworks.Stage.unit * 4,
						y: Polyworks.Stage.unit * 11,
						attrs: {
							width: Polyworks.Stage.unit * 2,
							height: Polyworks.Stage.unit * 1
						},
						input: {
							inputDown: function() {
								if(this.selected) {
									PhaserGame.selectedIcon = '';
									this.selected = false;
								} else {
									PhaserGame.selectedIcon = this.name;
									this.selected = true;
								}
							}
						}
					}
					]
				}
				]
			},
			// manual
			{
				name: 'manual',
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
					'manualBg'
					],
					sprites: [
					'buttonClose'
					],
					tilemaps: [
					'greyTiles'
					]
				},
				attrs: {
				},
				listeners: [
				],
				create: function() {
				},
				shutdown: function() {
				},
				views: [
				{
					type: 'sprite',
					name: 'manual-background',
					img: 'manualBg',
					x: 0,
					y: 0,
					attrs: {
						width: Polyworks.Stage.gameW,
						height: Polyworks.Stage.gameH
					}
				},
				{
					type: 'button',
					name: 'close-button',
					img: 'buttonClose',
					x: (Polyworks.Stage.gameW - Polyworks.Stage.unit * 1.5),
					y: (Polyworks.Stage.unit * 0.5),
					attrs: {
						width: Polyworks.Stage.unit * 1,
						height: Polyworks.Stage.unit * 1
					},
					callback: function() {
						Polyworks.EventCenter.trigger({ type: Polyworks.Events.CHANGE_STATE, value: 'start' });
					},
					context: this,
					frames: [0, 1, 1, 0]
				}
				]
			}
			]
		};
		callback.call(context, config);
	};
	return module;
}());