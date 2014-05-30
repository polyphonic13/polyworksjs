var Machine = function() {
	
	var module = {};
	var defaults = {
		id: '',
		type: -1,
		size: -1,
		cost: -1,
		parts: {}
	};
	
	function Machine(config) {
		this.config = Polyworks.Utils.extend(defaults, config);
		// trace('Machine/constructor, config = ', config);
	}

	Machine.prototype.set = function(prop, val) {
		this.config[prop] = val;
	};
	
	Machine.prototype.get = function(prop) {
		if(!this.config.hasOwnProperty(prop)) {
			return;
		}
		return this.config[prop];
	};
	
	Machine.prototype.setPart = function(part, val) {
		this.config.parts[part] = val;
	};
	
	Machine.prototype.save = function() {
		this.calculateCost();
		playerData.equipment.push(this.config);
	};
	
	Machine.prototype.calculateCost = function() {
		trace('Machine['+this.config.id+']/calculateCost, this = ', this);
		Polyworks.Utils.each(
			this.config.parts,
			function(val, key) {
				trace('\tval = ' + val + ', key = ' + key);
				this.config.cost += gameData.market[key][val].cost[this.config.size];
			},
			this
		);
		trace('post calculate cost, cost = ' + this.config.cost);
	};
	
	Machine.prototype.reset = function(part) {
		this.config.parts[part] = -1;
	};
	
	return Machine;
}();