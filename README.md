# fenceparser

[![npm](https://img.shields.io/npm/v/@microflash/fenceparser)](https://www.npmjs.com/package/@microflash/fenceparser)
[![license](https://img.shields.io/npm/l/@microflash/fenceparser)](./LICENSE.txt)

A metadata parser for code-fences in markdown

## Contents

- [Contents](#contents)
- [What's this?](#whats-this)
- [Install](#install)
- [Use](#use)
- [API](#api)
	- [Syntax](#syntax)
- [Development](#development)
- [License](#license)

## What's this?

Many markdown processors can parse the language token associated with a codefence. `fenceparser` is meant for parsing other metadata besides language token. It supports 

- line highlight ranges, (e.g., `{1} {3, 7} {9-11, 88} {90, 101..167}`) and 
- key-value pairs (e.g., `caption='Hello, World'`)

## Install

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).

In Node.js (version 12.20+, 14.14+, or 16.0+), install with [npm](https://docs.npmjs.com/cli/install):

```sh
npm install @microflash/fenceparser
```

## Use

Say, you have the following code fence

```
```js {1} {3, 7} {9-11, 88} {90, 101..112} text-color='--text-default' syntax_theme="nord" css=`{ *: { display: none }}`
```

[remark](https://github.com/remarkjs/remark) will provide the `meta` and `lang` for the above codefence.

```json
{
  "lang": "js",
  "meta": "{1} {3, 7} {9-11, 88} {90, 101..112} text-color='--text-default' syntax_theme=\"nord\" css=`{ *: { display: none }}`"
}
```

Use the `fenceparser` to parse the `meta` as follows.

```js
import parse from '@microflash/fenceparser'

console.log(parse("{1} {3, 7} {9-11, 88} {90, 101..112} text-color='--text-default' syntax_theme=\"nord\" css=`{ *: { display: none }}`"))
```

Running the above example yields.

```js
{
  'text-color': '--text-default',
  syntax_theme: 'nord',
  css: '{ *: { display: none }}',
  highlight: [
      1,   3,   7,   9,  10,  11,
     88,  90, 101, 102, 103, 104,
    105, 106, 107, 108, 109, 110,
    111, 112
  ]
}
```

## API

The default export is `parse`.

### Syntax

- For key-value pairs, the key and value must be separated by `=`, and the must be wrapped within single-quotes `'`, double-quotes `"` or backticks `\``.
- To initialize the `highlight` object, provide comma separated numbers or ranges wrapped within the curly braces. 
- A range must be separated by a hyphen `-` or double-dots `..`.
- Multiple ranges will be merge together in a single array. 

Check the [fixtures](./test/fixtures.js) for examples on the syntax.

## Development

Any changes in the lexer or parser should have companion tests.

Run the tests with the following command.

```sh
NODE_OPTIONS=--experimental-vm-modules npm test
```

## License

[Apache License, Version 2.0](./LICENSE.txt)
