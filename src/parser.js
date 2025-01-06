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

class FenceParser {
	parse(text, options = defaults) {
		const lexingResult = lexer.tokenize(text);
		parser.input = lexingResult.tokens;
		const cst = parser.metadata();
		// TODO: process this CST
	}
}

export {
	FenceParser as default
};
