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