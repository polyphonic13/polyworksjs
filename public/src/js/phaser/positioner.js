PWG.PhaserPositioner = function() {
	var module = {};
	
	module.set = function(params, view) {
		// trace('PhaserPositioner/set, params = ', params);
		if(params.centerX) {
			view.x = PWG.Stage.gameW/2 - view.width/2;
		} else if(params.centerToParentX) {
			view.x = (view.parent.width/2 - view.width/2) + view.parent.x;
		} else if(params.x) {
			view.x = x;
		}
		if(params.centerY) {
			view.y = PWG.Stage.gameH/2 - view.height/2;
		} else if(params.centerToParentY) {
			view.y = (view.parent.height/2 - view.height/2) + view.parent.y;
		} else if(params.y) {
			view.y = y;
		}
	};
	
	return module; 
}();