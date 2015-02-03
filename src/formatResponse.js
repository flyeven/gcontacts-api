var _ = require('lodash');
var filters = require('./filters');

module.exports = function (obj) {
  var results = {};

  _.forOwn(filters, function (filter) {
    filter.visit(results, obj);
  });

  return results;
};
