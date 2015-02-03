var moment = require('moment');

exports.visit = function (results, obj) {
  results.updated = moment(obj.updated.$t, 'YYYY-MM-DDTHH:mm:ss.SSSZ').toDate();
};
