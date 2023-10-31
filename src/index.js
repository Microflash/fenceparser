import { createToken, Lexer } from "chevrotain";
import defu from "defu";

const keyValuePairPattern = /(\w+)=(?:'([^']*)'|"([^"]*)"|\`([^`]*)\`)/;

const WhiteSpace = createToken({ name: "WhiteSpace", pattern: /\s+/, group: Lexer.SKIPPED });
const Range0 = createToken({ name: "Range0", pattern: /\w*{\d+}/ });
const Range2 = createToken({ name: "Range2", pattern: /\w*{\d+\.\.\d+}/ });
const Ranges = createToken({ name: "Ranges", pattern: /\w*{(?:\d+|\d+\.\.\d+)(?:,\s*(?:\d+|\d+\.\.\d+))*}/ });
const KeyValuePair = createToken({ name: "KeyValuePair", pattern: keyValuePairPattern });

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

	process({ token, type }) {
		switch(type) {
			case "Range0":
				const r0 = this.stripParantheses(token);
				return { key: r0.key, value: [Number(r0.value)], type: "range" };
			case "Range2":
				const r2 = this.stripParantheses(token);
				const bounds = r2.value.split("..").map((bound) => Number(bound));
				const start = Math.min(...bounds);
				const stop = Math.max(...bounds);
				const size = stop - start + 1;
				return { key: r2.key, value: Array.from({ length: size }, (_, i) => i + start), type: "range" };
			case "Ranges":
				const rx = this.stripParantheses(token);
				return {
					key: rx.key,
					value: rx.value.split(",")
						.map(res => "{" + res.trim() + "}")
						.flatMap(res => FenceParser.FenceLexer.tokenize(res).tokens)
						.map(res => ({ token: res.image, type: res.tokenType.name }))
						.map(res => this.process(res))
						.flatMap(res => res.value),
					type: "range"
				}
			case "KeyValuePair":
				let [, key = "key", v1, v2, v3] = token.match(keyValuePairPattern);
				return {
					key,
					value: v1 || v2 || v3,
					type: "pair"
				};
			default:
				console.warn(`Unsupported token type ${type}`);
		}
	}

	parse(text) {
		const { tokens } = FenceParser.FenceLexer.tokenize(text);
		return tokens
			.map(res => ({ token: res.image, type: res.tokenType.name }))
			.map(res => this.process(res))
			.reduce((acc, { key, value, type }) => {
				const isRange = type === "range";
				acc[key] ??= isRange ? [] : value;
				if(isRange && Array.isArray(value)) {
					acc[key] = acc[key].concat(value);
				}
				return acc;
			}, {});
	}
};
