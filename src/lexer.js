import { createToken, Lexer } from 'chevrotain'

const lcurlyMatcher = (text, startOffset) => /^\{/.match(text)

const WhiteSpace = createToken({
	name: 'WhiteSpace',
	pattern: /\s+/,
	group: Lexer.SKIPPED,
})
const MapEntry = createToken({
	name: 'MapEntry',
	pattern: /([a-zA-Z]\w+)='.*?'/,
})
const DashRange = createToken({
	name: 'DashRange',
	pattern: /(\d+)-(\d+)/,
})
const DotRange = createToken({
	name: 'DotRange',
	pattern: /(\d+)\.\.(\d+)/,
})
const Word = createToken({
	name: 'Word',
	pattern: /[a-zA-Z]\w+/,
})
const NumericLiteral = createToken({
	name: 'NumericLiteral',
	pattern: /\d+/,
})
const LCurly = createToken({
	name: 'LCurly',
	pattern: /\{/,
})
const RCurly = createToken({
	name: 'RCurly',
	pattern: /\}/,
})
const Comma = createToken({
	name: 'Comma',
	pattern: /,/,
})

const allTokens = [
	WhiteSpace,
	MapEntry,
	DashRange,
	DotRange,
	Word,
	NumericLiteral,
	LCurly,
	RCurly,
	Comma,
]

export default new Lexer(allTokens)
