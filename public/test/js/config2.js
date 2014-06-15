var gameData = {
	buildings: {
		factory: {
			id: 'factory',
			icon: 'iconFactory',
			description: 'Build your machines',
			cost: 100000
		},
		showroom: {
			id: 'showroom',
			icon: 'iconShowroom',
			description: 'Sell your machines',
			cost: 50000
		}
	},
	parts: {
		wheels: [
		{
			id: 'w3',
			icon: 'wheels2',
			frame: 1,
			description: 'basic wheels',
			basic: {
				cost: 350,
				build: 50,
				sell: 1000
			},
			medium: {
				cost: 700,
				build: 100,
				sell: 2000
			},
			heavy: {
				cost: 1000,
				build: 150,
				sell: 3000
			}
		},
		{
			id: 'w1',
			icon: 'wheels1',
			frame: 2,
			description: 'standard wheels',
			basic: {
				cost: 500,
				build: 100,
				sell: 2000
			},
			medium: {
				cost: 1000,
				build: 200,
				sell: 4000
			},
			heavy: {
				cost: 1500,
				build: 250,
				sell: 5000
			}
		},
		{
			id: 'w4',
			icon: 'wheels3',
			frame: 3,
			description: 'deluxe wheels',
			basic: {
				cost: 1000,
				build: 250,
				sell: 5000
			},
			medium: {
				cost: 2000,
				build: 500,
				sell: 10000
			},
			heavy: {
				cost: 4000,
				build: 1000,
				sell: 20000
			}
		}
		],
		engine: [
		{
			id: 'e1',
			icon: 'engine1',
			frame: 1,
			description: 'basic engine',
			basic: {
				cost: 2000,
				build: 500,
				sell: 10000
			},
			medium: {
				cost: 4000,
				build: 1000,
				sell: 20000
			},
			heavy: {
				cost: 6000,
				build: 1500,
				sell: 30000
			}
		},
		{
			id: 'e2',
			icon: 'engine2',
			frame: 2,
			description: 'standard engine',
			basic: {
				cost: 3000,
				build: 750,
				sell: 15000
			},
			medium: {
				cost: 6000,
				build: 1500,
				sell: 30000
			},
			heavy: {
				cost: 9000,
				build: 2000,
				sell: 40000
			}
		},
		{
			id: 'e3',
			icon: 'engine3',
			frame: 3,
			description: 'deluxe engine',
			basic: {
				cost: 5000,
				build: 500,
				sell: 10000
			},
			medium: {
				cost: 10000,
				build: 1000,
				sell: 20000
			},
			heavy: {
				cost: 15000,
				build: 1500,
				sell: 30000
			}
		}
		],
		cab: [
		{
			id: 'c1',
			icon: 'cab1',
			frame: 1,
			description: 'basic cab',
			basic: {
				cost: 300,
				build: 50,
				sell: 1000
			},
			medium: {
				cost: 600,
				build: 100,
				sell: 2000
			},
			heavy: {
				cost: 900,
				build: 150,
				sell: 3000
			}
		},
		{
			id: 'c2',
			icon: 'cab2',
			frame: 2,
			description: 'standard cab',
			basic: {
				cost: 400,
				build: 75,
				sell: 1500
			},
			medium: {
				cost: 800,
				build: 150,
				sell: 3000
			},
			heavy: {
				cost: 1200,
				build: 225,
				sell: 4500
			}
		},
		{
			id: 'c3',
			icon: 'cab3',
			frame: 3,
			description: 'deluxe cab',
			basic: {
				cost: 1000,
				build: 250,
				sell: 500
			},
			medium: {
				cost: 2000,
				build: 500,
				sell: 1000
			},
			heavy: {
				cost: 3000,
				build: 1000,
				sell: 2000
			}
		}
		]
	}
};

