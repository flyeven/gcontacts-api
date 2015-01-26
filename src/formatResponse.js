var path = require('path');
var moment = require('moment');

module.exports = function (obj) {
  return {
    id: path.basename(obj.id.$t),
    updated: moment(obj.updated.$t, 'YYYY-MM-DDTHH:mm:ss.SSSZ').toDate(),
    category: obj.category,
    title: obj.title.$t,
    name: {
      fullName: obj.gd$name.gd$fullName.$t,
      givenName: obj.gd$name.gd$givenName.$t,
      familyName: obj.gd$name.gd$familyName.$t
    },
    email: obj.gd$email
  };
};
