const path = require('path');
const stack = require('callsite');
const fs = require('fs');
const assert = require('assert');
const glob = require('glob');
const _ = require('lodash');

function indexify (config) {
  const callerPath = path.resolve(stack()[2].getFileName());
  const source = path.resolve(callerPath, '..', config.base);
  config.source = source;
  config.callerPath = callerPath;
  config.tree = {};
  if (config.include) {
    config.include.forEach(pattern => {
      assert(pattern.indexOf('/'), 'only the include/exclude of 1st-level subdiretory/file is supported.');
      // if (config.recursive && !pattern.match(/\.(?:js|json)$/)) {
      //   pattern += '/**/*.+(json|js)';
      // }
      if (!pattern.match(/\.(?:js|json)$/)) {
        pattern += '/**/*.+(json|js)';
      }
      glob.sync(pattern, {cwd: source})
        .forEach(filepath => {
          _.set(config.tree, filepath.split('/'), 1);
        });
    });
  } else {
    glob.sync('**/+(*.js|*.json)', {cwd: source})
      .forEach(filepath => {
        _.set(config.tree, filepath.split('/'), 1);
      });
  }
  if (config.exclude) {
    // TO-DO 指定排除a/b/c.js
    config.exclude.forEach(pattern => {
      assert(pattern.indexOf('/'), 'only the include/exclude of 1st-level subdiretory/file is supported.');
      _.unset(config.tree, pattern);
    });
  }

  const res = analyze(source, config.tree, config);
  if (!config.merge) {
    return res;
  } else {
    const _res = {};
    for (const value of Object.values(res)) {
      Object.assign(_res, value);
    }
    return _res;
  }
}

function analyze (source, tree, config) {
  const res = {};

  for (const [key, value] of Object.entries(tree)) {
    if (value === 1) {
      // file
      const _path = path.resolve(source, key);
      if (config.selfExclude && _path === config.callerPath) continue;
      res[key.replace(/\..+$/, '')] = require(_path);
    } else {
      // folder
      if (value['index.js'] === 1) {
        const _path = path.resolve(source, key, 'index.js');
        if (config.selfExclude && _path === config.callerPath) continue;
        res[key] = require(_path);
      } else {
        if (config.recursive) {
          res[key] = analyze(path.resolve(source, key), value, config);
        }
      }
    }
  }

  return res;
}

module.exports = indexify;
