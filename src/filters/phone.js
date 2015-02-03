var _ = require('lodash');

exports.visit = function (results, obj) {
  if (!_.isUndefined(obj.gd$phoneNumber)) {
    results.phone = obj.gd$phoneNumber.map(function (e) {
      return {number: e.$t, type: e.rel};
    });
  }
};
