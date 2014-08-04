var BasicTestConfig = function() {
	var module = {};
	
	module.aspectRatio = [16, 9];
	module.maxHeight = 600;

	module.init = function(callback, context) {
		trace('BasicTestConfig/init');
		var winW = 960;
		var winH = 540;
		var gameX = 0;
		var gameY = 0;
		var gameW = 960;
		var gameH = 540;
		var unit = 60;

		var levels = [{
			terrains: {
				rockPlatforms: {
					count: (gameW * 16) / (unit * 4),
					images: [
						'rockPlatform01',
						'rockPlatform03'
					],
					offsetX: (unit * 4),
					maxY: (gameH - (unit * 1.75)),
					minY: (gameH - (unit * 4.25))
				}
			}
		}];

		var baseWorld = {
			x: 0,
			y: 0,
			width: winW,
			height: winH
		};
		var sharedViews = {
			forestPic: {
				name: 'forestPic',
				type: 'sprite',
				img: 'forestBg',
				x: 0,
				y: 0,
				attrs: {
					width: winW,
					height: winH,
					fixedToCamera: true
				}
			},
			rockPlatform: {
				type: 'sprite',
				name: 'rockPlatform',
				img: '',
				x: 0,
				y: 0,
				attrs: {
					width: 0,
					height: 0
				}
			}
		};
		var controlSizes = {
			basicButton: {
				width: unit * 1.5,
				height: unit * 1.5
			}
		};
		var groundSizes = {
			rockPlatform01: {
				width: unit * 2,
				height: unit * 1
			},
			rockPlatform03: {
				width: unit * 1.5,
				height: unit * 1.5
			}
		};

		var config = {
			gameEl: 'game_box',
			canvasW: winW,
			canvasH: winH,
			stage: {
				fullScreen: true,
				scaleMode: Phaser.ScaleManager.SHOW_ALL
			},
			assets: {
				images: {
					forestBg: 'assets/images/forest_bg01.jpg',
					blockWhite: 'assets/images/block_white.png',
					blockBlue: 'assets/images/block_blue.gif',
					blockRed: 'assets/images/block_red.gif',
					blockGreen: 'assets/images/block_green.gif',
					greyTiles2: 'assets/images/grey_tiles2.gif',
					caveBackdrop: 'assets/images/cave_backdrop.png',
					caveBackground02: 'assets/images/cave_background03.png',
					caveForeground01: 'assets/images/cave_foreground02.png',
					rockPlatform01: 'assets/images/rock_platform01.png',
					rockPlatform03: 'assets/images/rock_platform03.png'
				},
				sprites: {
					buttonGameStart: {
						url: 'assets/images/button_game_start.gif',
						width: 800,
						height: 160,
						frames: 2
					},
					buttonClose: {
						url: 'assets/images/button_close.png',
						width: 50,
						height: 50,
						frames: 2
					},
					buttonLeft: {
						url: 'assets/images/arrow_left3.png',
						width: 50,
						height: 50,
						frames: 2
					},
					buttonRight: {
						url: 'assets/images/arrow_right3.png',
						width: 50,
						height: 50,
						frames: 2
					}
					
				},
				tilemaps: {
					// testGreyTiles: {
					// 	url: 'data/test_grey_tiles.json',
					// 	type: Phaser.Tilemap.TILED_JSON
					// },
					testCave: {
						url: 'data/caves01.json',
						type: Phaser.Tilemap.TILED_JSON
					}
				}
			},
			global: {
				assets: {
					images: [
						'forestBg'
					]
				},
				views: {
				}
			},
			states: {
				home: {
					clearWorld: true,
					clearCache: false,
					world: baseWorld,
					assets: {
						images: [
							'blockWhite'
						],
						sprites: [
							'buttonGameStart'
						]
					},
					views: {
						foreground: {
							forestPic: sharedViews.forestPic,
							whiteBg: {
								name: 'whiteBg',
								type: 'sprite',
								img: 'blockWhite',
								x: winW/2 - gameW/2,
								y: winH/2 - gameH/2,
								attrs: {
									width: gameW,
									height: gameH,
									alpha: 0.5
								}
							},
							startButton: {
								type: 'button',
								name: 'gameStartButton',
								img: 'buttonGameStart',
								x: gameX + (gameW/2 - (unit * 5)/2),
								y: gameY + (gameH/2 - ((unit * 5) * 0.2)/2),
								attrs: {
									width: (unit * 5),
									height: (unit * 5) * 0.2
								},
								callback: basicTestLogic.buttonCallbacks.gameStart,
								context: this,
								frames: [0, 1, 1, 0]
							}
						}
					}
				},
				play: {
					clearWorld: true,
					clearCache: false,
					world: {
						x: 0,
						y: 0,
						width: gameW * 15,
						height: gameH
					},
					assets: {
						images: [
							'blockBlue',
							'caveBackdrop',
							'caveForeground01',
							'caveBackground02',
							'rockPlatform01',
							'rockPlatform03'
						],
						sprites: [
							'buttonClose',
							'buttonLeft',
							'buttonRight'
						],
						tilemaps: [
							'testCave'
						]
					},
					tilemaps: [{
						type: TilemapTypes.JSON,
						// json: 'testGreyTiles',
						json: 'testCave',
						tilesets: [
							'caveForeground01',
							'caveBackground02'
						],
						layers: {
							background: {
								attrs: {
									scrollFactorX: 0.15,
									scrollFactorY: 0.15
								},
								resizeWorld: true
							},
							foreground: {
								attrs: {
									scrollFactorX: 0.5,
									scrollFactorY: 0.5
								},
								resizeWorld: true
							}
						}					
					}],
					views: {
						background: {
							cave: {
								name: 'caveBackdrop',
								type: 'sprite',
								img: 'caveBackdrop',
								x: winW/2 - gameW/2,
								y: winH/2 - gameH/2,
								attrs: {
									width: gameW,
									height: gameH,
									fixedToCamera: true
								}
							}
						},
						foreground: {
							rockPlatforms: (function() {
								var platforms = {
									type: 'group',
									name: 'rockPlatforms',
									views: {}
								};
								var terrainData = levels[0].terrains.rockPlatforms;
								var count = terrainData.count;
								var images = terrainData.images;
								for(var i = 0; i < count; i++) {
									var platform = PWG.Utils.clone(sharedViews.rockPlatform);
									var rock = Math.floor(Math.random() * (terrainData.images.length));
									platform.name += i;
									platform.x = (terrainData.offsetX * i);
									platform.y = (Math.random() * (terrainData.maxY - terrainData.minY)) + terrainData.minY;
									platform.img = terrainData.images[rock];
									platform.attrs = groundSizes[terrainData.images[rock]];
									platforms.views[platform.name] = platform;
								}

								return platforms;
							}()),
							quitButton: {
								type: 'button',
								name: 'quitButton',
								img: 'buttonClose',
								x: gameX + (gameW - (unit * 1.5)),
								y: gameY + (unit * 0.5),
								attrs: {
									width: controlSizes.basicButton.width,
									height: controlSizes.basicButton.height,
									fixedToCamera: true
								},
								callback: basicTestLogic.buttonCallbacks.quit,
								context: this,
								frames: [0, 1, 1, 0]
							},
							leftButton: {
								type: 'button',
								name: 'leftButton',
								img: 'buttonLeft',
								x: (unit * 0.5),
								y: gameH - (unit * 1.5),
								attrs: {
									width: controlSizes.basicButton.width,
									height: controlSizes.basicButton.height,
									fixedToCamera: true
								},
								input: basicTestLogic.input.leftArrow,
								context: this,
								frames: [0, 1, 1, 0]
							},
							rightButton: {
								type: 'button',
								name: 'rightButton',
								img: 'buttonRight',
								x: (unit * 2.5),
								y: gameH - (unit * 1.5),
								attrs: {
									width: controlSizes.basicButton.width,
									height: controlSizes.basicButton.height,
									fixedToCamera: true
								},
								input: basicTestLogic.input.rightArrow,
								context: this,
								frames: [0, 1, 1, 0]
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
