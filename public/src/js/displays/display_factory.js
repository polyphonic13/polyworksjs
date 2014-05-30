pwg.DisplayFactory = (function() {
	var module = {};
	
	module.createPhaserViews = function(views) {
		// trace('DisplayFactory/createPhaserViews, views = ', views);
		var collection = {};
		
		pwg.Utils.each(views,
			function(view) {
				// trace('\tview.type = ' + view.type);
				collection[view.name] = new pwg.PhaserView.ViewController(view);
			},
			this
		);
		
		return collection;
	};
	
	return module;
}());