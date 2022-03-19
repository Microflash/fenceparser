import FenceLexer from './lexer.js'
import parse from './parser.js'

const lex = (text) => FenceLexer.tokenize(text)

export { lex, parse }
export default parse
