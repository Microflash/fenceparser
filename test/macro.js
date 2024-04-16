import test from "ava";

const macro = test.macro({
	exec(t, input, expected) {
		const keys = Object.keys(expected);
		if (keys.length) {
			for (const key of keys) {
				const output = input[key];
				if (Array.isArray(output)) {
					t.deepEqual(output.sort(), expected[key].sort());
				} else {
					t.is(output, expected[key]);
				}
			}
		} else {
			t.deepEqual(input, expected);
		}
	},
	title(providedTitle = "", input, expected) {
		return `${providedTitle}`.trim();
	}
});

export default macro;
