const indexify = require('./indexify1');

// TO-DO: 增加include以及重命名选项
const baseConfig = {
  base: '.',
  include: null,
  exclude: [],
  // priority: [],             // loading order, first to be loaded first
  selfExclude: true,           // caller file is excluded by default
  directory: true,             // whether to load modules in direct sub-directory
  // recursive: false,         // scan recursively
  merge: false                 // whether to merge all module
};

module.exports = (_config) => {
  if (typeof _config === 'string' || _config instanceof String) {
    _config = {
      base: _config
    };
  }

  const config = {};
  Object.assign(config, baseConfig, _config);

  return indexify(config);
};
