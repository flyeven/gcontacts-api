var _ = require('lodash');
var moment = require('moment');

exports.visit = function (results, obj) {
  if (!_.isUndefined(obj.gContact$birthday)) {
    results.birthday = moment(obj.gContact$birthday.when, 'YYYY-MM-DDTHH:mm:ss.SSSZ').toDate();
  }
};
