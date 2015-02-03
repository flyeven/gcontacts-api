var _ = require('lodash');

exports.visit = function (results, obj) {
  if (!_.isUndefined(obj.gd$email)) {
    results.email = obj.gd$email.map(function (e) {
      return {address: e.address, type: e.rel};
    });
  }
};
