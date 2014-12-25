var PWG = PWG || {};
PWG.WindowParams = function() {
	var module = {};
	
	var _previousOrientation = '';

	module.width = -1;
	module.height = -1;
	module.orientation = '';
	module.isOrientationChanged = false; 
	
	module.update = function() {
		module.isOrientationChanged = false;
		module.width = document.documentElement.clientWidth;
		module.height = document.documentElement.clientHeight;

		if(module.width > module.height) {
			module.orientation = 'landscape';
		} else {
			module.orientation = 'portrait';
		}
		
		if(module.orientation !== _previousOrientation) {
			module.isOrientationChanged = true;
			_previousOrientation = module.orientation;
		}
		
		return { width: module.width, height: module.height, orientation: module.orientation, isOrientationChanged: module.isOrientationChanged };
	};

	return module;
}();