var GridManager = function() {
	var module = {};

	module.grids = {};
	
	module.init = function(sectors, xCells, yCells, gridSize) {
		PWG.Utils.each(
			sectors,
			function(sector) {
				var gridCoordinates = PWG.GridGenerator.createRectangle(xCells, yCells, gridSize, gridSize);
				var grid = [];
				PWG.Utils.each(
					gridCoordinates,
					function(coordinate) {
						grid.push({
							frame: 0,
							x: coordinate.start.x,
							y: coordinate.start.y
						});
					},
					this
				);
				module.grids[sector] = grid;
			},
			this
		);
		trace('---- grid manager init complete, grids = ', module.grids);
	}
	
	module.update = function(sector, cell, value) {

	};
	
	return module;
}();