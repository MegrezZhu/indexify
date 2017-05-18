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
  it('default', () => {
    const res = indexify();
    checkProp(res, ['mod1']);
  });

  it('include', () => {
    const res = indexify({
      base: '..',
      include: ['index', 'indexify']
    });
    checkProp(res, ['index', 'indexify']);
  });

  it('exclude', () => {
    const res = indexify({
      exclude: ['mod/a'],
      recursive: true
    });
    checkProp(res, ['mod1', 'mod.b']);
  });

  it('base specified', () => {
    const res = indexify({
      base: './mod'
    });
    checkProp(res, ['a', 'b']);
  });

  it('recursive', () => {
    const res = indexify({
      recursive: true
    });
    checkProp(res, [
      'mod.a',
      'mod.b',
      'mod1'
    ]);
  });

  it('merge', () => {
    const res = indexify({
      recursive: true,
      merge: true
    });
    checkProp(res, [
      'a',
      'b',
      'c'
    ]);
  });
});
