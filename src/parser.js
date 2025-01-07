import { createToken, Lexer, CstParser } from "chevrotain";

const Key = createToken({ name: "Key", pattern: /[_$a-zA-Z][_$a-zA-Z0-9]*/ });
const Equals = createToken({ name: "Equals", pattern: /=/ });
const StringValue = createToken({
  name: "StringValue",
  pattern: /(['"`])(?:(?=(\\?))\2.)*?\1/,
});
const NumericValue = createToken({ name: "NumericValue", pattern: /\d+/ });
const RangeSeparator = createToken({ name: "RangeSeparator", pattern: /\.\.|-/ });
const RangeDelimiter = createToken({ name: "RangeDelimiter", pattern: /\s*,\s*/ });
const RangeAnnotation = createToken({ name: "RangeAnnotation", pattern: /[_$a-zA-Z][_$a-zA-Z0-9]*(?=\{)/ });
const LCurly = createToken({ name: "LCurly", pattern: /\{/ });
const RCurly = createToken({ name: "RCurly", pattern: /\}/ });
const Whitespace = createToken({ name: "Whitespace", pattern: /\s+/, group: Lexer.SKIPPED });

const tokens = [
	Whitespace,
	Key,
	Equals,
	StringValue,
	NumericValue,
	RangeSeparator,
	RangeDelimiter,
	RangeAnnotation,
	LCurly,
	RCurly
];

class BaseFenceParser extends CstParser {

	constructor() {
		super(tokens);
		const $ = this;

		$.RULE("metadata", () => {
			$.MANY(() => {
				$.SUBRULE($.keyValuePairs);
			});
			$.MANY2(() => {
				$.SUBRULE($.ranges);
			});
		});

		$.RULE("keyValuePairs", () => {
			$.CONSUME(Key);
			$.CONSUME(Equals);
			$.CONSUME(StringValue);
		});

		$.RULE("ranges", () => {
			$.OPTION(() => {
				$.CONSUME(RangeAnnotation);
			});
			$.CONSUME(LCurly);
			$.AT_LEAST_ONE({
				DEF: () => {
					$.SUBRULE($.range);
					$.OPTION2(() => {
						$.CONSUME(RangeDelimiter);
					});
				}
			});
			$.CONSUME(RCurly);
		});

		$.RULE("range", () => {
			$.CONSUME(NumericValue);
			$.OPTION(() => {
				$.CONSUME(RangeSeparator);
				$.CONSUME2(NumericValue);
			});
		});

		this.performSelfAnalysis();
	}
}

const lexer = new Lexer(tokens);
const parser = new BaseFenceParser();
const defaults = {
	rangeKey: "highlight"
};
const quotedStringRegex = /^['"`]/;

function processCst(cst, options) {
	if (!cst || !cst.children) {
		return {};
	}

	const result = {};

	cst.children.keyValuePairs?.filter(kvNode => !!kvNode.children).forEach((kvNode) => {
		const key = kvNode.children.Key[0].image;
		let value = kvNode.children.StringValue[0].image;
		if (quotedStringRegex.test(value)) {
			value = value.slice(1, -1);
		}
		if (typeof value === "string") {
			result[key] = value;
		}
	});

	cst.children.ranges?.filter(rangesNode => !!rangesNode.children).forEach((rangesNode) => {
		const annotation = rangesNode.children.RangeAnnotation ?
			rangesNode.children.RangeAnnotation[0].image : options.rangeKey;

		if (!result[annotation]) {
			result[annotation] = [];
		}

		rangesNode.children.range?.filter(rangeNode => !!rangeNode.children && rangeNode.children.NumericValue).forEach((rangeNode) => {
			const [b0, b1 = b0] = rangeNode.children.NumericValue.map(numericValue => Number(numericValue.image));
			const start = Math.min(b0, b1);
			const stop = Math.max(b0, b1);
			const size = stop - start + 1;
			const expandedRange = Array.from({ length: size }, (_, i) => i + start);
			expandedRange.forEach(value => result[annotation].push(value));
		});
	});

	return result;
}

class FenceParser {
	parse(text, options = defaults) {
		const lexingResult = lexer.tokenize(text);
		parser.input = lexingResult.tokens;
		const cst = parser.metadata();
		return processCst(cst, options);
	}
}

export {
	FenceParser as default
};
