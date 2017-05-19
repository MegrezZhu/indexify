const util = require('../util');
const assert = require('assert');
const _ = require('lodash');

describe('util', () => {
  describe('#unsetProp', () => {
    let obj;

    beforeEach(() => {
      obj = {
        a: 1,
        b: {
          a: 1,
          b: 2
        }
      };
    });

    afterEach(() => {
      console.log(obj);
    });

    it('no cascading', () => {
      [
        'a'
      ]
        .forEach(path => util.unsetProp(obj, path.split('.')));
      has(obj, 'b');
      notHas(obj, 'a');
    });

    it('cascading', () => {
      [
        'b.a',
        'b.b'
      ]
        .forEach(path => util.unsetProp(obj, path.split('.')));
      has(obj, 'a');
      notHas(obj, 'b');
    });

    it('no such prop', () => {
      [
        'b.a',
        'b.b',
        'such.an.amazing.prop'
      ]
        .forEach(path => util.unsetProp(obj, path.split('.')));
      has(obj, 'a');
      notHas(obj, 'b');
    });
  });
});

function has (obj, path) {
  assert(_.hasIn(obj, path), `missing prop ${path}`);
}

function notHas (obj, path) {
  assert(!_.hasIn(obj, path), `unexpected prop ${path}`);
}