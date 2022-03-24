import { createToken, Lexer } from 'chevrotain'

const Highlight = createToken({
	name: 'Highlight',
	pattern: /(?!{|})([-\d.]+)/,
})
const Pair = createToken({
	name: 'Pair',
	pattern: /[a-z][-\w\d]+=(["'`])((?:\\\1|(?:(?!\1)).)*)(\1)/,
})
const WhiteSpace = createToken({
	name: 'WhiteSpace',
	pattern: /\s+/,
	group: Lexer.SKIPPED,
})

const fenceTokens = [
	WhiteSpace,
	Highlight,
	Pair,
]

const FenceLexer = new Lexer(fenceTokens)

export default FenceLexer
