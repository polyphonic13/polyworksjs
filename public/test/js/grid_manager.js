

var GridManager = function() {
	var module = {};

	module.grids = {};
	
	module.init = function(sectors, xCells, yCells, gridSize) {
		module.initGrid(sectors, xCells, yCells, gridSize);
		module.initBuildings(BuildingManager.buildings);
	}
	
	module.initGrid = function(sectors, xCells, yCells, gridSize) {
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
	};
	
	module.initBuildings = function(buildings) {
		module.addBuildings(buildings.factory);
		module.addBuildings(buildings.showroom);
	};

	module.addBuildings = function(buildings) {
		PWG.Utils.each(
			buildings,
			function(building) {
				module.addBuilding(building);
			},
			this
		);
	};

	module.addBuilding = function(building) {
		var config = building.config;
		var frameKey = config.type.toUpperCase() + '_' + config.state.toUpperCase();
		module.grids[config.sector][config.cell].frame = tileCellFrames[frameKey];
		trace('\tsetting grid['+config.sector+']['+config.cell+'].frame to ' + tileCellFrames[frameKey]);
	};
	
	module.updateBuildingState = function(sector, cell, type, state) {
		var frameKey = type.toUpperCase() + '_' + state.toUpperCase();
		module.grids[sector][cell].frame = tileCellFrames[frameKey];
	};
	
	module.update = function(sector, cell, value) {
		
	};
	
	return module;
}();