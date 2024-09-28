import { createToken, Lexer } from "chevrotain";
import defu from "defu";

const keyValuePairPattern = /([-\w]+)=(?:'([^']*)'|"([^"]*)"|\`([^`]*)\`)/;

const WhiteSpace = createToken({ name: "WhiteSpace", pattern: /\s+/, group: Lexer.SKIPPED });
const Range0 = createToken({ name: "Range0", pattern: /\w*{\d+}/, label: "range" });
const Range2Dotted = createToken({ name: "Range2Dotted", pattern: /\w*{\d+\.\.\d+}/, label: "range" });
const Ranges = createToken({ name: "Ranges", pattern: /\w*{(?:\d+|\d+\.\.\d+)(?:,\s*(?:\d+|\d+\.\.\d+))*}/, label: "range" });
const KeyValuePair = createToken({ name: "KeyValuePair", pattern: keyValuePairPattern, label: "pair" });

const tokens = [
	WhiteSpace,
	Range0,
	Range2Dotted,
	Ranges,
	KeyValuePair
];

export default class FenceParser {

	static FenceLexer = new Lexer(tokens);
	static DefaultOptions = {
		rangeKey: "highlight"
	}

	constructor(options = {}) {
		this.options = defu(options, FenceParser.DefaultOptions);
	}

	extractRawPair(token, label) {
		switch (label) {
			case "range":
				const startIndex = token.indexOf("{");
				const stopIndex = token.indexOf("}");
				return {
					key: token.substring(0, startIndex) || this.options.rangeKey,
					value: token.substring(startIndex + 1, stopIndex)
				};
			case "pair":
				const [, key = "key", v1, v2, v3] = token.match(keyValuePairPattern);
				return { key, value: v1 || v2 || v3 };
			default:
				console.warn(`Unsupported token type ${label}`);
		}
	}

	extractPair(token0) {
		const label = token0.tokenType.LABEL;
		const token = token0.image;
		const { key, value } = this.extractRawPair(token, label);
		const type = token0.tokenType.name;
		switch(type) {
			case "Range0":
				return { key, value: [Number(value)], label };
			case "Range2Dotted":
				const [ dottedB0, dottedB1 ] = value.split("..").map((bound) => Number(bound));
				const dottedRangeStart = Math.min(dottedB0, dottedB1);
				const dottedRangeStop = Math.max(dottedB0, dottedB1);
				const dottedRangeSize = dottedRangeStop - dottedRangeStart + 1;
				return {
					key,
					value: Array.from({ length: dottedRangeSize }, (_, i) => i + dottedRangeStart),
					label
				};
			case "Ranges":
				return {
					key,
					value: value.split(",")
						.map(res => `{${res.trim()}}`)
						.flatMap(res => FenceParser.FenceLexer.tokenize(res).tokens)
						.map(res => this.extractPair(res))
						.flatMap(res => res.value),
					label
				}
			case "KeyValuePair":
				return { key, value, label };
			default:
				console.warn(`Unsupported token type ${type}`);
		}
	}

	parse(text) {
		const { tokens } = FenceParser.FenceLexer.tokenize(text);

		const response = {};
		for (const token of tokens) {
			const { key, value, label } = this.extractPair(token);
			const isRange = label === "range";
			response[key] ??= isRange ? [] : value;
			if (isRange) {
				response[key] = response[key].concat(value);
			}
		}

		return response;
	}
};
