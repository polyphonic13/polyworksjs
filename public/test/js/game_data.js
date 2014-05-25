var gameData = {
	money: 1000000,
	factories: [
	{
		location: 3
	},
	{
		location: 10
	}
	],
	showrooms: [
	{
		
	},
	{
		
	}
	],
	equipment: {
		tractors: {
			basic: [
			{
				body: 1,
				chasis: 1,
				frontWheels: 1,
				rearWheels: 1,
				cab: 1
			}
			],
			medium: [
			{
				body: 1,
				chasis: 2,
				frontWheels: 1,
				rearWheels: 4,
				cab: 1
			}
			],
			heavy: [
			{
				body: 3,
				chasis: 3,
				frontWheels: 2,
				rearWheels: 2,
				cab: 2
			}
			]
		},
		skidSteers: {
			basic: [
			{
				body: 1,
				chasis: 1,
				frontWheels: 1,
				rearWheels: 1,
				cab: 1
			}
			],
			medium: [
			{
				body: 2,
				chasis: 2,
				frontWheels: 2,
				rearWheels: 2,
				cab: 2
			}
			],
			heavy: [
			{
				body: 3,
				chasis: 3,
				frontWheels: 3,
				rearWheels: 3,
				cab: 3
			}
			]
		}
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
			skidSteers: {
				basic: [0],
				medium: [3],
				heavy: [1]
				
			}
		}
	}
	],
	suppliers: [
	{
		name: 'jon doe tractor parts',
		lifeTime: 3,
		supplies: {
			
		}
	}
	]
}