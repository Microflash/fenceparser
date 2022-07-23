import { createToken, Lexer } from 'chevrotain'

const Range = createToken({
	name: 'Range',
	pattern: /([\w]*)({[-.,\d\s]+})/,
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
	Pair,
	Range
]

const FenceLexer = new Lexer(fenceTokens)

export default FenceLexer
