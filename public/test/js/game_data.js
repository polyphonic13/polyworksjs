var gameData = {
	market: {
		wheels: [
		{
			id: 'w3',
			icon: 'wheels2',
			description: 'basic wheels',
			cost: {
				basic: 350,
				medium: 700,
				heavy: 1050
			}
		},
		{
			id: 'w1',
			icon: 'wheels1',
			description: 'standard wheels',
			cost: {
				basic: 500,
				medium: 1000,
				heavy: 1500
			}
		},
		{
			id: 'w4',
			icon: 'wheels3',
			description: 'deluxe wheels',
			cost: {
				basic: 1000,
				medium: 2000,
				heavy: 3000
			}
		}
		],
		engines: [
		{
			id: 'e1',
			icon: 'engine1',
			description: 'basic engine',
			cost: {
				basic: 2000,
				medium: 4000,
				heavy: 6000
			}
		},
		{
			id: 'e2',
			icon: 'engine2',
			description: 'standard engine',
			cost: {
				basic: 3000,
				medium: 6000,
				heavy: 9000
			}
		},
		{
			id: 'e3',
			icon: 'engine3',
			description: 'deluxe engine',
			cost: {
				basic: 5000,
				medium: 10000,
				heavy: 15000
			}
		}
		],
		transmissions: [
		{
			id: 't1',
			icon: 'transmission1',
			description: 'basic transmission',
			cost: {
				basic: 1000,
				medium: 2000,
				heavy: 3000
			}
		},
		{
			id: 't2',
			icon: 'transmission2',
			description: 'standard transmission',
			cost: {
				basic: 2000,
				medium: 4000,
				heavy: 6000
			}
		},
		{
			id: 't3',
			icon: 'transmission3',
			description: 'deluxe transmission',
			cost: {
				basic: 3000,
				medium: 6000,
				heavy: 9000
			}
		}
		],
		cabs: [
		{
			id: 'c1',
			icon: 'cab1',
			description: 'basic cabs',
			cost: {
				basic: 300,
				medium: 600,
				heavy: 900
			}
		},
		{
			id: 'c2',
			icon: 'cab2',
			description: 'standard cabs',
			cost: {
				basic: 400,
				medium: 800,
				heavy: 1200
			}
		},
		{
			id: 'c3',
			icon: 'cab3',
			description: 'deluxe cabs',
			cost: {
				basic: 1000,
				medium: 2000,
				heavy: 3000
			}
		}
		],
		headlights: [
		{
			id: 'h1',
			icon: 'headlights1',
			description: 'basic headlights',
			cost: {
				basic: 30,
				medium: 60,
				heavy: 90
			}
		},
		{
			id: 'h2',
			icon: 'headlights2',
			description: 'standard headlights',
			cost: {
				basic: 60,
				medium: 120,
				heavy: 180
			}
		},
		{
			id: 'h3',
			icon: 'headlights3',
			description: 'deluxe headlights',
			cost: {
				basic: 300,
				medium: 600,
				heavy: 900
			}
		}
		],
		buckets: [
		{
			id: 'ba1',
			icon: 'bucket1',
			description: 'basic bucket',
			cost: {
				basic: 300,
				medium: 600,
				heavy: 900
			}
		},
		{
			id: 'ba2',
			icon: 'bucket2',
			description: 'standard bucket',
			cost: {
				basic: 600,
				medium: 1200,
				heavy: 1800
			}
		},
		{
			id: 'ba3',
			icon: 'bucket3',
			description: 'deluxe bucket',
			cost: {
				basic: 1000,
				medium: 2000,
				heavy: 3000
			}
		}
		]
	},
	suppliers: [
	{
		id: 'john doe',
		location: 'texas',
		parts: {
			buckets: [
			{
				id: 'ba1',
				cost: 50,
				bulkAmount: 1000
			}
			],
			wheels: [
			{
				id: 'c3',
				cost: 100,
				bulkAmount: 5000
			}
			]
		}
	},
	{
		id: 'jane smith',
		location: 'arkansas',
		parts: {
			engines: [
			{
				id: 'ba1',
				cost: 50,
				bulkAmount: 1000
			}
			],
			transmissions: [
			{
				id: 't2',
				cost: 100,
				bulkAmount: 5000
			}
			]
		}
	}
	]
};