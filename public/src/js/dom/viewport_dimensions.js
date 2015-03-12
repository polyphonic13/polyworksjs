var PWG = PWG || {};
PWG.ViewportDimensions = function() {
	var module = {
		initialized: false,
		vw: -1,
		vh: -1
	};
	
	module.init = function() {
		window.addEventListener('resize', module.onWindowResize);
		module.calculate();
		module.initialized = true;
	};
	
	module.calculate = function() {
		var width = document.documentElement.clientWidth;
		var height = document.documentElement.clientHeight;
		module.vw = width/100;
		module.vh = height/100;
	};
	
	module.onWindowResize = function() {
		module.calculate();
	};
	
	return module;
}();

if(!PWG.ViewportDimensions.initialized) {
	PWG.ViewportDimensions.init();
}