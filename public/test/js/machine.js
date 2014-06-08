var Machine = function() {
	
	var module = {};
	var defaults = {
		name: '',
		type: '',
		size: '',
		cost: 0,
		parts: {}
	};
	
	function Machine(id, config) {
		this.id = id;
		this.config = PWG.Utils.extend(PWG.Utils.clone(defaults), config);
		trace('Machine/constructor, config = ', config);
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
	};
	
	Machine.prototype.calculateCost = function() {
		// trace('Machine['+this.config.id+']/calculateCost, this = ', this);
		PWG.Utils.each(
			this.config.parts,
			function(val, key) {
				// trace('\tval = ' + val + ', key = ' + key);
				this.config.cost += gameData.parts[key][val].cost[this.config.size];
			},
			this
		);
		// trace('post calculate cost, cost = ' + this.config.cost);
	};
	
	Machine.prototype.reset = function(part) {
		this.config.parts[part] = -1;
	};
	
	return Machine;
}();