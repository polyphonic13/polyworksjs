var GameConfig = (function() {
	
	var module = {};
	
	module.init = function(callback, context) {
		// stage sizes cached
		var stateW = Polyworks.Stage.stateW;
		var stateH = Polyworks.Stage.stateH;
		var gameW = Polyworks.Stage.gameW;
		var gameH = Polyworks.Stage.gameH;
		var gameUnit = Polyworks.Stage.unit;
		
		var fontSizes = {
			xs: (gameUnit * 0.5),
			sm: (gameUnit * 0.6),
			md: (gameUnit * 0.75),
			lg: (gameUnit * 1.0),
			xl: (gameUnit * 1.5)
		};

		var defaultWorld = {
			x: 0,
			y: 0,
			width: gameW,
			height: gameH
		};

		var globalViews = {
			states: {
				notification: {
					type: 'group',
					name: 'notification',
					attrs: {
						visible: false,
						fixedToCamera: true
					},
					views: {
						notificationBg: {
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
						notificationText: {
							type: 'text',
							name: 'notification-text',
							text: '',
							style: {
							    font: (fontSizes.md + 'px Arial'),
						        fill: '#000000'
							},
							x: 0,
							y: (gameUnit * 2),
							position: {
								centerX: true
							}
						},
						closeButton: {
							type: 'button',
							name: 'close-button',
							img: 'buttonClose',
							x: (gameW - gameUnit * 1.25),
							y: (gameUnit * 0.25),
							attrs: {
								width: gameUnit * 1,
								height: gameUnit * 1
							},
							callback: function() {
								Polyworks.EventCenter.trigger({ type: Polyworks.Events.HIDE_NOTIFICATION });
							},
							context: this,
							frames: [0, 1, 1, 0]
						}
					}
				}
			}
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
					iconTractor: 'images/icon_tractor.gif',
					iconSkidsteer: 'images/icon_skidsteer.gif',
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
			attrs: {
				firstPlay: false
			},
			defaultScreen: 'play',
			states: [
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
				views: {
					// bg
					stateBg: {
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
					startButton: {
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
						callback: gameLogic.states.start.views.startButton.callback,
						context: this,
						frames: [0, 1, 1, 0]
					},
					// manual button
					manualButton: {
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
				}
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
				views: {
					stateBg: {
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
					closeButton: {
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
				}
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
					'iconShowroom',
					'blockWhite',
					'blockClear'
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
				views: 
				{
					// bg
					stateBg: {
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
					textGroup: {
						type: 'group',
						name: 'start-state-text',
						attrs: {
							fixedToCamera: true
						},
						views: 
						{
							timerText: {
								type: 'text',
								name: 'turn-time',
								text: 'Turn time: ' + TIME_PER_TURN,
								style: {
								    font: (fontSizes.md + 'px Arial'),
							        fill: '#ffffff'
								},
								x: 0,
								y: (gameUnit * 2),
								position: {
									centerX: true
								}
							}
						}
					},
					// buttons group
					buttonsGroup: {
						type: 'group',
						name: 'start-state-buttons',
						attrs: {
							fixedToCamera: true
						},
						views: {
							plusButton: {
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
								input: gameLogic.states.play.views.buttonsGroup.plusButton.input
							},
							minusButton: {
								type: 'sprite',
								name: 'minus-button',
								img: 'buttonMinus',
								x: gameUnit * 0.2,
								y: gameUnit * 5.2,
								attrs: {
									width: gameUnit,
									height: gameUnit
								},
								input: gameLogic.states.play.views.buttonsGroup.minusButton.input
							},
							pauseButton: {
								type: 'button',
								name: 'pause-button',
								img: 'buttonPause',
								x: (gameW - gameUnit * 1.75),
								y: (gameH - gameUnit * 4.75),
								attrs: {
									width: gameUnit * 1.5,
									height: gameUnit * 1.5,
									visible: false
								},
								callback: gameLogic.states.play.views.buttonsGroup.pauseButton.callback,
								context: this,
								frames: [0, 1, 1, 0]
							},
							resumeButton: {
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
								callback: gameLogic.states.play.views.buttonsGroup.resumeButton.callback,
								context: this,
								frames: [0, 1, 1, 0]
							},
							startBuildingButton: {
								type: 'button',
								name: 'start-build-button',
								img: 'blockWhite',
								x: gameUnit,
								y: (gameH - gameUnit * 3),
								attrs: {
									width: (gameW - gameUnit * 2),
									height: (gameUnit * 1),
									alpha: 0.5
								},
								callback: gameLogic.states.play.views.buttonsGroup.startBuildingButton.callback,
								context: this,
								frames: [0, 0, 0, 0]
							},
							equipmentButton: {
								type: 'button',
								name: 'equipment-button',
								img: 'blockWhite',
								x: gameUnit * 0.5,
								y: (gameH - gameUnit * 1.25),
								attrs: {
									width: (gameUnit * 4.5),
									height: (gameUnit * 1.25),
									alpha: 0.5
								},
								callback: gameLogic.states.play.views.buttonsGroup.equipmentButton.callback,
								context: this,
								frames: [0, 0, 0, 0]
							}
						}
					},
					// icons group
					iconsGroup: {
						type: 'group',
						name: 'start-state-icons',
						attrs: {
							fixedToCamera: true
						},
						views: 
						{
							factoryIcon: {
								type: 'sprite',
								name: 'factory-icon',
								img: 'iconFactory',
								x: gameUnit,
								y: gameUnit * 11,
								attrs: {
									width: gameUnit * 2,
									height: gameUnit * 1
								},
								input: gameLogic.states.play.views.iconsGroup.input
							},
							showroomIcon: {
								type: 'sprite',
								name: 'showroom-icon',
								img: 'iconShowroom',
								x: gameUnit * 4,
								y: gameUnit * 11,
								attrs: {
									width: gameUnit * 2,
									height: gameUnit * 1
								},
								input: gameLogic.states.play.views.iconsGroup.input
							}
						}
					}
				}
			},
			// equipment
			{
				name: 'equipment',
				world: defaultWorld,
				clearWorld: true,
				clearCache: false,
				assets: {
					images: [
					'blockGreen',
					'blockWhite',
					'iconTractor',
					'iconSkidsteer'
					],
					sprites: [
					'buttonClose'
					]
				},
				listeners: gameLogic.states.equipment.listeners,
				views: {
					// bg
					bg: {
						type: 'sprite',
						name: 'equipment-state-bg',
						img: 'blockGreen',
						x: 0,
						y: 0,
						attrs: {
							width: gameW,
							height: gameH,
							fixedToCamera: true
						},
						input: gameLogic.states.equipment.views.bg.input
					},
					// text group
					textGroup: {
						type: 'group',
						name: 'equipment-text-group',
						attrs: {
							fixedToCamera: true
						},
						views: 
						{
							title: {
								type: 'text',
								name: 'equipment-title',
								text: 'Equipment Assembly',
								style: {
								    font: (fontSizes.md + 'px Arial'),
							        fill: '#ffffff'
								},
								x: 0,
								y: (gameUnit * 2),
								position: {
									centerX: true
								}
							},
							subtitle: {
								type: 'text',
								name: 'type-subtitle',
								text: 'Choose a machine type:',
								style: {
									font: (fontSizes.sm + 'px Arial'),
									fill: '#ffffff'
								},
								x: 0,
								y: (gameUnit * 4),
								position: {
									centerX: true
								}
							}
						}
					},
					// buttons group
					buttonsGroup: {
						type: 'group',
						name: 'equipment-state-button-group',
						attrs: {
							fixedToCamera: true
						},
						views: 
						// close button
						{
							closeButton: {
								type: 'button',
								name: 'close-button',
								img: 'buttonClose',
								x: (gameW - gameUnit * 1.25),
								y: (gameUnit * 0.25),
								attrs: {
									width: gameUnit * 1,
									height: gameUnit * 1
								},
								callback: gameLogic.states.equipment.views.buttonsGroup.closeButton.callback,
								context: this,
								frames: [0, 1, 1, 0]
							}
						}
					},
					// icons group
					iconsGroup: {
						type: 'group',
						name: 'equipment-state-icon-group',
						attrs: {
							fixedToCamera: true
						},
						views: 
						{
							tractorIcon: {
								type: 'sprite',
								name: 'tractor',
								img: 'iconTractor',
								x: gameUnit * 3,
								y: gameUnit * 7,
								attrs: {
									width: gameUnit * 4,
									height: gameUnit * 2
								},
								input: gameLogic.states.equipment.views.iconsGroup.tractor.input
							},
							skidsteerIcon: {
								type: 'sprite',
								name: 'skidsteer',
								img: 'iconSkidsteer',
								x: gameUnit * 3,
								y: gameUnit * 11,
								attrs: {
									width: gameUnit * 4,
									height: gameUnit * 2
								},
								input: gameLogic.states.equipment.views.iconsGroup.skidsteer.input
							}
						}
					},
					notification: Polyworks.Utils.clone(globalViews.states.notification)
				}
			},
			// tractor builder
			{
				name: 'tractorBuilder',
				world: defaultWorld,
				clearWorld: true,
				clearCache: false,
				assets: {
					images: [
					'buildBg',
					'blockWhite'
					],
					sprites: [
					'buttonClose'
					]
				},
				views: {
					// bg
					bg: {
						type: 'sprite',
						name: 'tractor-state-bg',
						img: 'buildBg',
						x: 0,
						y: 0,
						attrs: {
							width: gameW,
							height: gameH,
							fixedToCamera: true
						}
					},
					// text group
					textGroup: {
						type: 'group',
						name: 'tractor-text-group',
						attrs: {
							fixedToCamera: true
						},
						views: 
						{
							title: {
								type: 'text',
								name: 'equipment-title',
								text: 'Build tractor',
								style: {
								    font: (fontSizes.md + 'px Arial'),
							        fill: '#ffffff'
								},
								x: 0,
								y: (gameUnit * 2),
								position: {
									centerX: true
								}
							}
						}
					},
					// buttons group
					buttonsGroup: {
						type: 'group',
						name: 'tractor-builder-state-button-group',
						attrs: {
							fixedToCamera: true
						},
						views: 
						// close button
						{
							closeButton: {
								type: 'button',
								name: 'close-button',
								img: 'buttonClose',
								x: (gameW - gameUnit * 1.25),
								y: (gameUnit * 0.25),
								attrs: {
									width: gameUnit * 1,
									height: gameUnit * 1
								},
								callback: gameLogic.states.tractorBuilder.views.buttonsGroup.closeButton.callback,
								context: this,
								frames: [0, 1, 1, 0]
							}
						}
					}
				}
			},
			// skid steer builder
			{
				name: 'skidsteerBuilder',
				world: defaultWorld,
				clearWorld: true,
				clearCache: false,
				assets: {
					images: [
					'buildBg',
					'blockWhite'
					],
					sprites: [
					'buttonClose'
					]
				},
				views: {
					// bg
					bg: {
						type: 'sprite',
						name: 'skid-steer-state-bg',
						img: 'buildBg',
						x: 0,
						y: 0,
						attrs: {
							width: gameW,
							height: gameH,
							fixedToCamera: true
						}
					},
					// text group
					textGroup: {
						type: 'group',
						name: 'skid-steer-text-group',
						attrs: {
							fixedToCamera: true
						},
						views: 
						{
							title: {
								type: 'text',
								name: 'equipment-title',
								text: 'Build Skid Steer',
								style: {
								    font: (fontSizes.md + 'px Arial'),
							        fill: '#ffffff'
								},
								x: 0,
								y: (gameUnit * 2),
								position: {
									centerX: true
								}
							}
						}
					},
					// buttons group
					buttonsGroup: {
						type: 'group',
						name: 'tractor-builder-state-button-group',
						attrs: {
							fixedToCamera: true
						},
						views: 
						// close button
						{
							closeButton: {
								type: 'button',
								name: 'close-button',
								img: 'buttonClose',
								x: (gameW - gameUnit * 1.25),
								y: (gameUnit * 0.25),
								attrs: {
									width: gameUnit * 1,
									height: gameUnit * 1
								},
								callback: gameLogic.states.skidsteerBuilder.views.buttonsGroup.closeButton.callback,
								context: this,
								frames: [0, 1, 1, 0]
							}
						}
					}
				}
			}
			]
		};
		callback.call(context, config);
	};
	return module;
}());