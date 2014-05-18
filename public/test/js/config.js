var GameConfig = (function() {
	var module = {
		
	}
	
	module.init = function(callback, context) {
		trace('MODULE INIT, STAGE = ', Polyworks.Stage);
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
					img: 'startBg',
					x: 0,
					y: 0,
					width: Polyworks.Stage.gameW,
					height: Polyworks.Stage.gameH,
					input: {
						inputUp: function() {
							Polyworks.EventCenter.trigger({ type: Polyworks.Events.CHANGE_STATE, value: 'play' });
						}
					}
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
					width: Polyworks.Stage.gameW,
					height: Polyworks.Stage.gameH
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
					width: Polyworks.Stage.gameW,
					height: Polyworks.Stage.gameH
				}]
			}],
			defaultScreen: 'start'
		};
		
		callback.call(context, config);
	}
	return module;
}());