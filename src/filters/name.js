var _ = require('lodash');

exports.visit = function (results, obj) {
  if (!_.isUndefined(obj.gd$name)) {
    results.name = {};
    if (!_.isUndefined(obj.gd$name.gd$fullName)) results.name.fullName = obj.gd$name.gd$fullName.$t;
    if (!_.isUndefined(obj.gd$name.gd$givenName)) results.name.givenName = obj.gd$name.gd$givenName.$t;
    if (!_.isUndefined(obj.gd$name.gd$familyName)) results.name.familyName = obj.gd$name.gd$familyName.$t;
  }
};
