var BuildingManager = function() {
	var module = {};
	
	var states = {
		CONSTRUCTION: 'construction',
		BUILT: 'built',
		ACTIVE: 'active',
		INACTIVE: 'inactive'
	};

	// BUILDING BASE CLASS
	function Building(config) 
	{
		this.config = config;
		this.state = states.CONSTRUCTION;
		this.age = 0;
		this.location = config.location;
	};
	
	Building.prototype.capacity = 0;
	Building.prototype.inventory = [];
	Building.prototype.update = function() 
	{
		if(this.state === states.CONSTRUCTION && this.age >= this.buildTime) {
			this.state = states.ACTIVE;
			// trace('building construction completed');
		}
		this.age++;
	};
	
	Building.prototype.move = function(position) 
	{
		this.location = position;
	};
	
	// FACTORY
	function Factory(config) 
	{
		Building.call(this, config);
	}
	PWG.Utils.inherit(Factory, Building);
	
	Factory.prototype.buildTime = 3;
	Factory.prototype.typeCapacity = 10;
	Factory.prototype.outputCapacity = 100;
	Factory.prototype.machineTypes = [];
	
 	Factory.prototype.update = function() 
	{
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
								if(this.inventory.length < this.outputCapacity) {
									PhaserGame.bank -= machine.get('cost');
									this.inventory.push(machine.id);
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
	function Showroom(config) 
	{
		Building.call(this, config);
	}
	PWG.Utils.inherit(Showroom, Building);

	Showroom.prototype.buildTime = 3;
	Showroom.prototype.capacity = 50;
	Showroom.prototype.update = function() 
	{
		Showroom._super.update.apply(this, arguments);
		if(this.state === states.ACTIVE) {
			if(this.inventory.length > 0) 
			{

			}
		}
	};
	
	module.buildings = { factory: [], showroom: [] };
	
	module.create = function(type, config) 
	{
		// trace('BuildingManager/create, type = ' + type + ', cost = ' + buildingCosts[type] + ', bank = ' + PhaserGame.bank);
		if(PhaserGame.bank >= buildingCosts[type]) 
		{
			var building;
			if(type === 'factory') 
			{
				building = new Factory(config);
			} 
			else 
			{
				building = new Showroom(config);
			}
			module.buildings[type].push(building);
			PhaserGame.bank -= buildingCosts[type];
			// trace('created a new ' + type + ' for ' + buildingCosts[type] + ', bank now = ' + PhaserGame.bank);
		}
	};
	
	module.addMachineTypeToFactory = function(machineType, factoryIdx) 
	{
		module.buildings.factories[factoryIdx].machineTypes[machineType.id] = machineType;
	};
	
	module.addInventoryToShowroom = function(factoryIdx, showroomIdx) 
	{
		var inventory = module.buildings.factories[factoryIdx].inventory;
		var showroom = module.buildings.showrooms[showroomIdx];

		if(inventory.length > 0) 
		{
			PWG.Utils.each(
				inventory,
				function(machine) 
				{
					showroom.inventory.push(machine);
				},
				this
			)
		}
		else 
		{
			// notify factory has no inventory
		}
	};
	
	module.update = function() 
	{
		module.updateType('factory');
		module.updateType('showroom');
	};
	
	module.updateType = function(type) 
	{
		var buildings = module.buildings[type];
		PWG.Utils.each(
			buildings,
			function(building) 
			{
				building.update();
			},
			module
		);
	};
	
	module.move = function(type, buildingIdx, position) 
	{
		this.buildings[type][buildingIdx].move(position);
	};
	
	return module;
	
}();