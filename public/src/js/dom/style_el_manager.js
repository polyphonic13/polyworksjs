var PWG = PWG || {};
PWG.StyleElManager = function() {
	var module = {};

	var _head = document.getElementsByTagName('head')[0];
	var _previousOrientation = '';
	var _styleEls = {};
	
	module.create = function(styleStrings) {
		PWG.Utils.each(
			styleStrings,
			function(style, key) {
				module.add(style, key);
			},
			module
		);
	};
	
	module.add = function(styleString, key) {
		var styleEl = document.createElement('style');
		styleEl.setAttribute('id', key);
		styleEl.appendChild(document.createTextNode(styleString));
		
		_styleEls[key] = styleEl;
	};
	
	module.update = function() {
		if(PWG.WindowParams.isOrientationChanged) {
			var orientation = PWG.WindowParams.orientation;
			if(_previousOrientation !== '') {
				_styleEls[_previousOrientation].parentNode.removeChild(_styleEls[_previousOrientation]);
			}

			_head.appendChild(_styleEls[orientation]);
			_previousOrientation = orientation;
		}
	};
	
	module.replace = function(styleString, key) {
		if(_styleEls.hasOwnProperty(key)) {
			_styleEls[key].parentNode.removeChild(_styleEls[key]);
			delete _styleEls[key];
		}
		module.add(styleString, key);
	};
	
	return module;
}();