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
				.filter(token => token.tokenType.name === 'Pair')
			if (pairs && pairs.length) {
				for (const pair of pairs) {
					const { key, value } = parsePair(pair.image)
					metadata[key] = value
				}
			}

			const ranges = this.input
				.filter(token => token.tokenType.name === 'Range')
			if (ranges && ranges.length) {
				for (const range of ranges) {
					const startIndex = range.image.indexOf('{')
					const stopIndex = range.image.indexOf('}')
					const key = range.image.substring(0, startIndex) || 'highlight'
					const values = range.image.substring(startIndex + 1, stopIndex).split(',').flatMap(token => parseRange(token.trim()))
					const rangeValues = metadata[key] || []
					metadata[key] = [...rangeValues, ...values]
				}
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
