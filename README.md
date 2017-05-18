[![npm version](https://badge.fury.io/js/require-indexify.svg)](https://github.com/MegrezZhu/indexify)
[![Build Status](https://travis-ci.org/MegrezZhu/indexify.svg?branch=master)](https://travis-ci.org/MegrezZhu/indexify)
[![Known Vulnerabilities](https://snyk.io/test/npm/require-indexify/badge.svg)](https://snyk.io/test/npm/require-indexify)


## Description
A tool to automatically require modules in a directory.

## usage
```javascript
const indexify = require('require-indexify');
module.exports = indexify({
  base: './test/mod'
});
```
```javascript
module.exports = indexify({
  base: './test/mod',
  include: [
    './a.js',
    './ok'
  ],
  exclude: [
    './ok/b.js'
  ],
  recursive: true,      // recursively traverse the folder. 
                        //    If a folder contains an index.js, it will not be further traversed.
  merge: true           // all 1st-level loaded module is merged
});
```