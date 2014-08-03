var BasicTestConfig = function() {
	var module = {};
	
	module.aspectRatio = [16, 9];
	module.maxHeight = 600;

	module.init = function(callback, context) {
		trace('BasicTestConfig/init');
		var winW = PWG.Stage.winW;
		var winH = PWG.Stage.winH;
		var gameX = PWG.Stage.gameX;
		var gameY = PWG.Stage.gameY;
		var gameW = PWG.Stage.gameW;
		var gameH = PWG.Stage.gameH;
		var unit = PWG.Stage.unit;

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
					greyTiles2: 'assets/images/grey_tiles2.gif'
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
					}
				},
				tilemaps: {
					testGreyTiles: {
						url: 'data/test_grey_tiles.json',
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
				},
				play: {
					clearWorld: true,
					clearCache: false,
					world: {
						x: 0,
						y: 0,
						width: gameW * 5,
						height: gameH
					},
					assets: {
						images: [
							'blockBlue',
							'greyTiles2'
						],
						sprites: [
							'buttonClose'
						],
						tilemaps: [
							'testGreyTiles'
						]
					},
					tilemaps: {
						grey: {
							json: 'testGreyTiles',
							image: {
								jsonName: 'grey_tiles',
								reference: 'greyTiles2'
							},
							layers: {
								background: {
									scrollFactorX: 0.33,
									scrollFactorY: 0.33
								},
								foreground: {
									scrollFactorX: 0.66,
									scrollFactorY: 0.66
								}
							}					
						}
					},
					views: {
						forestPic: sharedViews.forestPic,
						redBlock: {
							name: 'blueBg',
							type: 'sprite',
							img: 'blockBlue',
							x: winW/2 - gameW/2,
							y: winH/2 - gameH/2,
							attrs: {
								width: gameW,
								height: gameH,
								fixedToCamera: true,
								alpha: 0.33
							}
						},
						quitButton: {
							type: 'button',
							name: 'quitButton',
							img: 'buttonClose',
							x: gameX + (gameW - (unit * 1.5)),
							y: gameY + (unit * 0.5),
							attrs: {
								width: (unit * 1),
								height: (unit * 1),
								fixedToCamera: true
							},
							callback: basicTestLogic.buttonCallbacks.quit,
							context: this,
							frames: [0, 1, 1, 0]
						}
					}
				}
			}

		};

		callback.call(context, config);
	};

	return module;
}();
