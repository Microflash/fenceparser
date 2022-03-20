import parse from '../src/index.js'
import fixtures from './fixtures.js'

describe(`${fixtures.length} tests`, () => {
	for (const fixture of fixtures) {
		it(`input '${fixture.input}'`, () => {
			const { metadata } = parse(fixture.input)
			const expected = fixture.output

			for (const key of Object.keys(expected)) {
				const output = metadata[key]
				if (Array.isArray(output)) {
					expect(output.sort()).toEqual(expected[key].sort())
				} else {
					expect(output).toEqual(expected[key])
				}
			}
		})
	}
})
