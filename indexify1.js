const path = require('path');
const stack = require('callsite');
const fs = require('fs');

function indexify (config) {
  const callerPath = path.resolve(stack()[2].getFileName());
  const source = path.resolve(callerPath, '..', config.base);
  config.source = source;
  config.callerPath = callerPath;
  if (config.include) {
    config.includeSet = new Set(config.include.map(normalizePath.bind(null, source)));
  }
  config.excludeSet = new Set(config.exclude.map(normalizePath.bind(null, source)));
  if (config.selfExclude) {
    config.excludeSet.add(callerPath);
  }

  return analyze(source, config);
}

function normalizePath (source, filepath) {
  const resolved = path.resolve(source, filepath);
  if (!resolved.match(/\..+$'/)) {
    return resolved + '.js';
  } else {
    return resolved;
  }
}

function analyze (source, config) {
  const res = {};
  let files = fs.readdirSync(source);
  files
    .map(filepath => path.join(source, filepath))
    .forEach(filepath => {
      const checkRes = canRequire(filepath);
      if (checkRes.canRequire) {
        if ((!config.includeSet || config.includeSet.has(filepath)) && !config.excludeSet.has(filepath)) {
          res[path.basename(filepath).replace(/\.(?:js|json)$/, '')] = require(filepath);
        }
      } else {
        if (!checkRes.isFile && config.recursive) {
          res[path.basename(filepath)] = analyze(filepath, config);
        }
      }
    });

  return res;
}

function canRequire (filepath) {
  const basename = path.basename(filepath);
  if (basename.match(/\.(?:js|json)$/)) {
    return {
      isFile: true,
      canRequire: true
    };
  } else {
    const stat = fs.statSync(filepath);
    if (stat.isDirectory()) {
      try {
        const stat = fs.statSync(path.join(filepath, 'index.js'));
        if (stat.isFile()) {
          return {
            isFile: true,
            canRequire: true
          };
        }
      } catch (err) {
        // no such file: index.js
        return {
          isFile: false,
          canRequire: false
        };
      }
    } else {
      return {
        isFile: true,
        canRequire: false
      };
    }
  }
}

module.exports = indexify;
