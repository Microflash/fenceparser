import FenceLexer from './lexer.js'

const generateRange = (bounds) => {
	const size = bounds[1] - bounds[0] + 1
	return Array.from({ length: size }, (x, i) => i + bounds[0])
}

const parseRange = (tokenType, tokenValue) => {
	if (tokenType === 'DashRange') {
		return generateRange(tokenValue.split('-').map((bound) => Number(bound)))
	}

	if (tokenType === 'DotRange') {
		return generateRange(tokenValue.split('..').map((bound) => Number(bound)))
	}

	if (tokenType === 'NumericLiteral') {
		return [Number(tokenValue)]
	}
}

const KEY_VALUE_REGEX = /^\s*([\w\.\-]+)\s*=\s*(.*)?\s*$/
const LINEBREAK_REGEX = /\\n/gm
const VALUE_CLEANUP_REGEX = /(^['"]|['"]$)/g

const parseObject = (text) => {
	let [, key, value = ''] = text.match(KEY_VALUE_REGEX)

	// expand newlines in quoted values
	const len = value ? value.length : 0
	if (len > 0 && value.charAt(0) === '"' && value.charAt(len - 1) === '"') {
		value = value.replace(LINEBREAK_REGEX, '\n')
	}
	// remove any surrounding quotes and extra spaces
	value = value.replace(VALUE_CLEANUP_REGEX, '').trim()

	const parsedObject = {}
	
	try {
		parsedObject[key] = JSON.parse(value)
	} catch (e) {
		parsedObject[key] = value
	}

	return parsedObject
}

const parse = (text) => {
	const lexingResult = FenceLexer.tokenize(text)

	const parsingErrors = []
	let metadata = {}
	const highlight = []

	try {
		let hightlightRange = false
		let interim = []

		for (const token of lexingResult.tokens) {
			if (token.tokenType.name === 'Word') {
				metadata[token.image] = true
			} else if (token.tokenType.name === 'KeyValuePair') {
				metadata = { ...metadata, ...parseObject(token.image) }
			} else {
				if (token.tokenType.name === 'LCurly') {
					hightlightRange = true
					continue
				}
	
				const isRange =
					token.tokenType.name === 'DashRange' ||
					token.tokenType.name === 'DotRange' ||
					token.tokenType.name === 'NumericLiteral'
	
				if (hightlightRange && isRange) {
					const parsedRange = parseRange(token.tokenType.name, token.image)
					interim = [...interim, ...parsedRange]
				}
	
				if (token.tokenType.name === 'RCurly') {
					if (hightlightRange) {
						highlight.push(interim)
						hightlightRange = false
					}
	
					interim = []
					continue
				}
			}
		}
	} catch (e) {
		parsingErrors.push(e)
	}

	if (highlight.length) {
		metadata['highlight'] = highlight.flat()
	}

	return {
		metadata,
		lexingErrors: lexingResult.errors,
		parsingErrors: parsingErrors,
	}
}

export default parse
