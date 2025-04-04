import { it } from "node:test";
import FenceParser from "../src/index.js";
import isolatedFixtures from "./fixtures/isolated.js";
import combinedFixtures from "./fixtures/combined.js";

const fixtures = [...isolatedFixtures, ...combinedFixtures];
const defaultParser = new FenceParser();

for (const fixture of fixtures) {
	const parser = fixture.options ? new FenceParser(fixture.options) : defaultParser;
	const result = parser.parse(fixture.input);
	const expected = fixture.output;
	const title = `input "${fixture.input}"`;

	it(title, (t) => {
		const keys = Object.keys(expected);
		if (keys.length) {
			for (const key of keys) {
				const output = result[key];
				if (Array.isArray(output)) {
					t.assert.deepEqual(output.sort(), expected[key].sort());
				} else {
					t.assert.deepEqual(output, expected[key]);
				}
			}
		} else {
			t.assert.deepEqual(result, expected);
		}
	});
}
