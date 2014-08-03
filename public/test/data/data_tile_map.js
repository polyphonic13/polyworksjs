var DataTilemap = function() {
	var module = {};

	module.init = function() {
		trace('DATA TILE MAP INIT');
		this.data = {
			background: {
				
			},
			foreground: {
				
			}
		};
	};
	
	module.getTileConfig = function(key) {
		return this.data[key];
	};
	
	return module;
}();