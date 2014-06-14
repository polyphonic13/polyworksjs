var BuildingManager = function() {
	var module = {};
	
	var states = {
		CONSTRUCTION: 'construction',
		ACTIVE: 'active',
		INACTIVE: 'inactive'
	};

	// BUILDING BASE CLASS
	function Building(config) {
		// trace('Building/constructor, config = ', config);
		this.config = config;
		this.config.state = states.CONSTRUCTION;
		
		this.id = config.id;
		this.config.type = config.type;
		this.config.state = states.CONSTRUCTION;
		this.config.age = config.age || 0;
	};
	
	Building.prototype.capacity = 0;
	Building.prototype.equipment = [];
	Building.prototype.update = function() {
		if(this.config.state === states.CONSTRUCTION && this.config.age >= this.buildTime) {
			this.config.state = states.ACTIVE;
			// trace('building construction completed');
		}
		this.config.age++;
		module.saveBuildingData.call(this, this.config);
	};
	Building.prototype.move = function(position) {
		this.location = position;
	};
	
	// FACTORY
	function Factory(config) {
		
		Building.call(this, config);
		this.config.machineTypes = [];
	}
	PWG.Utils.inherit(Factory, Building);
	
	Factory.prototype.buildTime = 3;
	Factory.prototype.typeCapacity = 10;
	Factory.prototype.outputCapacity = 100;
 	Factory.prototype.update = function() {
		Factory._super.update.apply(this, arguments);
		if(this.config.state === states.ACTIVE) {
			if(this.config.machineTypes.length > 0) { 
				this.buildTime++;
				
				if(this.buildTime === TIME_TO_BUILD) {
					PWG.Utils.each(
						this.config.machineTypes,
						function(machine) {
							if(PhaserGame.playerData.bank > 0) {
								if(this.equipment.length < this.outputCapacity) {
									PhaserGame.playerData.bank -= machine.get('cost');
									this.equipment.push(machine.id);
								} else {
									// notify output capacity reached
								}
							} 
							else 
							{
								// notifiy out of bank
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
		this.config.inventory = [];
	}
	PWG.Utils.inherit(Showroom, Building);

	Showroom.prototype.buildTime = 2;
	Showroom.prototype.capacity = 50;
	Showroom.prototype.update = function() {
		Showroom._super.update.apply(this, arguments);
		if(this.config.state === states.ACTIVE) {
			if(this.config.inventory.length > 0) {

			}
		}
	};
	
	module.buildings = { factory: {} };
	
	module.init = function() {
		trace('initializing building data with: ', PhaserGame.playerData.buildings);
		PWG.Utils.each(
			PhaserGame.playerData.buildings,
			function(sector) {
				PWG.Utils.each(
					sector.factory,
					function(factory) {
						module.buildings['factory'][factory.id] = new Factory(factory);
					},
					this
				);
				PWG.Utils.each(
					sector.showroom,
					function(showroom) {
						module.buildings['showroom'][showroom.id] = new Showroom(showroom);
					},
					this
				);
			},
			this
		);
		trace('BuildingManager.buildings now = ', module.buildings);
	};
	
	module.create = function(type, config) {
		// trace('BuildingManager/create, type = ' + type + ', cost = ' + gameData.buildings[type].cost + ', bank = ' + PhaserGame.playerData.bank);
		config.type = type;
		config.id = type + PhaserGame.playerData.buildingCount[type];
		
		if(PhaserGame.playerData.bank >= gameData.buildings[type].cost) {
			var building;
			if(type === 'factory') {
				building = new Factory(config);
			} else {
				building = new Showroom(config);
			}
			// trace('\tbuilding made');
			PhaserGame.playerData.buildingCount[type]++;
			// trace('\tremoving bank from bank');
			PhaserGame.playerData.bank -= gameData.buildings[type].cost;
			// trace('\tabout to save building data');
			module.saveBuildingData(building.config);
			module.buildings[type][config.id] = building;
			// trace('created a new ' + type + ' for ' + buildingCosts[type] + ', bank now = ' + PhaserGame.playerData.bank);
			return true;
		} else {
			trace('no more money');
			return false;
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
					showroom.inventory.push(machine);
				},
				this
			);
		} else {
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
	
	module.saveBuildingData = function(config) {
		// trace('BuildingManager/saveBuildingData, config = ', config);
		PWG.EventCenter.trigger({ type: PWG.Events.BUILDING_STATE_UPDATED, config: config });
		PhaserGame.playerData.buildings[config.sector][config.type][config.id] = config;
		// trace('\tabout to save data to local storage');
		PhaserGame.setSavedData();
	};
	
	module.move = function(type, buildingIdx, position) {
		this.buildings[type][buildingIdx].move(position);
	};
	
	return module;
	
}();