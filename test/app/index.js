module.exports = require('../../index')({
  base: '.',
  include: [
    'controller',
    'util',
    'middleware'
  ],
  exclude: [
    'middleware'
  ],
  recursive: true
});
console.log(module.exports);
