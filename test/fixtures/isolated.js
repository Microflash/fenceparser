export default [
	{
		input: '',
		output: {},
	},
	{
		input: '{}',
		output: {},
	},
	{
		input: 'true="false"',
		output: {
			true: "false",
		},
	},
	{
		input: 'maxRun="1"',
		output: {
			maxRun: "1",
		},
	},
	{
		input: '{1}',
		output: { mark: [1] },
		options: { rangeKey: "mark" },
	},
	{
		input: '{11..8, 20}',
		output: { highlight: [8, 9, 10, 11, 20] },
	}
];
