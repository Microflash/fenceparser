import test from "ava";
import FenceParser from "../src/index.js";
import fixtures from "./fixtures/combinations.js";
import macro from "./macro.js";

const parser = new FenceParser();

for (const fixture of fixtures) {
	const result = parser.parse(fixture.input);
	const expected = fixture.output;
	const title = `input "${fixture.input}"`;

	test(title, macro, result, expected);
}