var GameConfig = function() {
	
	var module = {};
	
	module.init = function(callback, context) {
		// stage sizes cached
		var stateW = PWG.Stage.stateW;
		var stateH = PWG.Stage.stateH;
		var gameW = PWG.Stage.gameW;
		var gameH = PWG.Stage.gameH;
		var gameUnit = PWG.Stage.unit;

		var defaultWorld = {
			x: 0,
			y: 0,
			width: gameW,
			height: gameH
		};

		var fontSizes = {
			xxs: (gameUnit * 0.25),
			xs: (gameUnit * 0.30),
			sm: (gameUnit * 0.45),
			md: (gameUnit * 0.66),
			lg: (gameUnit * 1.0),
			xl: (gameUnit * 1.5)
		};
		var palette = {
			darkRed: '#ba1d3a',
			lightRed: '#e21a49',
			orange1: '#fca600',
			orange2: '#e9a547',
			green: '#009b1d',
			black: '#000000',
			white: '#ffffff'
		};

		var dynamicViews = {
			notification: {
				type: 'group',
				name: 'notification',
				attrs: {
					visible: false,
				},
				views: {
					notificationBg: {
						type: 'sprite',
						name: 'notificationBg',
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
						name: 'notificationText',
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
						name: 'closeButton',
						img: 'buttonClose',
						x: (gameW - gameUnit * 1.25),
						y: (gameUnit * 0.25),
						attrs: {
							width: gameUnit * 1,
							height: gameUnit * 1
						},
						callback: gameLogic.global.buttonCallbacks.notificationClose,
						context: this,
						frames: [0, 1, 1, 0]
					}
				}
			},
			usDetailGrid: {
				type: 'group',
				name: 'usDetailGrid',
				views: {}
			},
			usDetailGridItem: {
				type: 'sprite',
				name: 'usDetailGridItem',
				img: 'usDetailTiles',
				x: 0,
				y: (gameUnit * 3.5),
				attrs: {
					width: gameUnit,
					height: gameUnit,
					frame: 0
				}
			},
			buildingMenu: {
				type: 'group',
				name: 'buildingMenu',
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
					confirmButton: {
						type: 'button',
						name: 'confirmButton',
						img: 'buttonEquipmentSave',
						x: (gameW - (gameUnit * 2.5)),
						y: (gameH - (gameUnit  * 2.5)),
						attrs: {
							width: gameUnit * 2,
							height: gameUnit * 2
						},
						callback: gameLogic.global.buttonCallbacks.buildingAddConfirm,
						context: this,
						frames: [0, 1, 1, 0]
					},
					cancelButton: {
						type: 'button',
						name: 'cancelButton',
						img: 'buttonCancel',
						x: (gameUnit * 0.5),
						y: (gameH - (gameUnit  * 2.5)),
						attrs: {
							width: gameUnit * 2,
							height: gameUnit * 2
						},
						callback: gameLogic.global.buttonCallbacks.buildingAddCancel,
						context: this,
						frames: [0, 1, 1, 0]
					},
					icon: {
						type: 'group',
						name: 'itemsGroup',
						views: {
							bg: {
								type: 'sprite',
								name: 'menuItemBg',
								img: 'blockBlue',
								x: 0,
								y: 0,
								attrs: {
									width: gameW,
									height: (gameUnit * 3),
									alpha: 0.33
								}
							},
							icon: {
								type: 'sprite',
								name: 'menuItemIcon',
								img: 'iconFactory',
								x: gameUnit * 2,
								y: gameUnit * 6,
								attrs: {
									width: gameUnit * 6,
									height: gameUnit * 3
								}
							},
							title: {
								type: 'text',
								name: 'factoryTitle',
								text: 'Add New Factory?',
								x: 0,
								y: gameUnit * 3,
								style: {
									font: (fontSizes.lg + 'px Arial'),
									fill: palette.black
								},
								position: {
									centerX: true
								}
							},
							cost: {
								type: 'text',
								name: 'menuItemCost',
								text: 'Cost: $' + gameData.buildings.factory.cost,
								x: 0,
								y: gameUnit * 10,
								style: {
								    font: (fontSizes.md + 'px Arial'),
							        fill: palette.black
								},
								position: {
									centerX: true
								}
							},
							invisButton: {
								type: 'sprite',
								name: 'menuItemInvisBtn',
								img: 'blockClear',
								partId: -1,
								x: 0,
								y: 0,
								attrs: {
									width: gameW,
									height: (gameUnit * 3),
									alpha: 0.33
								},
								input: gameLogic.global.input.buildingSelectionIcon
							}
						}
					}
				}
			},
			buildingSelectionIcon: {
				type: 'sprite',
				name: '',
				x: 0,
				y: 0,
				offset: (gameUnit * 3),
				iconH: (gameUnit * 3),
				views: {
					bg: {
						type: 'sprite',
						name: 'menuItemBg',
						img: 'blockBlue',
						x: 0,
						y: 0,
						attrs: {
							width: gameW,
							height: (gameUnit * 3),
							alpha: 0.33
						}
					},
					icon: {
						type: 'sprite',
						name: 'menuItemIcon',
						img: '',
						x: gameUnit,
						y: gameUnit * 0.5,
						attrs: {
							width: gameUnit * 4,
							height: gameUnit * 2
						}
					},
					description: {
						type: 'text',
						name: 'menuItemDescription',
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
						name: 'menuItemCost',
						text: '',
						x: gameUnit * 3,
						y: gameUnit * 1,
						style: {
						    font: (fontSizes.sm + 'px Arial'),
					        fill: palette.black
						}
					},
					invisButton: {
						type: 'sprite',
						name: 'menuItemInvisBtn',
						img: 'blockClear',
						partId: -1,
						x: 0,
						y: 0,
						attrs: {
							width: gameW,
							height: (gameUnit * 3),
							alpha: 0.33
						},
						input: gameLogic.global.input.buildingSelectionIcon
					}
				}
			},
			buildingEditDetails: {
				type: 'group',
				name: 'editDetails',
				views: {
					name: {
						type: 'text',
						name: 'factoryName',
						text: 'Name: ',
						x: gameUnit * 1.5,
						y: gameUnit * 5,
						style: {
							font: (fontSizes.md + 'px Arial'),
							fill: palette.black
						}
					},
					age: {
						type: 'text',
						name: 'factoryAge',
						text: 'Age: ',
						x: gameUnit * 1.5,
						y: gameUnit * 6.5,
						style: {
							font: (fontSizes.md + 'px Arial'),
							fill: palette.black
						}
					},
					status: {
						type: 'text',
						name: 'factorySatus',
						text: 'Status: ',
						x: gameUnit * 1.5,
						y: gameUnit * 8,
						style: {
							font: (fontSizes.md + 'px Arial'),
							fill: palette.black
						}
					}
				}
			},
			machineList: {
				type: 'group',
				name: 'machineList',
				views: {}
			},	
			machineIcon: {
				type: 'group',
				name: 'machineIcon',
				offsetY: (gameUnit * 3.5),
				offsetX: 0,
				iconW: (gameUnit * 5),
				iconH: (gameUnit * 5),
				views: {
					bg: {
						type: 'sprite',
						name: 'machineIconBg',
						img: 'machineListIcon',
						x: 0,
						y: 0,
						attrs: {
							width: (gameUnit * 5),
							height: (gameUnit * 5)
						}
					},
					name: {
						type: 'text',
						name: 'name',
						text: '',
						x: (gameUnit * 0.9),
						y: gameUnit * 4.2,
						style: {
						    font: (fontSizes.sm + 'px Arial'),
					        fill: palette.lightRed,
							'text-align': 'center'
						}
					},
					cost: {
						type: 'text',
						name: 'machineCost',
						text: '$',
						x: gameUnit * 0.25,
						y: gameUnit * 1.1,
						style: {
						    font: (fontSizes.xs + 'px Arial'),
					        fill: palette.black
						},
						attrs: {
							angle: -45
						}
					},
					sell: {
						type: 'text',
						name: 'sell',
						text: '',
						x: gameUnit * 4,
						y: gameUnit * 0.6,
						style: {
						    font: (fontSizes.xs + 'px Arial'),
					        fill: palette.black
						}
					},
					invisButton: {
						type: 'sprite',
						name: 'machineIconInvisButton',
						img: 'blockClear',
						machineIdx: '',
						x: 0,
						y: 0,
						attrs: {
							width: (gameUnit * 5),
							height: (gameUnit * 5)
						},
						input: gameLogic.global.input.editMachine
					}
				}
			},
			partsMenu: {
				type: 'group',
				name: 'partsMenu',
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
						name: 'closeButton',
						img: 'buttonClose',
						x: (gameW - gameUnit * 1.25),
						y: (gameUnit * 0.25),
						attrs: {
							width: gameUnit * 1,
							height: gameUnit * 1
						},
						callback: gameLogic.global.buttonCallbacks.partsMenuClose,
						context: this,
						frames: [0, 1, 1, 0]
					},
					items: {
						type: 'group',
						name: 'itemsGroup',
						views: {}
					}
				}
			},
			partSelectionIcon: {
				type: 'group',
				name: 'partSelectionIcon',
				offset: (gameUnit * 3),
				iconH: (gameUnit * 2.5),
				views: {
					bg: {
						type: 'sprite',
						name: 'menuItemBg',
						img: 'blockBlue',
						x: 0,
						y: 0,
						attrs: {
							width: gameW,
							height: (gameUnit * 2),
							alpha: 0.33
						},
						input: gameLogic.global.input.partSelectionIcon
					},
					icon: {
						type: 'sprite',
						name: 'menuItemIcon',
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
						name: 'menuItemDescription',
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
						name: 'menuItemCost',
						text: '',
						x: gameUnit * 3,
						y: gameUnit * 1,
						style: {
						    font: (fontSizes.sm + 'px Arial'),
					        fill: palette.black
						}
					},
					invisButton: {
						type: 'sprite',
						name: 'menuItemInvisBtn',
						img: 'blockClear',
						partId: -1,
						x: 0,
						y: 0,
						attrs: {
							width: gameW,
							height: (gameUnit * 2),
							alpha: 0.33
						},
						input: gameLogic.global.input.partSelectionIcon
					}
					
				}
			}
		};

		var equipmentCreateImages = {
			wheels: {
				x: (gameUnit * 1),
				y: (gameUnit * 5.5),
				width: gameUnit * 8,
				height: gameUnit * 8
			},
			engine: {
				x: (gameUnit * 2.5),
				y: (gameUnit * 6.9),
				width: gameUnit * 4.25,
				height: gameUnit * 4.25
			},
			cab: {
				x: (gameUnit * 4.5),
				y: (gameUnit * 5.25),
				width: gameUnit * 3,
				height: gameUnit * 3
			}
		};

		var config = {
			gameEl: 'game_container',
			gameType: 'phaser',
			// assets
			assets: {
				images: {
					dashboard: 'images/screens/screen_mocks_dashboard.gif',
					startBg: 'images/screens/screen_mocks_start.gif',
					manualBg: 'images/screens/screen_mocks_manual.gif',
					briefBg: 'images/screens/screen_mocks_brief.gif',
					usDetailBg: 'images/screens/screen_mocks_us.gif',
					worldBg: 'images/screens/screen_mocks_world.gif',
					equipmentListBg: 'images/screens/screen_mocks_inventory.gif',
					buildBg: 'images/screens/screen_mocks_build.gif',
					equipmentCreateBg: 'images/screens/screen_mocks_machine_picker.gif',
					equipmentEditBg: 'images/screens/screen_mocks_equipment_editor.gif',
					machineListIcon: 'images/machine_list_icon.gif',
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
					buttonEquipment: 'images/button_equipment.gif',
					buttonEquipmentSave: 'images/button_red_check.gif',
					// parts icons
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
					headlights3: 'images/parts_icons/headlights3.gif',
					// parts
					wheelsGrey: 'images/parts/wheels_grey.gif',
					wheelsGreen: 'images/parts/wheels_green.gif',
					wheelsOrange: 'images/parts/wheels_orange.gif',
					wheelsRed: 'images/parts/wheels_red.gif',
					engineGrey: 'images/parts/engine_grey.gif',
					engineGreen: 'images/parts/engine_green.gif',
					engineOrange: 'images/parts/engine_orange.gif',
					engineRed: 'images/parts/engine_red.gif',
					cabGrey: 'images/parts/cab_grey.gif',
					cabGreen: 'images/parts/cab_green.gif',
					cabOrange: 'images/parts/cab_orange.gif',
					cabRed: 'images/parts/cab_red.gif'
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
					},
					buttonCheck: {
						url: 'images/controls/check.png',
						width: 50,
						height: 50,
						frames: 2
					},
					buttonCancel: {
						url: 'images/controls/cancel.png',
						width: 50,
						height: 50,
						frames: 2
					},
					usDetailTiles: {
						url: 'images/us_detail_tiles.png',
						width: 64,
						height: 64,
						frames: 8
					},
					wheelsSprites: {
						url: 'images/parts/wheels_spritesheet.gif',
						width: 125,
						height: 125,
						frames: 16
					},
					engineSprites: {
						url: 'images/parts/engine_spritesheet.gif',
						width: 100,
						height: 100,
						frames: 16
					},
					cabSprites: {
						url: 'images/parts/cab_spritesheet.gif',
						width: 100,
						height: 100,
						frames: 16
					}
				},
				tilemaps: {
					greyTilesMap: 'data/factory_world.json'
				}
			},
			stage: {
				fullScreen: true,
				scaleMode: Phaser.ScaleManager.SHOW_ALL
			},
			attrs: {
				firstPlay: false,
				turnActive: false,
				turnTime: TIME_PER_TURN,
				activeSector: -1,
				activeTile: null,
				activeFactor: null,
				activeMachine: null,
				activeMachineId: -1,
				activePartType: '',
				newMachine: false,
				bank: 1000000,
			},
			defaultScreen: 'play',
			dynamicViews: dynamicViews,
			views: {
				// start
				startScreen: {
					name: 'start',
					type: 'group',
					attrs: {
						visible: false
					},
					views: {
						// bg
						stateBg: {
							type: 'sprite',
							name: 'startBg',
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
							name: 'gameStartButton',
							img: 'blockWhite',
							x: (gameW/2 - (gameUnit * 2.5)),
							y: (gameUnit * 2.5),
							attrs: {
								width: (gameUnit * 5),
								height: (gameUnit * 5),
								alpha: 0.5
							},
							callback: gameLogic.global.buttonCallbacks.playStart,
							context: this,
							frames: [0, 1, 1, 0]
						},
						// manual button
						manualButton: {
							type: 'button',
							name: 'manualbutton',
							img: 'blockClear',
							x: 0,
							y: (gameH - gameUnit * 2.5),
							attrs: {
								width: gameUnit * 2.5,
								height: gameUnit * 2.5,
								alpha: 0.75
							},
							callback: gameLogic.global.buttonCallbacks.manualStart,
							context: this,
							frames: [0, 1, 1, 0]
						}
					}
				},
				// manual
				manualScreen: {
					name: 'manual',
					type: 'group',
					attrs: {
						visible: false
					},
					views: {
						stateBg: {
							type: 'sprite',
							name: 'manualBg',
							img: 'manualBg',
							x: 0,
							y: 0,
							attrs: {
								width: gameW,
								height: gameH
							}
						}
					}
				},
				// play
				playScreen: {
					name: 'play',
					type: 'group',
					attrs: {
						visible: false
					},
					views: {
						// bg
						stateBg: {
							type: 'sprite',
							name: 'playBg',
							img: 'worldBg',
							x: 0,
							y: 0,
							attrs: {
								width: gameW,
								height: gameH,
								fixedToCamera: true
							}
						},
						// buttons group
						buttons: {
							type: 'group',
							name: 'startStateButtons',
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
										height: gameUnit
									},
									input: gameLogic.global.input.plusButton
								},
								minusButton: {
									type: 'sprite',
									name: 'minusButton',
									img: 'buttonMinus',
									x: gameUnit * 0.2,
									y: gameUnit * 5.2,
									attrs: {
										width: gameUnit,
										height: gameUnit
									},
									input: gameLogic.global.input.minusButton
								},
								northwestDetail: {
									type: 'button',
									name: 'northwestDetail',
									img: 'blockBlue',
									x: gameUnit * 1.5,
									y: (gameUnit * 7),
									attrs: {
										width: (gameUnit * 2.5),
										height: (gameUnit * 1.5),
										alpha: 0.5
									},
									callback: gameLogic.global.buttonCallbacks.northwestDetail,
									context: this,
									frames: [0, 0, 0, 0]
								},
								southwestDetail: {
									type: 'button',
									name: 'southwestDetail',
									img: 'blockGreen',
									x: gameUnit * 1.5,
									y: (gameUnit * 8.5),
									attrs: {
										width: (gameUnit * 2.5),
										height: (gameUnit * 1.5),
										alpha: 0.5
									},
									callback: gameLogic.global.buttonCallbacks.southwestDetail,
									context: this,
									frames: [0, 0, 0, 0]
								},
								midwestDetail: {
									type: 'button',
									name: 'midwestDetail',
									img: 'blockRed',
									x: gameUnit * 4,
									y: (gameUnit * 7),
									attrs: {
										width: (gameUnit * 3),
										height: (gameUnit * 3),
										alpha: 0.5
									},
									callback: gameLogic.global.buttonCallbacks.midwestDetail,
									context: this,
									frames: [0, 0, 0, 0]
								},
								northeastDetail: {
									type: 'button',
									name: 'northeastDetail',
									img: 'blockWhite',
									x: gameUnit * 7,
									y: (gameUnit * 7),
									attrs: {
										width: (gameUnit * 2.5),
										height: (gameUnit * 1.5),
										alpha: 0.5
									},
									sector: usSectors.NORTH_EAST,
									callback: gameLogic.global.buttonCallbacks.northeastDetail,
									context: this,
									frames: [0, 0, 0, 0]
								},
								southeastDetail: {
									type: 'button',
									name: 'southeastDetail',
									img: 'blockBlue',
									x: gameUnit * 7,
									y: (gameUnit * 8.5),
									attrs: {
										width: (gameUnit * 2.5),
										height: (gameUnit * 1.5),
										alpha: 0.5
									},
									callback: gameLogic.global.buttonCallbacks.southeastDetail,
									context: this,
									frames: [0, 0, 0, 0]
								}
							}
						}
					}
				},
				// usDetail
				usDetailScreen: {
					name: 'usDetail',
					type: 'group',
					attrs: {
						visible: false
					},
					views: {
						// bg
						stateBg: {
							type: 'sprite',
							name: 'usBg',
							img: 'usDetailBg',
							x: 0,
							y: 0,
							attrs: {
								width: gameW,
								height: gameH,
								fixedToCamera: true
							}
						},
						sectorTitle: {
							type: 'text',
							name: 'sectorTitle',
							text: '',
							x: 0,
							y: gameUnit * 2,
							style: {
							    font: (fontSizes.lg + 'px Arial'),
						        fill: palette.white
							},
							position: {
								centerX: true
							}
						}
					}
				},
				// building edit 
				buildingEditScreen: {
					name: 'buildingEdit',
					type: 'group',
					attrs: {
						visible: false
					},
					views: {
						// bg
						bg: {
							type: 'sprite',
							name: 'background',
							img: 'equipmentListBg',
							x: 0,
							y: 0,
							attrs: {
								width: gameW,
								height: gameH,
								fixedToCamera: true
							}
						},
						title: {
							type: 'text',
							name: 'editTitle',
							text: 'Factory Details',
							x: 0,
							y: gameUnit * 3,
							style: {
								font: (fontSizes.lg + 'px Arial'),
								fill: palette.black
							},
							position: {
								centerX: true
							}
						}
					}
				},
				// equipment list
				equipmentListScreen: {
					name: 'equipmentList',
					type: 'group',
					attrs: {
						visible: false
					},
					views: {
						// bg
						bg: 
						{
							type: 'sprite',
							name: 'background',
							img: 'equipmentListBg',
							x: 0,
							y: 0,
							attrs: {
								width: gameW,
								height: gameH,
								fixedToCamera: true
							}
						},
						// buttons group
						buttons: {
							type: 'group',
							name: 'equipmentListScreenButtonGroup',
							attrs: {
								fixedToCamera: true
							},
							views: 
							// close button
							{
								closeButton: {
									type: 'button',
									name: 'closeButton',
									img: 'buttonClose',
									x: (gameW - gameUnit * 1.25),
									y: (gameUnit * 0.25),
									attrs: {
										width: gameUnit * 1,
										height: gameUnit * 1
									},
									callback: gameLogic.global.buttonCallbacks.equipmentListClose,
									context: this,
									frames: [0, 1, 1, 0]
								}
							}
						},
						// icons group
						// icons: {
						// 	type: 'group',
						// 	name: 'equipmentListScreenIconGroup',
						// 	attrs: {
						// 		fixedToCamera: true
						// 	},
						// 	views: 
						// 	{
						// 		tractorIcon: {
						// 			type: 'sprite',
						// 			name: 'tractor',
						// 			img: 'iconTractor',
						// 			x: gameUnit * 3,
						// 			y: gameUnit * 7,
						// 			attrs: {
						// 				width: gameUnit * 4,
						// 				height: gameUnit * 2
						// 			},
						// 			input: gameLogic.global.input.tractor
						// 		},
						// 		skidsteerIcon: {
						// 			type: 'sprite',
						// 			name: 'skidsteer',
						// 			img: 'iconSkidsteer',
						// 			x: gameUnit * 3,
						// 			y: gameUnit * 11,
						// 			attrs: {
						// 				width: gameUnit * 4,
						// 				height: gameUnit * 2
						// 			},
						// 			input: gameLogic.global.input.skidsteer
						// 		}
						// 	}
						// }
					}
				},
				// equipment create
				equipmentCreateScreen: {
					name: 'equipmentCreate',
					type: 'group',
					attrs: {
						visible: false
					},
					views: {
						bg: {
							type: 'sprite',
							name: 'createBg',
							img: 'equipmentCreateBg',
							x: 0,
							y: 0,
							attrs: {
								width: gameW,
								height: gameH
							}
						},
						icons: {
							type: 'group',
							name: 'createIcons',
							views: {
								machineType: {
									type: 'group',
									name: 'machineType',
									views: {
										tractor: {
											type: 'sprite',
											name: 'newTractor',
											img: 'blockWhite',
											x: gameUnit * 0.5,
											y: gameUnit * 4,
											attrs: {
												width: gameUnit * 3,
												height: gameUnit * 3,
												alpha: 0.3
											},
											input: gameLogic.global.input.newTractor
										},
										skidsteer: {
											type: 'sprite',
											name: 'newSkidsteer',
											img: 'blockWhite',
											x: gameW - (gameUnit * 3.5),
											y: gameUnit * 9,
											attrs: {
												width: gameUnit * 3,
												height: gameUnit * 3,
												alpha: 0.3
											},
											input: gameLogic.global.input.newSkidsteer
										}
									}
								},
								tractorSize: {
									type: 'group',
									name: 'tractorSize',
									attrs: {
										visible: false
									},
									views: {
										basic: {
											type: 'sprite',
											name: 'basicSize',
											img: 'blockBlue',
											x: gameUnit * 5.5,
											y: gameUnit * 3.8,
											attrs: {
												width: gameUnit * 4,
												height: gameUnit * 1,
												alpha: 0.5
											},
											input: gameLogic.global.input.basicSize
										},
										medium: {
											type: 'sprite',
											name: 'mediumSize',
											img: 'blockGreen',
											x: gameUnit * 5.5,
											y: gameUnit * 5,
											attrs: {
												width: gameUnit * 4,
												height: gameUnit * 1,
												alpha: 0.5
											},
											input: gameLogic.global.input.mediumSize
										},
										heavy: {
											type: 'sprite',
											name: 'heavySize',
											img: 'blockRed',
											x: gameUnit * 5.5,
											y: gameUnit * 6.3,
											attrs: {
												width: gameUnit * 4,
												height: gameUnit * 1,
												alpha: 0.5
											},
											input: gameLogic.global.input.heavySize
										}
									}
								},
								skidsteerSize: {
									type: 'group',
									name: 'skidsteerSize',
									attrs: {
										visible: false
									},
									views: {
										basic: {
											type: 'sprite',
											name: 'basicSize',
											img: 'blockBlue',
											x: gameUnit * 0.25,
											y: gameUnit * 8.8,
											attrs: {
												width: gameUnit * 4,
												height: gameUnit * 1,
												alpha: 0.5
											},
											input: gameLogic.global.input.basicSize
										},
										medium: {
											type: 'sprite',
											name: 'mediumSize',
											img: 'blockGreen',
											x: gameUnit * 0.25,
											y: gameUnit * 10,
											attrs: {
												width: gameUnit * 4,
												height: gameUnit * 1,
												alpha: 0.5
											},
											input: gameLogic.global.input.mediumSize
										},
										heavy: {
											type: 'sprite',
											name: 'heavySize',
											img: 'blockRed',
											x: gameUnit * 0.25,
											y: gameUnit * 11.2,
											attrs: {
												width: gameUnit * 4,
												height: gameUnit * 1,
												alpha: 0.5
											},
											input: gameLogic.global.input.heavySize
										}
									}
								}
							}
						}
					}
				},
				// equipment edit
				equipmentEditScreen: {
					type: 'group',
					name: 'equipmentEdit',
					attrs: {
						visible: false
					},
					views: {
						// bg
						bg: {
							type: 'sprite',
							name: 'editorBg',
							img: 'equipmentEditBg',
							x: 0,
							y: 0,
							attrs: {
								width: gameW,
								height: gameH
							}
						},
						// parts group
						parts: {
							type: 'group',
							name: 'editorParts',
							views: 
							{
								wheelsPart: {
									type: 'sprite',
									name: 'wheelsPart',
									img: 'wheelsSprites',
									x: equipmentCreateImages.wheels.x,
									y: equipmentCreateImages.wheels.y,
									attrs: {
										width: equipmentCreateImages.wheels.width,
										height: equipmentCreateImages.wheels.height,
										frame: 0
									},
									input: gameLogic.global.input.wheelIcon
								},
								enginePart: {
									type: 'sprite',
									name: 'enginePart',
									img: 'engineSprites',
									x: equipmentCreateImages.engine.x,
									y: equipmentCreateImages.engine.y,
									attrs: {
										width: equipmentCreateImages.engine.width,
										height: equipmentCreateImages.engine.height,
										frame: 0
									},
									input: gameLogic.global.input.engineIcon
								},
								cabIcon: {
									type: 'sprite',
									name: 'cabPart',
									img: 'cabSprites',
									x: equipmentCreateImages.cab.x,
									y: equipmentCreateImages.cab.y,
									attrs: {
										width: equipmentCreateImages.cab.width,
										height: equipmentCreateImages.cab.height,
										frame: 0
									},
									input: gameLogic.global.input.cabIcon
								}
							}
						}
					}
				},
				// global
				global: {
					type: 'group',
					name: 'global',
					attrs: {
						visible: false
					},
					views: {
						dashboardBg: {
							name: 'dashboardBg',
							type: 'sprite',
							img: 'dashboard',
							x: 0,
							y: 0,
							attrs: {
								width: gameW,
								height: gameH,
								fixedToCamera: true
							},
						},
						turnGroup: {
							type: 'group',
							name: 'turnGroup',
							views: {
								timerText: {
									type: 'text',
									name: 'timerText',
									text: TIME_PER_TURN,
									style: {
									    font: (fontSizes.lg + 'px Arial'),
								        fill: palette.orange1
									},
									x: 0,
									y: (gameUnit * 0.33),
									position: {
										centerX: true
									}
								},
								bankText: {
									type: 'text',
									name: 'bankText',
									text: '',
									style: {
									    font: (fontSizes.md + 'px Arial'),
								        fill: palette.orange1
									},
									x: (gameUnit * 0.5),
									y: (gameUnit * 0.33)
								},
								equipmentButton: {
									type: 'button',
									name: 'equipmentButton',
									img: 'buttonEquipment',
									x: gameUnit * 8,
									y: (gameH - gameUnit * 2),
									attrs: {
										width: (gameUnit * 2),
										height: (gameUnit * 2),
										visible: false
									},
									callback: gameLogic.global.buttonCallbacks.equipmentListStart,
									context: this,
									frames: [0, 0, 0, 0]
								},
								addEquipmentButton: {
									type: 'button',
									name: 'addEquipment',
									img: 'buttonPlus',
									x: (gameW/2 - gameUnit/2),
									y: (gameH - gameUnit * 1.25),
									attrs: {
										width: (gameUnit),
										height: (gameUnit),
										visible: false
									},
									callback: gameLogic.global.buttonCallbacks.addEquipment,
									context: this,
									frames: [0, 0, 0, 0]
								},
								saveMachineButton: {
									type: 'button',
									name: 'saveMachineButton',
									img: 'buttonEquipmentSave',
									x: gameUnit * 8,
									y: (gameH - gameUnit * 2),
									attrs: {
										width: (gameUnit * 2),
										height: (gameUnit * 2),
										visible: false
									},
									callback: gameLogic.global.buttonCallbacks.saveMachine,
									context: this,
									frames: [0, 0, 0, 0]
								},
								closeButton: {
									type: 'button',
									name: 'closeButton',
									img: 'buttonClose',
									x: gameUnit * 0.5,
									y: gameH - (gameUnit * 1.5),
									attrs: {
										width: gameUnit * 1,
										height: gameUnit * 1
									},
									callback: gameLogic.global.buttonCallbacks.closeButton,
									context: this,
									frames: [0, 1, 1, 0]
								}
							}
						}
					}
				}
			}
		};
		callback.call(context, config);
	};
	return module;
}();