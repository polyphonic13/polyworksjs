var GameConfig = (function() {
	
	var module = {};
	
	module.init = function(callback, context) {
		// stage sizes cached
		var screenW = Polyworks.Stage.screenW;
		var screenH = Polyworks.Stage.screenH;
		var gameW = Polyworks.Stage.gameW;
		var gameH = Polyworks.Stage.gameH;
		var gameUnit = Polyworks.Stage.unit;
		
		var defaultWorld = {
			x: 0,
			y: 0,
			width: gameW,
			height: gameH
		};

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
					greyTilesMap: 'data/factory_world.json'
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
			globalViews: {
				notification: {
					type: 'group',
					name: 'notification',
					attrs: {
						fixedToCamera: true
					},
					views: [
					{
						type: 'sprite',
						name: 'notification-bg',
						img: 'blockWhite',
						x: (gameUnit/2),
						y: (gameUnit/2),
						attrs: {
							width: (gameW - gameUnit),
							height: (gameH - gameUnit),
							alpha: 0.75,
							fixedToCamera: true
						}
					},
					{
						type: 'text',
						name: 'notification-text',
						text: '',
						style: {
						    font: "184px Arial",
					        fill: "#000000"
						},
						x: 0,
						y: (gameUnit * 2),
						position: {
							centerX: true
						}
					},
					{
						type: 'button',
						name: 'close-button',
						img: 'buttonClose',
						x: (gameW - gameUnit * 1.5),
						y: (gameUnit * 0.5),
						attrs: {
							width: gameUnit * 1,
							height: gameUnit * 1
						},
						callback: function() {
							Polyworks.EventCenter.trigger({ type: Polyworks.Events.REMOVE_NOTIFICATION });
						},
						context: this,
						frames: [0, 1, 1, 0]
					}
					]
				}
			},
			defaultScreen: 'tractors',
			screens: [
			// start
			{
				name: 'start',
				world: defaultWorld,
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
				listeners: gameLogic.states.start.listeners,
				views: [
				// bg
				{
					type: 'sprite',
					name: 'start-background',
					img: 'startBg',
					x: 0,
					y: 0,
					attrs: {
						width: gameW,
						height: gameH
					}
				},
				// game start button
				{
					type: 'button',
					name: 'game-start-button',
					img: 'buttonGameStart',
					x: 0,
					y: (gameH * 0.7),
					attrs: {
						width: gameW,
						height: ((gameW)/5),
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
					y: (gameH - gameUnit * 2.5),
					attrs: {
						width: gameUnit * 2.5,
						height: gameUnit * 2.5,
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
			// manual
			{
				name: 'manual',
				world: defaultWorld,
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
						width: gameW,
						height: gameH
					}
				},
				{
					type: 'button',
					name: 'close-button',
					img: 'buttonClose',
					x: (gameW - gameUnit * 1.5),
					y: (gameUnit * 0.5),
					attrs: {
						width: gameUnit * 1,
						height: gameUnit * 1
					},
					callback: function() {
						Polyworks.EventCenter.trigger({ type: Polyworks.Events.CHANGE_STATE, value: 'start' });
					},
					context: this,
					frames: [0, 1, 1, 0]
				}
				]
			},
			// play
			{
				name: 'play',
				world: defaultWorld,
				clearWorld: true,
				clearCache: false,
				assets: {
					images: [
					'worldBg',
					'greyTiles',
					'buttonPlus',
					'buttonMinus',
					'iconFactory',
					'iconShowroom'
					],
					sprites: [
					'buttonPause',
					'buttonPlay',
					'buttonClose'
					],
					tilemaps: [
					'greyTilesMap'
					]
				},
				listeners: gameLogic.states.play.listeners,
				create: gameLogic.states.play.create,
				shutdown: gameLogic.states.play.shutdown,
				tilemaps: [
				{
					type: 'PhaserTileMap',
					name: 'tile-map',
					img: 'grassTiles',
					attrs: {
						x: 0,
						y: (gameUnit * 3)
					},
					cellSize: (gameUnit),
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
						width: gameW,
						height: gameH,
						fixedToCamera: true
					}
				},
				// text group
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
						y: (gameUnit * 2),
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
						x: gameUnit * 0.2,
						y: gameUnit * 4,
						attrs: {
							width: gameUnit,
							height: gameUnit,
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
						x: gameUnit * 0.2,
						y: gameUnit * 5.2,
						attrs: {
							width: gameUnit,
							height: gameUnit
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
						x: (gameW - gameUnit * 1.75),
						y: (gameH - gameUnit * 4.75),
						attrs: {
							width: gameUnit * 1.5,
							height: gameUnit * 1.5,
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
						x: (gameW - gameUnit * 1.75),
						y: (gameH - gameUnit * 4.75),
						attrs: {
							width: gameUnit * 1.5,
							height: gameUnit * 1.5,
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
						x: gameUnit,
						y: gameUnit * 11,
						attrs: {
							width: gameUnit * 2,
							height: gameUnit * 1
						},
						input: gameLogic.states.play.views.icons.input
					},
					{
						type: 'sprite',
						name: 'showroom-icon',
						img: 'iconShowroom',
						x: gameUnit * 4,
						y: gameUnit * 11,
						attrs: {
							width: gameUnit * 2,
							height: gameUnit * 1
						},
						input: gameLogic.states.play.views.icons.input
					}
					]
				}
				]
			},
			// tractor builder
			{
				name: 'tractors',
				world: defaultWorld,
				clearWorld: true,
				clearCache: false,
				assets: {
					images: [
					'blockGreen',
					'blockWhite'
					],
					sprites: [
					'buttonClose'
					]
				},
				listeners: gameLogic.states.tractors.listeners,
				views: [
				// bg
				{
					type: 'sprite',
					name: 'tractors-state-bg',
					img: 'blockGreen',
					x: 0,
					y: 0,
					attrs: {
						width: gameW,
						height: gameH,
						fixedToCamera: true
					},
					input: gameLogic.states.tractors.views.bg.input
				},
				// text group
				{
					type: 'group',
					name: 'tractors-text-group',
					attrs: {
						fixedToCamera: true
					},
					views: [
					{
						type: 'text',
						name: 'tractors-title',
						text: 'build your tractor',
						style: {
						    font: "24px Arial",
					        fill: "#ffffff"
						},
						x: 0,
						y: (gameUnit * 2),
						position: {
							centerX: true
						}
					}
					]
				},
				// buttons group
				{
					type: 'group',
					name: 'tractors-state-button-group',
					attrs: {
						fixedToCamera: true
					},
					views: [
					// close button
					{
						type: 'button',
						name: 'close-button',
						img: 'buttonClose',
						x: (gameW - gameUnit * 1.75),
						y: (gameUnit * 0.25),
						attrs: {
							width: gameUnit * 1.5,
							height: gameUnit * 1.5,
							visible: true
						},
						callback: function() {
							Polyworks.EventCenter.trigger({ type: Polyworks.Events.CHANGE_STATE, value: 'play' });
						},
						context: this,
						frames: [0, 1, 1, 0]
					}
					]
				},
				// icons group
				{
					type: 'group',
					name: 'tractors-state-icon-group',
					attrs: {
						fixedToCamera: true
					},
					views: [
					{
						type: 'sprite',
						name: 'white-bg',
						img: 'blockWhite',
						x: gameUnit,
						y: gameUnit,
						attrs: {
							width: (gameW - (gameUnit * 2)),
							height: (gameH - (gameUnit * 2)),
							alpha: 0.5
						}
					}]
				}
				]
			}
			]
		};
		callback.call(context, config);
	};
	return module;
}());