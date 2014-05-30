var gameData = {
	market: {
		wheels: [
		{
			id: 'w3',
			icon: 'wheels2',
			frame: 1,
			description: 'basic wheels',
			cost: [350, 700, 1050]
		},
		{
			id: 'w1',
			icon: 'wheels1',
			frame: 2,
			description: 'standard wheels',
			cost: [500, 1000, 1500]
		},
		{
			id: 'w4',
			icon: 'wheels3',
			frame: 3,
			description: 'deluxe wheels',
			cost: [1000, 2000, 3000]
		}
		],
		engine: [
		{
			id: 'e1',
			icon: 'engine1',
			frame: 1,
			description: 'basic engine',
			cost: [2000, 4000, 6000]
		},
		{
			id: 'e2',
			icon: 'engine2',
			frame: 2,
			description: 'standard engine',
			cost: [3000, 6000, 9000]
		},
		{
			id: 'e3',
			icon: 'engine3',
			frame: 3,
			description: 'deluxe engine',
			cost: [5000, 10000, 15000]
		}
		],
		cab: [
		{
			id: 'c1',
			icon: 'cab1',
			frame: 1,
			description: 'basic cab',
			cost: [300, 600, 900]
		},
		{
			id: 'c2',
			icon: 'cab2',
			frame: 2,
			description: 'standard cab',
			cost: [400, 800, 1200]
		},
		{
			id: 'c3',
			icon: 'cab3',
			frame: 3,
			description: 'deluxe cab',
			cost: [1000, 2000, 3000]
		}
		],
		transmission: [
		{
			id: 't1',
			icon: 'transmission1',
			description: 'basic transmission',
			cost: [1000, 2000, 3000]
		},
		{
			id: 't2',
			icon: 'transmission2',
			description: 'standard transmission',
			cost: [2000, 4000, 6000]
		},
		{
			id: 't3',
			icon: 'transmission3',
			description: 'deluxe transmission',
			cost: [3000, 6000, 9000]
		}
		],
		headlights: [
		{
			id: 'h1',
			icon: 'headlights1',
			description: 'basic headlights',
			cost: [30, 60, 90]
		},
		{
			id: 'h2',
			icon: 'headlights2',
			description: 'standard headlights',
			cost: [60, 120, 180]
		},
		{
			id: 'h3',
			icon: 'headlights3',
			description: 'deluxe headlights',
			cost: [300, 600, 900]
		}
		],
		bucket: [
		{
			id: 'ba1',
			icon: 'bucket1',
			description: 'basic bucket',
			cost: [300, 600, 900]
		},
		{
			id: 'ba2',
			icon: 'bucket2',
			description: 'standard bucket',
			cost: [600, 1200, 1800]
		},
		{
			id: 'ba3',
			icon: 'bucket3',
			description: 'deluxe bucket',
			cost: [1000, 2000, 3000]
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