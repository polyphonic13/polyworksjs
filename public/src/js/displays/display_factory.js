Polyworks.DisplayFactory = (function() {
	var module = {};
	
	module.createPhaserViews = function(views) {
		trace('DisplayFactory/createPhaserViews, views = ', views);
		var collection = {};
		
		Polyworks.Utils.each(views,
			function(view) {
				trace('\tview.type = ' + view.type);
				collection[view.id] = new Polyworks.PhaserView.ViewController(view);
			},
			this
		);
		
		return collection;
	};
	
	return module;
}());