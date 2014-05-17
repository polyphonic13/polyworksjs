var GameConfig = (function() {
	var module = {
		
	}
	
	module.init = function(callback, context) {
		var config = {
			gameType: 'phaser',
			images: {
				startBg: 'images/bg_blue.gif',
				playBg: 'images/bg_green.gif',
				gameOverBg: 'images/bg_red.gif'
			},
			sprites: {
				
			},
			screens: [
			{
				id: 'start',
				views: [{
					type: 'PhaserSprite',
					id: 'background',
					img: 'stageBg',
					x: 0,
					y: 0,
					width: Polyworks.Stage.stageW,
					height: Polyworks.Stage.stageH
				}]
			},
			{
				id: 'play',
				views: [
				{
					type: 'PhaserSprite',
					id: 'background',
					img: 'playBg',
					x: 0,
					y: 0,
					width: Polyworks.Stage.stageW,
					height: Polyworks.Stage.stageH
				}]
			},
			{
				id: 'gameOver',
				views: [
				{
					type: 'PhaserSprite',
					id: 'background',
					img: 'gameOverBg',
					x: 0,
					y: 0,
					width: Polyworks.Stage.stageW,
					height: Polyworks.Stage.stageH
				}]
			}],
			defaultScreen: 'start'
		};
		
		callback.call(context, config);
	}
	return module;
}());