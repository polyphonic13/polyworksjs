var BuildingManager = function() {
	var module = {};
	
	var states = {
		CONSTRUCTION: 'construction',
		BUILT: 'built',
		ACTIVE: 'active',
		INACTIVE: 'inactive'
	};

	// BUILDING BASE CLASS
	function Building(idx, config) {
		this.idx = idx;
		this.type = config.type;
		this.config = config;
		this.state = states.CONSTRUCTION;
		this.age = 0;
		this.location = config.location;
	};
	
	Building.prototype.capacity = 0;
	Building.prototype.equipment = [];
	Building.prototype.update = function() {
		if(this.state === states.CONSTRUCTION && this.age >= this.buildTime) {
			this.state = states.ACTIVE;
			// trace('building construction completed');
			module.onBuildingStateUpdate.call(this, { id: this.id, type: this.type, state: this.state });
		}
		this.age++;
	};
	Building.prototype.move = function(position) {
		this.location = position;
	};
	
	// FACTORY
	function Factory(config) {
		Building.call(this, config);
	}
	PWG.Utils.inherit(Factory, Building);
	
	Factory.prototype.buildTime = 3;
	Factory.prototype.typeCapacity = 10;
	Factory.prototype.outputCapacity = 100;
	Factory.prototype.machineTypes = [];
 	Factory.prototype.update = function() {
		Factory._super.update.apply(this, arguments);
		if(this.state === states.ACTIVE)
		{
			if(this.machineTypes.length > 0)
			{ 
				this.buildTime++;
				
				if(this.buildTime === TIME_TO_BUILD) 
				{
					PWG.Utils.each(
						this.machineTypes,
						function(machine) 
						{
							if(PhaserGame.bank > 0) 
							{
								if(this.equipment.length < this.outputCapacity) {
									PhaserGame.bank -= machine.get('cost');
									this.equipment.push(machine.id);
								}
								else
								{
									// notify output capacity reached
								}
							} 
							else 
							{
								// notifiy out of money
							}
						},
						this
					);
					this.buildTime = 0;
				}
			}
			else
			{
				// notify machineTypes needed
			}
		
		}
	};

	// SHOWROOM
	function Showroom(config) {
		Building.call(this, config);
	}
	PWG.Utils.inherit(Showroom, Building);

	Showroom.prototype.buildTime = 2;
	Showroom.prototype.capacity = 50;
	Showroom.prototype.update = function() {
		Showroom._super.update.apply(this, arguments);
		if(this.state === states.ACTIVE) {
			if(this.equipment.length > 0) 
			{

			}
		}
	};
	
	module.buildings = { factory: [], showroom: [] };
	module.factorCount = 0;
	madule.showroomCount = 0;
	
	module.create = function(type, config) {
		// trace('BuildingManager/create, type = ' + type + ', cost = ' + buildingCosts[type] + ', bank = ' + PhaserGame.bank);
		config.type = type;
		if(PhaserGame.bank >= buildingCosts[type]) {
			var building;
			if(type === 'factory') {
				building = new Factory(module.factoryCount, config);
				module.factoryCount++;
			} else {
				module.showroomCount++;
				building = new Showroom(module.showroomCount, config);
			}
			module.buildings[type].push(building);
			PhaserGame.playerData.buildings[type].push(building);
			PhaserGame.bank -= buildingCosts[type];
			module.saveBuildingData(building);
			// trace('created a new ' + type + ' for ' + buildingCosts[type] + ', bank now = ' + PhaserGame.bank);
		}
	};
	
	module.addMachineTypeToFactory = function(machineType, factoryIdx) {
		module.buildings.factories[factoryIdx].machineTypes[machineType.id] = machineType;
	};
	
	module.addInventoryToShowroom = function(factoryIdx, showroomIdx) {
		var equipment = module.buildings.factories[factoryIdx].equipment;
		var showroom = module.buildings.showrooms[showroomIdx];

		if(equipment.length > 0) {
			PWG.Utils.each(
				equipment,
				function(machine) {
					showroom.equipment.push(machine);
				},
				this
			)
		}
		else 
		{
			// notify factory has no equipment
		}
	};
	
	module.update = function() {
		module.updateType('factory');
		module.updateType('showroom');
	};
	
	module.updateType = function(type) {
		var buildings = module.buildings[type];
		PWG.Utils.each(
			buildings,
			function(building) {
				building.update();
			},
			module
		);
	};
	
	module.onBuildingStatusUpdated = function(event) {
		module.saveBuildingData(event);
	};
	
	module.saveBuildingData = function(params) {
		var idx = params.idx;
		var type = params.type;
		
		PWG.Utils.each(
			params,
			function(param, key) {
				PlayerGame.playerData.buildings[type][idx][key] = param;
			},
			this
		);
		PhaserGame.setSavedData();
	};
	
	module.move = function(type, buildingIdx, position) {
		this.buildings[type][buildingIdx].move(position);
	};
	
	return module;
	
}();