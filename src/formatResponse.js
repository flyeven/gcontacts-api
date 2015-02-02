var path = require('path');
var moment = require('moment');
var _ = require('lodash');


function formatDate (date) {
  return moment(date, 'YYYY-MM-DDTHH:mm:ss.SSSZ').toDate();
};


function formatAddress (array) {
  var address;
  address = _.map(array, function(item) {
    return {
      address: _.isUndefined(item.gd$formattedAddress) ? '' : item.gd$formattedAddress.$t,
      city: _.isUndefined(item.gd$city) ? '' : item.gd$city.$t,
      street: _.isUndefined(item.gd$street) ? '' : item.gd$street.$t,
      region: _.isUndefined(item.gd$region) ? '' : item.gd$region.$t,
      postCode: _.isUndefined(item.gd$postcode) ? '' : item.gd$postcode.$t,
      country: _.isUndefined(item.gd$country) ? '' : item.gd$country.$t,
    };
  });
  return address;
};


// Depends how many fields we want to expose. These are the "defaults" on gmail UI.
module.exports = function (obj) {
  return {
    id: path.basename(obj.id.$t),
    etag: obj.gd$etag,
    updated: formatDate(obj.updated.$t),
    category: obj.category,
    title: obj.title.$t,
    name: {
      fullName: _.isUndefined(obj.gd$name) ||  _.isUndefined(obj.gd$name.gd$fullName) ? '' : obj.gd$name.gd$fullName.$t,
      givenName: _.isUndefined(obj.gd$name) || _.isUndefined(obj.gd$name.gd$givenName) ? '' : obj.gd$name.gd$givenName.$t,
      familyName: _.isUndefined(obj.gd$name) ||  _.isUndefined(obj.gd$name.gd$familyName)? '' : obj.gd$name.gd$familyName.$t
    },
    email: obj.gd$email,
    phone: obj.gd$phoneNumber,
    postalAddress: _.isUndefined(obj.gd$structuredPostalAddress) ? [] : formatAddress(obj.gd$structuredPostalAddress),
    birthday: _.isUndefined(obj.gContact$birthday) ? '' : formatDate(obj.gContact$birthday.when)
  };
};
