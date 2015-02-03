var path = require('path');

exports.visit = function (results, obj) {
  results.id = path.basename(obj.id.$t);
};
