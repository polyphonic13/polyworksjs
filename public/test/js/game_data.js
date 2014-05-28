var gameData = {
	market: {
		wheels: [
		{
			type: 'w3',
			icon: 'wheels2',
			description: 'basic wheels',
			cost: 350
		},
		{
			type: 'w1',
			icon: 'wheels1',
			description: 'standard wheels',
			cost: 500
		},
		{
			type: 'w4',
			icon: 'wheels3',
			description: 'deluxe wheels',
			cost: 1000
		}
		],
		engines: [
		{
			type: 'e1',
			icon: 'engine1',
			description: 'basic engine',
			cost: 2000
		},
		{
			type: 'e2',
			icon: 'engine2',
			description: 'standard engine',
			cost: 3000
		},
		{
			type: 'e3',
			icon: 'engine3',
			description: 'deluxe engine',
			cost: 5000
		}
		],
		transmissions: [
		{
			type: 't1',
			icon: 'transmission1',
			description: 'basic transmission',
			cost: 1000
		},
		{
			type: 't2',
			icon: 'transmission2',
			description: 'standard transmission',
			cost: 1500
		},
		{
			type: 't3',
			icon: 'transmission3',
			description: 'deluxe transmission',
			cost: 3000
		}
		],
		cabs: [
		{
			type: 'c1',
			icon: 'cab1',
			description: 'basic cabs',
			cost: 500
		},
		{
			type: 'c2',
			icon: 'cab2',
			description: 'standard cabs',
			cost: 650
		},
		{
			type: 'c3',
			icon: 'cab3',
			description: 'deluxe cabs',
			cost: 1000
		}
		],
		headlights: [
		{
			type: 'h1',
			icon: 'headlights1',
			description: 'basic headlights',
			cost: 100
		},
		{
			type: 'h2',
			icon: 'headlights2',
			description: 'standard headlights',
			cost: 200
		},
		{
			type: 'h3',
			icon: 'headlights3',
			description: 'deluxe headlights',
			cost: 500
		}
		],
		buckets: [
		{
			type: 'ba1',
			icon: 'bucket1',
			description: 'basic bucket',
			cost: 200
		},
		{
			type: 'ba2',
			icon: 'bucket2',
			description: 'standard bucket',
			cost: 300
		},
		{
			type: 'ba3',
			icon: 'bucket3',
			description: 'deluxe bucket',
			cost: 400
		}
		]
	},
	suppliers: [
	{
		name: 'john doe',
		location: 'texas',
		parts: {
			buckets: [
			{
				type: 'ba1',
				cost: 50,
				bulkAmount: 1000
			}
			],
			wheels: [
			{
				type: 'c3',
				cost: 100,
				bulkAmount: 5000
			}
			]
		}
	},
	{
		name: 'jane smith',
		location: 'arkansas',
		parts: {
			engines: [
			{
				type: 'ba1',
				cost: 50,
				bulkAmount: 1000
			}
			],
			transmissions: [
			{
				type: 't2',
				cost: 100,
				bulkAmount: 5000
			}
			]
		}
	}
	]
};