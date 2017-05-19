const indexify = require('./indexify');

// TO-DO: 增加include以及重命名选项
const baseConfig = {
  base: '.',
  include: null,
  exclude: null,
  // priority: [],             // loading order, first to be loaded first
  selfExclude: true,           // caller file is excluded by default
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
