var playerData = {
	bank: 1000000,
	buildings: [
		// ne
		{
			factory: {},
			showroom: {}
		},
		// se
		{
			factory: {},
			showroom: {}
		},
		// mw
		{
			factory: {},
			showroom: {}
		},
		// nw
		{
			factory: {},
			showroom: {}
		},
		// sw
		{
			factory: {},
			showroom: {}
		}
	],
	buildingCount: {
		factory: 0,
		showroom: 0
	},
	equipment: [],
	machineCount: {
		tractor: 0,
		skidsteer: 0
	},
	tradeRoutes: [
	{
		name: 'asia',
		lifeTime: 2,
		consumption: {
			tractors: {
				basic: [5],
				medium: [0],
				heavy: [1]
			},
			skidsteers: {
				basic: [0],
				medium: [3],
				heavy: [1]
				
			}
		}
	}
	]
}