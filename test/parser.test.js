import test from 'ava'
import parse from '../src/index.js'
import fixtures from './fixtures.js'

const macro = test.macro({
	exec(t, input, expected) {
		const keys = Object.keys(expected)
		if (keys.length) {
			for (const key of keys) {
				const output = input[key]
				if (Array.isArray(output)) {
					t.deepEqual(output.sort(), expected[key].sort())
				} else {
					t.is(output, expected[key])
				}
			}
		} else {
			t.deepEqual(input, expected)
		}
	},
	title(providedTitle = '', input, expected) {
		return `${providedTitle}`.trim()
	}
})

for (const fixture of fixtures) {
	const { metadata } = parse(fixture.input)
	const expected = fixture.output
	const title = `input '${fixture.input}'`

	test(title, macro, metadata, expected)
}
