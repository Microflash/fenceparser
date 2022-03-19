# fenceparser

A metadata parser for code-fences in markdown

## Contents

- [Contents](#contents)
- [What's this?](#whats-this)
- [Install](#install)
- [Use](#use)
- [API](#api)
- [License](#license)

## What's this?

Many markdown processors can parse the language token associated with a codefence. `fenceparser` is meant for parsing other metadata besides language token. It supports 

- boolean flags (e.g., `showCopy`)
- line highlight ranges, (e.g., `{1} {3, 7} {9-11, 88} {90, 101..167}`) and 
- arbitrary key-value data (e.g., `caption='Hello, World'`)

## Install

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).

In Node.js (version 12.20+, 14.14+, or 16.0+), install with [npm](https://docs.npmjs.com/cli/install):

```sh
npm install @microflash/fenceparser
```

## Use

Say, you have the following code fence

```
```js showCopy {1} {3, 7} {9-11, 88} {90, 101..112} caption='Hello, World'
```

[remark](https://github.com/remarkjs/remark) will provide the `meta` and `lang` for the above code fence.

```json
{
  "lang": "js",
  "meta": "showCopy {9-11, 90, 101..112} caption='Hello, World!'"
}
```

Use the `fenceparser` to parse the `meta` as follows.

```js
import parse from '@microflash/fenceparser'

console.log(parse("showCopy {1} {3, 7} {9-11, 88} {90, 101..112} caption='Hello, World'"))
```

Running the above example yields.

```js
{
  showCopy: true,
  caption: 'Hello, World',
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

## License

[Apache License, Version 2.0](./LICENSE.txt)
