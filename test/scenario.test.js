import test from "ava";
import FenceParser from "../src/index.js";
import fixtures from "./fixtures/scenarios.js";
import macro from "./macro.js";

const parser = new FenceParser();

for (const fixture of fixtures) {
	let result;
	if (fixture.options) {
		result = (new FenceParser(fixture.options)).parse(fixture.input);
	} else {
		result = parser.parse(fixture.input);
	}

	const expected = fixture.output;
	const title = `input "${fixture.input}"`;

	test(title, macro, result, expected);
}
