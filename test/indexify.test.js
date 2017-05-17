const indexify = require('../index.js');
const assert = require('assert');
const _ = require('lodash');

function checkProp (obj, keys) {
  _.forEachRight(keys, key => {
    assert(obj[key], `missing prop ${key}`);
    delete obj[key];
  });

  for (const key of Object.keys(obj)) {
    assert(false, `unexpected prop ${key}`);
  }
}

describe('indexify', () => {
  it('#1', () => {
    const res = indexify();
    checkProp(res, []);
  });

  it('#2', () => {
    const res = indexify({
      base: '..',
      include: ['index', 'indexify']
    });
    checkProp(res, ['index', 'indexify']);
  });

  it('#3', () => {
    const res = indexify({
      base: './mod'
    });
    checkProp(res, ['a', 'b']);
  });
});
