import { createToken, Lexer } from 'chevrotain'

const Highlight = createToken({
	name: 'Highlight',
	pattern: /(?!{|})([-\d.]+)/,
})
const DoubleQuotedPair = createToken({
	name: 'DoubleQuotedPair',
	pattern: /[a-z][-\w\d]+=(["])((?:\\\1|(?:(?!\1)).)*)(\1)/,
})
const SingleQuotedPair = createToken({
	name: 'SingleQuotedPair',
	pattern: /[a-z][-\w\d]+=(['])((?:\\\1|(?:(?!\1)).)*)(\1)/,
})
const BacktickedPair = createToken({
	name: 'BacktickedPair',
	pattern: /[a-z][-\w\d]+=([`])((?:\\\1|(?:(?!\1)).)*)(\1)/,
})
const WhiteSpace = createToken({
	name: 'WhiteSpace',
	pattern: /\s+/,
	group: Lexer.SKIPPED,
})

const fenceTokens = [
	WhiteSpace,
	Highlight,
	SingleQuotedPair,
	DoubleQuotedPair,
	BacktickedPair,
]

const FenceLexer = new Lexer(fenceTokens)

export default FenceLexer
