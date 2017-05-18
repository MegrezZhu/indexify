const indexify = require('../index.js');
const assert = require('assert');
const _ = require('lodash');

function checkProp (obj, keys) {
  keys.forEach(key => {
    assert(_.hasIn(obj, key), `missing prop ${key}`);
    _.unset(obj, key);
    const res = key.match(/(.+)\..+$/);
    if (res) {
      if (Object.keys(_.get(obj, res[1])).length === 0) {
        _.unset(obj, res[1]);
      }
    }
  });

  for (const key of Object.keys(obj)) {
    assert(false, `unexpected prop ${key}`);
  }
}

describe('indexify', () => {
  it('#1', () => {
    const res = indexify();
    checkProp(res, ['mod1']);
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

  it('#4', () => {
    const res = indexify({
      recursive: true
    });
    checkProp(res, [
      'mod.a',
      'mod.b',
      'mod1'
    ]);
  });
});
