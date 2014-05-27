var gameData = {
	market: {
		wheels: [
		{
			type: 'w1',
			icon: 'wheels1',
			description: 'great wheels',
			cost: 500
		},
		{
			type: 'w2',
			icon: 'wheels2',
			description: 'cheap wheels',
			cost: 250
		},
		{
			type: 'w3',
			icon: 'wheels3',
			description: 'average wheels',
			cost: 350
		},
		{
			type: 'w4',
			icon: 'wheels4',
			description: 'best wheels',
			cost: 1000
		}
		],
		engines: [
		{
			type: 'e1',
			icon: 'engine1',
			cost: 2000
		},
		{
			type: 'e2',
			icon: 'engine2',
			cost: 5000
		}
		],
		transmissions: [
		{
			type: 't1',
			icon: 'transmission1',
			cost: 1000
		},
		{
			type: 't2',
			icon: 'transmission2',
			cost: 3000
		}
		],
		cabs: [
		{
			type: 'c1',
			icon: 'cab1',
			cost: 500
		},
		{
			type: 'c2',
			icon: 'cab2',
			cost: 650
		}
		],
		headlights: [
		{
			type: 'h1',
			icon: 'headlights1',
			cost: 100
		},
		{
			type: 'h2',
			icon: 'headlights2',
			cost: 200
		}
		],
		buckets: [
		{
			type: 'ba1',
			icon: 'bucket1',
			cost: 200
		},
		{
			type: 'ba2',
			icon: 'bucket2',
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