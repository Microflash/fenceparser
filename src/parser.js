const generateRange = (bounds) => {
	const size = bounds[1] - bounds[0] + 1
	return Array.from({ length: size }, (x, i) => i + bounds[0])
}

const parseRange = (token) => {
	if (token.includes('-')) {
		return generateRange(token.split('-').map((bound) => Number(bound)))
	}

	if (token.includes('..')) {
		return generateRange(token.split('..').map((bound) => Number(bound)))
	}

	return [Number(token)]
}

const PAIR_REGEX = /[a-z][-\w\d]+=(["'`])((?:\\\1|(?:(?!\1)).)*)(\1)/

const parsePair = (token) => {
	let [ , , value = ''] = token.match(PAIR_REGEX)
	return { 
		key: token.slice(0, token.indexOf(value) - 2),
		value
	}
}

class FenceParser {
	constructor() {
		this.input = []
	}

	metadata() {
		const metadata = {}
		const parsingErrors = []

		try {
			const pairs = this.input
				.filter(token => ['SingleQuotedPair', 'DoubleQuotedPair', 'BacktickedPair'].includes(token.tokenType.name))
			if (pairs && pairs.length) {
				for (const pair of pairs) {
					const { key, value } = parsePair(pair.image)
					metadata[key] = value
				}
			}

			const highlight = this.input
				.filter(token => token.tokenType.name === 'Highlight')
			if (highlight && highlight.length) {
				metadata['highlight'] = highlight
					.map(token => token.image)
					.flatMap(token => parseRange(token))
			}
		} catch (e) {
			parsingErrors.push(e)
		}

		return {
			metadata,
			parsingErrors
		}
	}
}

export default new FenceParser()
