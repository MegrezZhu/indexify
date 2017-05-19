const _ = require('lodash');

function unsetProp (obj, path) {
  while (true) {
    if (!_.hasIn(obj, path)) break;
    _.unset(obj, path);
    path.pop();
    if (path.length) {
      if (Object.keys(_.get(obj, path)).length) {
        break;
      }
    } else {
      break;
    }
  }
}

module.exports = {
  unsetProp
};
