PWG.PhaserPositioner = function() {
	var module = {};
	
	module.set = function(params, view) {
		// trace('PhaserPositioner/set, params = ', params);
		if(params.centerX) {
			var x = PWG.Stage.gameW/2 - view.width/2;
			view.x = x;
		} else if(params.x) {
			view.x = x;
		}
		if(params.centerY) {
			var y = PWG.Stage.gameH/2 - view.height/2;
			view.y = y;
		} else if(params.y) {
			view.y = y;
		}
	};
	
	return module; 
}();