PWG.DisplayFactory = (function() {
	var module = {};
	
	module.createPhaserViews = function(views) {
		// trace('DisplayFactory/createPhaserViews, views = ', views);
		var collection = {};
		
		PWG.Utils.each(views,
			function(view) {
				// trace('\tview.type = ' + view.type);
				collection[view.name] = new PWG.PhaserView.ViewController(view);
			},
			this
		);
		
		return collection;
	};
	
	return module;
}());