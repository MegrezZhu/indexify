const path = require('path');
const fs = require('fs');
const stack = require('callsite');

module.exports = _config => {
  if (_config instanceof String || typeof _config === 'string') {
    _config = {
      base: _config
    };
  }
  const result = {};
  // TO-DO: 增加include以及重命名选项
  const config = {
    base: '.',
    include: null,
    exclude: [],
    // priority: [],             // loading order, first to be loaded first
    selfExclude: true,           // caller file is excluded by default
    directory: true,             // whether to load modules in direct sub-directory
    // recursive: false,         // scan recursively
    merge: false                 // whether to merge all module
  };
  Object.assign(config, _config);

  const callerPath = path.resolve(stack()[1].getFileName());
  const source = path.resolve(callerPath, '..', config.base);
  let files = fs.readdirSync(source).map(filename => filename.replace(/\.js$/, ''));
  config.exclude = config.exclude.map(filename => filename.replace(/\.js$/, ''));

  const nameMap = new Map();
  if (config.include) {
    config.include.forEach(setting => {
      if (setting instanceof Array) {
        nameMap.set(setting[0].replace(/\.js$/, ''), setting[1]);
      } else {
        nameMap.set(setting.replace(/\.js$/, ''), setting);
      }
    });
  } else {
    files.forEach(filename => {
      nameMap.set(filename, filename);
    });
  }

  if (config.selfExclude) {
    config.exclude.push(path.basename(callerPath, '.js'));
  }
  config.exclude.forEach(filename => {
    nameMap.delete(filename);
  });

  files
    .filter(filename => config.directory || !fs.lstatSync(path.join(source, filename)).isDirectory())   // exclude
    .forEach(filename => {
      const name = nameMap.get(filename);
      if (name) {
        try {
          // ok.
          result[name] = require(path.join(source, filename));
        } catch (err) {
          // maybe there isn't a index.js
        }
      }
    });

  if (config.merge) {
    const merged = {};
    for (const value of Object.values(result)) {
      Object.assign(merged, value);
    }
    return merged;
  } else {
    return result;
  }
};
