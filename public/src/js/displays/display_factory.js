Polyworks.DisplayFactory = (function() {
	var module = {};
	
	module.createViews = function(views) {
		trace('DisplayFactory/createViews, views = ', views);
		var collection = {};
		
		Polyworks.Utils.each(views,
			function(view) {
				trace('\tview.type = ' + view.type);
				collection[view.id] = new Polyworks[view.type].Controller(view);
			},
			this
		);
		
		return collection;
	};
	
	return module;
}());