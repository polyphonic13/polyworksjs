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
				var styleEl = document.createElement('style');
				styleEl.setAttribute('id', key);
				styleEl.appendChild(document.createTextNode(style));
				
				_styleEls[key] = styleEl;
			},
			module
		);
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
	
	return module;
}();