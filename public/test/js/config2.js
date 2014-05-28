var GameConfig = (function() {
	
	var module = {};
	
	module.init = function(callback, context) {
		// stage sizes cached
		var stateW = Polyworks.Stage.stateW;
		var stateH = Polyworks.Stage.stateH;
		var gameW = Polyworks.Stage.gameW;
		var gameH = Polyworks.Stage.gameH;
		var gameUnit = Polyworks.Stage.unit;

		var defaultWorld = {
			x: 0,
			y: 0,
			width: gameW,
			height: gameH
		};

		var fontSizes = {
			xs: (gameUnit * 0.5),
			sm: (gameUnit * 0.6),
			md: (gameUnit * 0.75),
			lg: (gameUnit * 1.0),
			xl: (gameUnit * 1.5)
		};
		var palette = {
			darkRed: '#ba1d3a',
			lightRed: '#e21a49',
			black: '#000000',
			white: '#ffffff'
		};

		var sharedViews = {
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
					        fill: palette.black
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
						callback: gameLogic.sharedViews.notification.closeButton.callback,
						context: this,
						frames: [0, 1, 1, 0]
					}
				}
			},
			overlayMenu: {
				type: 'group',
				name: 'overlay-menu',
				attrs: {
					visible: false
				},
				views: {
					menuBg: {
						type: 'sprite',
						name: 'menu-bg',
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
						callback: gameLogic.sharedViews.overlayMenu.closeButton.callback,
						context: this,
						frames: [0, 1, 1, 0]
					},
					items: {
						type: 'group',
						name: 'items-group',
						views: {}
					}
				}
			},
			overlayMenuItem: {
				type: 'group',
				name: 'overlay-menu-item',
				offset: (gameUnit * 3),
				totalHeight: (gameUnit * 2.5),
				views: {
					bg: {
						type: 'sprite',
						name: 'menu-item-bg',
						img: 'blockBlue',
						x: 0,
						y: 0,
						attrs: {
							width: gameW,
							height: (gameUnit * 2),
							alpha: 0.33
						}
					},
					icon: {
						type: 'sprite',
						name: 'menu-item-icon',
						img: '',
						x: gameUnit,
						y: gameUnit * 0.25,
						attrs: {
							width: gameUnit * 1.5,
							height: gameUnit * 1.5
						}
					},
					description: {
						type: 'text',
						name: 'menu-item-description',
						text: '',
						x: gameUnit * 3,
						y: gameUnit * 0.25,
						style: {
						    font: (fontSizes.sm + 'px Arial'),
					        fill: palette.black
						}
					},
					cost: {
						type: 'text',
						name: 'menu-item-cost',
						text: '',
						x: gameUnit * 3,
						y: gameUnit * 1,
						style: {
						    font: (fontSizes.sm + 'px Arial'),
					        fill: palette.black
						}
					}
				}
			}
		};

		var config = {
			gameEl: 'game_container',
			gameType: 'phaser',
			assets: {
				images: {
					startBg: 'images/screens/screen_mocks_start.gif',
					manualBg: 'images/screens/screen_mocks_manual.gif',
					briefBg: 'images/screens/screen_mocks_brief.gif',
					worldBg: 'images/screens/screen_mocks_world.gif',
					buildBg: 'images/screens/screen_mocks_build.gif',
					tractorPickerBg: 'images/screens/screen_mocks_tractor_picker.gif',
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
					buttonMinus: 'images/button_minus.png',
					wheels1: 'images/parts_icons/wheels1.gif',
					wheels2: 'images/parts_icons/wheels2.gif',
					wheels3: 'images/parts_icons/wheels3.gif',
					transmission1: 'images/parts_icons/transmission1.gif',
					transmission2: 'images/parts_icons/transmission2.gif',
					transmission3: 'images/parts_icons/transmission3.gif',
					engine1: 'images/parts_icons/engine1.gif',
					engine2: 'images/parts_icons/engine2.gif',
					engine3: 'images/parts_icons/engine3.gif',
					cab1: 'images/parts_icons/cab1.gif',
					cab2: 'images/parts_icons/cab2.gif',
					cab3: 'images/parts_icons/cab3.gif',
					headlights1: 'images/parts_icons/headlights1.gif',
					headlights2: 'images/parts_icons/headlights2.gif',
					headlights3: 'images/parts_icons/headlights3.gif'
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
				'blockClear',
				'wheels1',
				'wheels2',
				'wheels3',
				'transmission1',
				'transmission2',
				'transmission3',
				'engine1',
				'engine2',
				'engine3',
				'cab1',
				'cab2',
				'cab3',
				'headlights1',
				'headlights2',
				'headlights3'
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
				firstPlay: false,
				equipmentAction: '',
				sharedViews: sharedViews,
				addOverlayMenuItems: gameLogic.methods.addOverlayMenuItems
			},
			defaultScreen: 'equipment',
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
					text: {
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
							        fill: palette.white
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
					buttons: {
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
								input: gameLogic.states.play.views.buttons.plusButton.input
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
								input: gameLogic.states.play.views.buttons.minusButton.input
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
								callback: gameLogic.states.play.views.buttons.pauseButton.callback,
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
								callback: gameLogic.states.play.views.buttons.resumeButton.callback,
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
								callback: gameLogic.states.play.views.buttons.startBuildingButton.callback,
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
								callback: gameLogic.states.play.views.buttons.equipmentButton.callback,
								context: this,
								frames: [0, 0, 0, 0]
							}
						}
					},
					// icons group
					icons: {
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
								input: gameLogic.states.play.views.icons.input
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
								input: gameLogic.states.play.views.icons.input
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
					text: {
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
								text: 'Equipment Manager',
								style: {
								    font: (fontSizes.md + 'px Arial'),
							        fill: palette.white
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
									fill: palette.white
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
					buttons: {
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
								callback: gameLogic.states.equipment.views.buttons.closeButton.callback,
								context: this,
								frames: [0, 1, 1, 0]
							}
						}
					},
					// icons group
					icons: {
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
								input: gameLogic.states.equipment.views.icons.tractor.input
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
								input: gameLogic.states.equipment.views.icons.skidsteer.input
							}
						}
					},
					notification: Polyworks.Utils.clone(sharedViews.notification)
				}
			},
			// equipment editor
			{
				name: 'equipmentEditor',
				world: defaultWorld,
				clearWorld: true,
				clearCache: false,
				assets: {
					images: [
					'buildBg',
					'tractorPickerBg',
					'blockWhite',
					'blockRed',
					'blockGreen',
					'blockBlue'
					],
					sprites: [
					'buttonClose'
					]
				},
				listeners: gameLogic.states.equipmentEditor.listeners,
				create: gameLogic.states.equipmentEditor.create,
				shutdown: gameLogic.states.equipmentEditor.shutdown,
				methods: gameLogic.states.equipmentEditor.methods,
				views: {
					buildGroup: {
						type: 'group',
						name: 'build-group',
						attrs: {
							visible: false
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
									height: gameH
								}
							},
							// text group
							text: {
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
									        fill: palette.white
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
							buttons: {
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
										callback: gameLogic.states.equipmentEditor.views.buildGroup.buttons.closeButton.callback,
										context: this,
										frames: [0, 1, 1, 0]
									}
								}
							},
							// icons group
							icons: {
								type: 'group',
								name: 'tractor-builder-state-icon-group',
								views: 
								{
									wheelIcon1: {
										type: 'sprite',
										name: 'wheel-icon',
										img: 'blockWhite',
										x: (gameUnit * 1.5),
										y: (gameUnit * 11),
										attrs: {
											width: gameUnit * 1.5,
											height: gameUnit * 2,
											alpha: 0.5
										},
										input: gameLogic.states.equipmentEditor.views.buildGroup.icons.wheelIcon.input
									},
									wheelIcon2: {
										type: 'sprite',
										name: 'wheel-icon',
										img: 'blockWhite',
										x: (gameUnit * 3.5),
										y: (gameUnit * 12),
										attrs: {
											width: gameUnit * 2,
											height: gameUnit * 1.5,
											alpha: 0.5
										},
										input: gameLogic.states.equipmentEditor.views.buildGroup.icons.wheelIcon.input
									},
									wheelIcon3: {
										type: 'sprite',
										name: 'wheel-icon',
										img: 'blockWhite',
										x: (gameUnit * 7),
										y: (gameUnit * 9.5),
										attrs: {
											width: gameUnit * 2,
											height: gameUnit * 3,
											alpha: 0.5
										},
										input: gameLogic.states.equipmentEditor.views.buildGroup.icons.wheelIcon.input
									},
									engineIcon: {
										type: 'sprite',
										name: 'wheel-icon',
										img: 'blockRed',
										x: (gameUnit * 4),
										y: (gameUnit * 9),
										attrs: {
											width: gameUnit * 2,
											height: gameUnit * 2,
											alpha: 0.5
										},
										input: gameLogic.states.equipmentEditor.views.buildGroup.icons.engineIcon.input
									},
									transmissionIcon: {
										type: 'sprite',
										name: 'wheel-icon',
										img: 'blockBlue',
										x: (gameUnit * 3),
										y: (gameUnit * 11),
										attrs: {
											width: gameUnit * 4,
											height: gameUnit * 1,
											alpha: 0.5
										},
										input: gameLogic.states.equipmentEditor.views.buildGroup.icons.transmissionIcon.input
									},
									cabIcon: {
										type: 'sprite',
										name: 'wheel-icon',
										img: 'blockGreen',
										x: (gameUnit * 4.5),
										y: (gameUnit * 7),
										attrs: {
											width: gameUnit * 3,
											height: gameUnit * 2,
											alpha: 0.5
										},
										input: gameLogic.states.equipmentEditor.views.buildGroup.icons.cabIcon.input
									},
									headlightsIcon: {
										type: 'sprite',
										name: 'wheel-icon',
										img: 'blockGreen',
										x: (gameUnit * 3),
										y: (gameUnit * 9),
										attrs: {
											width: gameUnit * 1,
											height: gameUnit * 2,
											alpha: 0.5
										},
										input: gameLogic.states.equipmentEditor.views.buildGroup.icons.headlightsIcon.input
									}
								}
							}
						}
					},
					createGroup: {
						type: 'group',
						name: 'create-group',
						attrs: {
							visible: false
						},
						views: {
							bg: {
								type: 'sprite',
								name: 'create-bg',
								img: 'tractorPickerBg',
								x: 0,
								y: 0,
								attrs: {
									width: gameW,
									height: gameH
								}
							},
							icons: {
								type: 'group',
								name: 'create-icons',
								views: {
									basic: {
										type: 'sprite',
										name: 'create-basic-tractor',
										img: 'blockBlue',
										x: 0,
										y: gameUnit * 2,
										attrs: {
											width: gameW,
											height: gameUnit * 4,
											alpha: 0.5
										},
										input: gameLogic.states.equipmentEditor.views.createGroup.icons.createBasic.input
									},
									medium: {
										type: 'sprite',
										name: 'create-medium-tractor',
										img: 'blockGreen',
										x: 0,
										y: gameUnit * 6,
										attrs: {
											width: gameW,
											height: gameUnit * 4.5,
											alpha: 0.5
										},
										input: gameLogic.states.equipmentEditor.views.createGroup.icons.createMedium.input
									},
									heavy: {
										type: 'sprite',
										name: 'create-heavy-tractor',
										img: 'blockRed',
										x: 0,
										y: gameUnit * 10.5,
										attrs: {
											width: gameW,
											height: gameUnit * 5,
											alpha: 0.5
										},
										input: gameLogic.states.equipmentEditor.views.createGroup.icons.createHeavy.input
									}
								}
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