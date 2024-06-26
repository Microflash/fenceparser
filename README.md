# fenceparser

[![npm](https://img.shields.io/npm/v/@microflash/fenceparser)](https://www.npmjs.com/package/@microflash/fenceparser)
[![regression](https://github.com/Microflash/fenceparser/actions/workflows/regression.yml/badge.svg)](https://github.com/Microflash/fenceparser/actions/workflows/regression.yml)
[![license](https://img.shields.io/npm/l/@microflash/fenceparser)](./LICENSE.md)

A metadata parser for code fences in markdown

- [What’s this?](#whats-this)
- [Install](#install)
- [Use](#use)
- [API](#api)
	- [Options](#options)
	- [Syntax](#syntax)
- [Examples](#examples)
	- [Example: single range](#example-single-range)
	- [Example: multiple ranges](#example-multiple-ranges)
	- [Example: ranges with custom annotations](#example-ranges-with-custom-annotations)
	- [Example: key-value pairs](#example-key-value-pairs)
	- [Example: customizing the default range's key](#example-customizing-the-default-ranges-key)
- [Development](#development)
- [License](#license)

## What’s this?

Many markdown processors can parse the language token associated with a code fence. `fenceparser` is meant for parsing other metadata besides language token. It supports 

- ranges, (e.g., `{1} {3, 7} ins{9..11, 88} del{90, 101..167}`) and 
- key-value pairs (e.g., `caption='Hello, World'`)

## Install

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).

In Node.js (version 12.20+, 14.14+, or 16.0+), install with [npm](https://docs.npmjs.com/cli/install):

```sh
npm install @microflash/fenceparser
```

In Deno, with [esm.sh](https://esm.sh/):

```js
import fenceparser from "https://esm.sh/@microflash/fenceparser";
```

In browsers, with [esm.sh](https://esm.sh/):

```html
<script type="module">
  import fenceparser from "https://esm.sh/@microflash/fenceparser?bundle";
</script>
```

## Use

Say, you have the following code fence

```
```js {1} {3, 7} {9..11, 88} {90, 101..112} text-color='--text-default' syntax_theme="nord" css=`{ *: { display: none }}`
```

[remark](https://github.com/remarkjs/remark) will provide the `meta` and `lang` for the above code fence.

```json
{
  "lang": "js",
  "meta": "{1} {3, 7} {9..11, 88} {90, 101..112} text-color='--text-default' syntax_theme=\"nord\" css=`{ *: { display: none }}`"
}
```

Use the `fenceparser` to parse the `meta` as follows.

```js
import FenceParser from "@microflash/fenceparser";

const parser = new FenceParser();
console.log(parser.parse("{1} {3, 7} {9..11, 88} {90, 101..112} text-color='--text-default' syntax_theme=\"nord\" css=`{ *: { display: none }}`"));
```

Running the above example yields.

```js
{
  'text-color': '--text-default',
  syntax_theme: 'nord',
  css: '{ *: { display: none }}',
  highlight: [
    1, 3, 7, 9, 10, 11, 88,  
  ],
  ins: [
    90, 101, 102, 103, 104, 105,
    106, 107, 108, 109, 110, 111, 
    112,
  ]
}
```

## API

The default export is `FenceParser` class.

### Options

The following options are available. All of them are optional.

- `rangeKey` (default: `highlight`): specifies the key for the default range of numbers

### Syntax

#### Key-value pairs

- The key and value must be separated by equality sign `=`.
- The value must be wrapped within single-quotes `'`, double-quotes `"` or backticks `` ` ``.
- The key can contain letters, digits, underscore, and hyphen.

#### Ranges

- A range can be a single number, or a pair of numbers denoting the start and end values separated by double-dots `..`.
- A range must be specified in curly braces.
- Multiple ranges can be specified in a single pair of curly braces. They should be separated by comma `,`.
- Ranges can also be annotated; the annotation should be prefixed before the starting curly brace. The default annotation is `highlight`. You can customize this annotation by passing `rangeKey` value in the parser options.
- Ranges will be grouped in a single array by their annotations.

## Examples

### Example: single range

```js
import FenceParser from "@microflash/fenceparser";

const parser = new FenceParser();
console.log(parser.parse("{100}"));
```

Running the above example yields.

```js
{
  highlight: [
    100,
  ]
}
```

### Example: multiple ranges

```js
import FenceParser from "@microflash/fenceparser";

const parser = new FenceParser();
console.log(parse("{3, 7} {9..11, 101..105}"));
```

Running the above example yields.

```js
{
  highlight: [
    1, 3, 7, 9, 10, 11,
    101, 102, 103, 104, 105,
  ],
}
```

### Example: ranges with custom annotations


```js
import FenceParser from "@microflash/fenceparser";

const parser = new FenceParser();
console.log(parse("{3, 7} ins{9..11, 13} del{101..105}"));
```

Running the above example yields.

```js
{
  highlight: [
    3, 7,
  ],
  ins: [
    9, 10, 11, 13,
  ],
  del: [
    101, 102, 103, 104, 105,
  ],
}
```

### Example: key-value pairs

```js
import FenceParser from "@microflash/fenceparser";

const parser = new FenceParser();
console.log(parse("data-theme='synthwave' callback=`(code) => copyToClipboard(code)`"));
```

Running the above example yields.

```js
{
  'data-theme': 'synthwave',
  callback: '(code) => copyToClipboard(code)',
}
```

### Example: customizing the default range's key

```js
import FenceParser from "@microflash/fenceparser";

const parser = new FenceParser({ rangeKey: "mark" });
console.log(parser.parse("{100}"));
```

Running the above example yields.

```js
{
  mark: [
    100,
  ]
}
```

Check the [fixtures](./test/fixtures/) for more examples on the syntax.

## Development

Any changes in the parser should have corresponding tests.

Run the tests with the following command.

```sh
pnpm test
```

## License

[MIT](./LICENSE.md)
