var playerData = {
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
		location: 5
	},
	{
		location: 7
	}
	],
	equipment: {},
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
	],
	suppliers: [
	{
		idx: 0,
		lifetime: 3,
		discount: 0.1
	}
	]
}