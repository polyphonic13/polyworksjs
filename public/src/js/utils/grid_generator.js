Polyworks.GridGenerator = (function() {
	var module = {};
	
	module.createSquare = function(cells, dimension) {
		return module.createRectangle(cells, cells, dimension, dimension);
	};
	
	module.createRectangle = function(xLength, yLength, xDimension, yDimension) {
		// trace('--------------- createRectangle\n\txLength = ' + xLength + '\n\tyLength = ' + yLength + '\n\txDimension = ' + xDimension + '\n\tyDimension = ' + yDimension);
		var grid = [];
		var cell;

		for(var x = 0; x < xLength; x++) {
			for(var y = 0; y < yLength; y++) {
				cell = {
					start:{
						x: (x * xDimension),
						y: (y * yDimension)
					},
					center: {
						x: ((x + 1) * xDimension) - (xDimension/2),
						y: ((y + 1) * yDimension) - (yDimension/2)
					},
					end: {
						x: ((x + 1) * xDimension),
						y: ((y + 1) * yDimension)
					}
				};
				grid.push(cell);
			}
		}
		// trace('grid generator returning: ', grid);
		return grid;
	};
	
	return module;
}());