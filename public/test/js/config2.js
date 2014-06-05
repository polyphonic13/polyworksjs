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
			xs: (gameUnit * 0.5),
			sm: (gameUnit * 0.6),
			md: (gameUnit * 0.75),
			lg: (gameUnit * 1.0),
			xl: (gameUnit * 1.5)
		};
		var palette = {
			darkRed: '#ba1d3a',
			lightRed: '#e21a49',
			orange: '#fca600',
			green: '#009b1d',
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
						},
						input: gameLogic.sharedViews.overlayMenuItem.invisButton.input
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
					},
					invisButton: {
						type: 'sprite',
						name: 'menu-item-invis-btn',
						img: 'blockClear',
						partId: -1,
						x: 0,
						y: 0,
						attrs: {
							width: gameW,
							height: (gameUnit * 2),
							alpha: 0.33
						},
						input: gameLogic.sharedViews.overlayMenuItem.invisButton.input
					}
					
				}
			}
		};

		var equipmentEditorImages = {
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
					buildBg: 'images/screens/screen_mocks_build.gif',
					equipmentPickerBg: 'images/screens/screen_mocks_tractor_picker.gif',
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
				turnActive: false,
				turnTime: TIME_PER_TURN,
				equipmentAction: '',
				activeMachineId: -1,
				bank: 1000000,
				sharedViews: sharedViews
			},
			defaultGroup: 'play',
			views: {
				// start
				startGroup: {
					name: 'start',
					type: 'group',
					attrs: {
						visible: false
					},
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
								PWG.EventCenter.trigger({ type: PWG.Events.SHOW_GROUP, value: 'manual' });
							},
							context: this,
							frames: [0, 1, 1, 0]
						}
					}
				},
				// manual
				manualGroup: {
					name: 'manual',
					type: 'group',
					attrs: {
						visible: false
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
								PWG.EventCenter.trigger({ type: PWG.Events.SHOW_GROUP, value: 'start' });
							},
							context: this,
							frames: [0, 1, 1, 0]
						}
					}
				},
				// play
				playGroup: {
					name: 'play',
					type: 'group',
					attrs: {
						visible: false
					},
					views: {
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
								usDetailButton: {
									type: 'button',
									name: 'start-build-button',
									img: 'blockWhite',
									x: gameUnit,
									y: (gameUnit * 7),
									attrs: {
										width: gameW - (gameUnit * 2),
										height: (gameUnit * 3),
										alpha: 0.3
									},
									callback: gameLogic.states.play.views.buttons.usDetailButton.callback,
									context: this,
									frames: [0, 0, 0, 0]
								}
							}
						}
					}
				},
				// usDetail
				usDetailGroup: {
					name: 'usDetail',
					type: 'group',
					attrs: {
						visible: false
					},
					views: {
						// bg
						stateBg: {
							type: 'sprite',
							name: 'us-background',
							img: 'usDetailBg',
							x: 0,
							y: 0,
							attrs: {
								width: gameW,
								height: gameH,
								fixedToCamera: true
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
									input: gameLogic.states.usDetail.views.icons.input
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
									input: gameLogic.states.usDetail.views.icons.input
								}
							}
						}
					}
				},
				// equipment
				equipmentGroup: {
					name: 'equipment',
					type: 'group',
					attrs: {
						visible: false
					},
					views: 
					{
						// bg
						bg: 
						{
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
						}
					}
				},
				// equipment editor
				equipmentEditorGroup: {
					name: 'equipmentEditor',
					type: 'group',
					attrs: {
						visible: false
					},
					views: {
						editor: {
							type: 'group',
							name: 'editor-group',
							attrs: 
							{
								visible: false
							},
							views: 
							{
								// bg
								bg: 
								{
									type: 'sprite',
									name: 'editor-bg',
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
									name: 'editor-text',
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
											x: gameUnit,
											y: (gameUnit * 2),
											position: {
												centerX: true
											}
										},
										cab: {
											type: 'text',
											name: 'equipment-wheels',
											text: 'cabs',
											style: {
											    font: (fontSizes.sm + 'px Arial'),
										        fill: palette.darkRed
											},
											x: gameUnit,
											y: (gameUnit * 7)
										}

									}
								},
								// buttons group
								buttons: {
									type: 'group',
									name: 'editor-buttons',
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
											callback: gameLogic.states.equipmentEditor.views.editor.buttons.closeButton.callback,
											context: this,
											frames: [0, 1, 1, 0]
										},
										saveButton: {
											type: 'button',
											name: 'save-button',
											img: 'blockGreen',
											x: (gameUnit * 5),
											y: (gameH - (gameUnit * 2)),
											attrs: {
												width: gameUnit * 4,
												height: gameUnit * 3,
												alpha: 0.5
											},
											callback: gameLogic.states.equipmentEditor.views.editor.buttons.saveButton.callback,
											context: this,
											frames: [0, 0, 0, 0]
										}
									}
								},
								// parts group
								parts: {
									type: 'group',
									name: 'editor-parts',
									views: 
									{
										wheelsPart: {
											type: 'sprite',
											name: 'wheels-part',
											img: 'wheelsSprites',
											x: equipmentEditorImages.wheels.x,
											y: equipmentEditorImages.wheels.y,
											attrs: {
												width: equipmentEditorImages.wheels.width,
												height: equipmentEditorImages.wheels.height,
												frame: 0
											},
											input: gameLogic.states.equipmentEditor.views.editor.icons.wheelIcon.input
										},
										enginePart: {
											type: 'sprite',
											name: 'engine-part',
											img: 'engineSprites',
											x: equipmentEditorImages.engine.x,
											y: equipmentEditorImages.engine.y,
											attrs: {
												width: equipmentEditorImages.engine.width,
												height: equipmentEditorImages.engine.height,
												frame: 0
											},
											input: gameLogic.states.equipmentEditor.views.editor.icons.engineIcon.input
										},
										cabIcon: {
											type: 'sprite',
											name: 'cab-part',
											img: 'cabSprites',
											x: equipmentEditorImages.cab.x,
											y: equipmentEditorImages.cab.y,
											attrs: {
												width: equipmentEditorImages.cab.width,
												height: equipmentEditorImages.cab.height,
												frame: 0
											},
											input: gameLogic.states.equipmentEditor.views.editor.icons.cabIcon.input
										}
									}
								}
							}
						},
						machineSize: {
							type: 'group',
							name: 'create-group',
							attrs: {
								visible: false
							},
							views: {
								bg: {
									type: 'sprite',
									name: 'create-bg',
									img: 'equipmentPickerBg',
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
											input: gameLogic.states.equipmentEditor.views.machineSize.icons.createBasic.input
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
											input: gameLogic.states.equipmentEditor.views.machineSize.icons.createMedium.input
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
											input: gameLogic.states.equipmentEditor.views.machineSize.icons.createHeavy.input
										}
									}
								}
							}
						}
					}
				},
				// global
				global: {
					type: 'group',
					name: 'global',
					views: {
						dashboard: {
							name: 'dashboard',
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
						textGroup: {
							type: 'group',
							name: 'globalText',
							views: {
								timerText: {
									type: 'text',
									name: 'timerText',
									text: TIME_PER_TURN,
									style: {
									    font: (fontSizes.md + 'px Arial'),
								        fill: palette.white
									},
									x: 0,
									y: (gameUnit * 0.4),
									position: {
										centerX: true
									}
								}
							}
						},
						buttonsGroup: {
							type: 'group',
							name: 'globalButtons',
							views: {
								pauseButton: {
									type: 'button',
									name: 'pauseButton',
									img: 'buttonPause',
									x: (gameW - gameUnit * 1.75),
									y: (gameH - gameUnit * 4.75),
									attrs: {
										width: gameUnit * 1.5,
										height: gameUnit * 1.5,
										visible: false
									},
									callback: gameLogic.global.views.pauseButton.callback,
									context: this,
									frames: [0, 1, 1, 0]
								},
								resumeButton: {
									type: 'button',
									name: 'resumeButton',
									img: 'buttonPlay',
									x: (gameW - gameUnit * 1.75),
									y: (gameH - gameUnit * 4.75),
									attrs: {
										width: gameUnit * 1.5,
										height: gameUnit * 1.5,
										visible: false
									},
									callback: gameLogic.global.views.resumeButton.callback,
									context: this,
									frames: [0, 1, 1, 0]
								},
								equipmentButton: {
									type: 'button',
									name: 'equipmentButton',
									img: 'blockWhite',
									x: gameUnit * 7.5,
									y: (gameH - gameUnit * 2.5),
									attrs: {
										width: (gameUnit * 2.5),
										height: (gameUnit * 2.5),
										alpha: 0.3
									},
									callback: gameLogic.states.play.views.buttons.equipmentButton.callback,
									context: this,
									frames: [0, 0, 0, 0]
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