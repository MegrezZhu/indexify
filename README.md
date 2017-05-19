[![npm version](https://badge.fury.io/js/require-indexify.svg)](https://github.com/MegrezZhu/indexify)
[![Build Status](https://travis-ci.org/MegrezZhu/indexify.svg?branch=master)](https://travis-ci.org/MegrezZhu/indexify)
[![Known Vulnerabilities](https://snyk.io/test/npm/require-indexify/badge.svg)](https://snyk.io/test/npm/require-indexify)


## Description
A tool to automatically require modules in a directory.

## Installation
`$ npm i require-indexify`

## Usage
Say we have a diretory structure in our node project:
* app
    * controller
        * controllerA.js
        * controllerB.js
    * midlleware
        * middlewareA.js
        * middlewareB.js
    * util
        * funcA.js
        * funcB.js
        * ...
        * index.js
	* index.js

In general, `app/util/index.js` may be like this:
```javascript
module.exports = {
  funcA: require('./funcA.js'),
  funcB: require('./funcB.js'),
  // ... and other modules in app/util
}
```
And, we have to manually add `require` when a new `.js` file is added.

Now with `require-inedxify`, `app/util/index.js` is much simpler:
```javascript
module.exports = require('require-indexify')();
```

## More options
**indexify(basePath)**
```javascript
module.exports = indexify('./utl');
// or
module.exports = indexify(__dirname);
```
`basePath` can be either relative or absolute, default to `'.'`.

**indexify(config)**
`config.base`: equivalent to basePath above.

`config.include`: an array explicitly specifying which module(s) to require. Default to `none`, all modules included.

`config.exclude`: an array explicitly specifying which module(s) not to require. Default to `[]`, none is excluded.

`config.recursive`: whether to traverse the directory recursively requiring all valid modules. If a directory contains an `index.js`, it will not be further traversed. Default to `false`.

`config.selfExclude`: whether to exclude the file that is calling `indexify`. Default to `true`. This option is usefull since, in generall, we only want the `index.js` file to load its sibling modules.

`config.merge`: whether to merge all modules(`Object.assign` used). Default to `false`. Useful to require `*.config.js` and merge them into one.

example `app/index.js`:
```javascript
module.exports = indexify({
  base: '.',
  include: [
    './controller',  // relative to base dir
    'util'
  ],
  exclude: [ 
    'controller/controllerA.js'
  ],
  recursive: true
});
```