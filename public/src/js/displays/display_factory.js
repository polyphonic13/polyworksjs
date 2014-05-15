Polyworks.DisplayFactory = (function() {
	var module = {};
	
	module.createViews = function(views) {
		var collection = [];
		
		Polyworks.Utils.each(views,
			function(view) {
				collection.push(new Polyworks[view.type](view));
			},
			this
		);
		
		return collection;
	};
	
	return module;
}());