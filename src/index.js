import { createToken, Lexer } from "chevrotain";
import defu from "defu";

const keyValuePairPattern = /([-\w]+)=(?:'([^']*)'|"([^"]*)"|\`([^`]*)\`)/;

const WhiteSpace = createToken({ name: "WhiteSpace", pattern: /\s+/, group: Lexer.SKIPPED });
const Range0 = createToken({ name: "Range0", pattern: /\w*{\d+}/, label: "range" });
const Range2 = createToken({ name: "Range2", pattern: /\w*{\d+\.\.\d+}/, label: "range" });
const Ranges = createToken({ name: "Ranges", pattern: /\w*{(?:\d+|\d+\.\.\d+)(?:,\s*(?:\d+|\d+\.\.\d+))*}/, label: "range" });
const KeyValuePair = createToken({ name: "KeyValuePair", pattern: keyValuePairPattern, label: "pair" });

const tokens = [
	WhiteSpace,
	Range0,
	Range2,
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

	stripParantheses(token) {
		const startIndex = token.indexOf("{");
		const stopIndex = token.indexOf("}");
		const key = token.substring(0, startIndex) || this.options.rangeKey;
		const value = token.substring(startIndex + 1, stopIndex);
		return {
			key,
			value
		}
	}

	process(token0) {
		const label = token0.tokenType.LABEL;
		const token = token0.image;
		const type = token0.tokenType.name;
		switch(type) {
			case "Range0":
				const r0 = this.stripParantheses(token);
				return {
					key: r0.key,
					value: [Number(r0.value)],
					type: label
				};
			case "Range2":
				const r2 = this.stripParantheses(token);
				const [ b0, b1 ] = r2.value.split("..").map((bound) => Number(bound));
				const start = Math.min(b0, b1);
				const stop = Math.max(b0, b1);
				const size = stop - start + 1;
				return {
					key: r2.key,
					value: Array.from({ length: size }, (_, i) => i + start),
					type: label
				};
			case "Ranges":
				const rx = this.stripParantheses(token);
				return {
					key: rx.key,
					value: rx.value.split(",")
						.map(res => "{" + res.trim() + "}")
						.flatMap(res => FenceParser.FenceLexer.tokenize(res).tokens)
						.map(res => this.process(res))
						.flatMap(res => res.value),
					type: label
				}
			case "KeyValuePair":
				let [, key = "key", v1, v2, v3] = token.match(keyValuePairPattern);
				return {
					key,
					value: v1 || v2 || v3,
					type: label
				};
			default:
				console.warn(`Unsupported token type ${type}`);
		}
	}

	parse(text) {
		const { tokens } = FenceParser.FenceLexer.tokenize(text);

		const response = {};
		for (const token of tokens) {
			const { key, value, type } = this.process(token);
			const isRange = type === "range";
			response[key] ??= isRange ? [] : value;
			if (isRange) {
				response[key] = response[key].concat(value);
			}
		}

		return response;
	}
};
