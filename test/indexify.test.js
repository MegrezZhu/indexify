const indexify = require('../index.js');
const assert = require('assert');
const _ = require('lodash');
const util = require('../util');

function checkProp (_obj, keys) {
  const obj = _.cloneDeep(_obj);
  keys.forEach(key => {
    assert(_.hasIn(obj, key), `missing prop ${key}`);
    util.unsetProp(obj, key instanceof Array ? key : key.split('.'));
  });

  for (const key of Object.keys(obj)) {
    assert(false, `unexpected prop ${key}`);
  }
}

describe('indexify', () => {
  it('default', () => {
    const res = indexify();
    checkProp(res, [
      'app',
      'mod1',
      ['util.test']
    ]);
  });

  it('include', () => {
    const res = indexify({
      base: '..',
      include: ['index.js', 'indexify.js']
    });
    checkProp(res, ['index', 'indexify']);
  });

  it('exclude', () => {
    const res = indexify({
      exclude: ['mod', 'app', 'util.test.js'],
      recursive: true
    });
    checkProp(res, ['mod1.c']);
  });

  it('base specified', () => {
    const res = indexify({
      base: './mod'
    });
    checkProp(res, ['a', 'b']);
  });

  it('recursive', () => {
    const res = indexify({
      recursive: true,
      include: ['mod', 'mod1', 'app']
    });
    checkProp(res, [
      'mod.a',
      'mod.b',
      'mod1',
      'app'
    ]);
  });

  it('merge', () => {
    let res = indexify({
      recursive: true,
      merge: true,
      exclude: ['app']
    });
    checkProp(res, [
      'a',
      'b',
      'c'
    ]);
  });

  it('example in readme', () => {
    const res = indexify({
      base: './app',
      include: [
        './controller',  // relative to base dir
        'util'
      ],
      exclude: [
        'controller/controllerA.js'
      ],
      recursive: true
    });
    checkProp(res, [
      'controller.controllerB',
      'util.funcA',
      'util.funcB',
      'util.funcC'
    ]);
  });
});
