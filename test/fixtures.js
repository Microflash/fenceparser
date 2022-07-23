const permute = (input) => {
	const result = [input.slice()]
	const c = new Array(input.length).fill(0)
	let i = 1,
		k,
		p

	while (i < input.length) {
		if (c[i] < i) {
			k = i % 2 && c[i]
			p = input[i]
			input[i] = input[k]
			input[k] = p
			++c[i]
			i = 1
			result.push(input.slice())
		} else {
			c[i] = 0
			++i
		}
	}

	return result
}

const prepareFixtures = (fixtures) => {
	return fixtures
		.map(({ input, ...props }) => {
			return permute(input).map((p) => ({ input: p.join(' '), ...props }))
		})
		.reduce((a, b) => [...a, ...b])
}

const fixtures = [
	// edge cases
	{
		input: [''],
		output: {},
	},
	{
		input: ['{}'],
		output: {},
	},
	{
		input: ['true="false"'],
		output: {
			true: "false",
		},
	},
	{
		input: ['maxRun="1"'],
		output: {
			maxRun: "1",
		},
	},
	// isolated
	{
		input: ['{1}'],
		output: { highlight: [1] },
	},
	{
		input: ['{3, 7}'],
		output: { highlight: [3, 7] },
	},
	{
		input: ['{9-11, 88}'],
		output: { highlight: [9, 10, 11, 88] },
	},
	{
		input: ['{90, 101..112}'],
		output: {
			highlight: [
				90, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112,
			],
		},
	},
	{
		input: ['{115, 121..125, 130-137, 140}'],
		output: {
			highlight: [
				115, 121, 122, 123, 124, 125, 130, 131, 132, 133, 134, 135, 136, 137,
				140,
			],
		},
	},
	{
		input: ['ins{1}'],
		output: { ins: [1] },
	},
	{
		input: ['ins{3, 7}'],
		output: { ins: [3, 7] },
	},
	{
		input: ['ins{9-11, 88..90}'],
		output: { ins: [9, 10, 11, 88, 89, 90] },
	},
	// together (simple)
	{
		input: ['{1}', '{3, 7}'],
		output: { highlight: [1, 3, 7] },
	},
	{
		input: ['{9-11, 88}', '{90, 101..112}'],
		output: {
			highlight: [
				9, 10, 11, 88, 90, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110,
				111, 112,
			],
		},
	},
	{
		input: ['{9-11, 88}', 'del{90, 101..112}'],
		output: {
			highlight: [
				9, 10, 11, 88,
			],
			del: [
				90, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112,
			]
		},
	},
	{
		input: ['diff="ins{2}, del{25, 26}"', "hide{99..101}", 'callback=`() => console.log("test")`'],
		output: {
			diff: 'ins{2}, del{25, 26}',
			hide: [
				99, 100, 101,
			],
			callback: '() => console.log("test")'
		}
	},
	{
		input: ['showCopy="true"', "data-motion=`reduced`", 'app_context="root"'],
		output: {
			app_context: 'root',
			'data-motion': 'reduced',
			showCopy: 'true'
		}
	},
	// together (medium)
	{
		input: [
			'{9-11, 88}',
			'{90-92, 109..112}',
			'caption="Hello, World"',
			"text-color='--text-default'",
			'syntax_theme="nord"',
			'css=`{ *: { display: none }}`',
			'prompt{3, 9-11}',
		],
		output: {
			caption: 'Hello, World',
			'text-color': '--text-default',
			syntax_theme: 'nord',
			css: '{ *: { display: none }}',
			highlight: [
				9, 10, 11, 88, 90, 91, 92, 109, 110, 111, 112,
			],
			prompt: [
				3, 9, 10, 11,
			],
		},
	},
	// together (complex)
]

export default prepareFixtures(fixtures)
