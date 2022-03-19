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

const parse = (text) => {
	const lexingResult = FenceLexer.tokenize(text)

	const metadata = {}
	const highlight = []
	let hightlightRange = false
	let interim = []

	for (const token of lexingResult.tokens) {
		if (token.tokenType.name === 'Word') {
			metadata[token.image] = true
		} else if (token.tokenType.name === 'MapEntry') {
			const keyVal = token.image.split('=')
			metadata[keyVal[0]] = keyVal[1].slice(1, -1)
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

	metadata['highlight'] = highlight.flat()

	return metadata
}

export default parse
