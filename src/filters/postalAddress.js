var _ = require('lodash');

function parseAddress(addressArr) {
  return _.map(addressArr, function(item) {
    var obj = {};

    if (!_.isUndefined(item.gd$formattedAddress)) obj.address = item.gd$formattedAddress.$t;
    if (!_.isUndefined(item.gd$city)) obj.city = item.gd$city.$t;
    if (!_.isUndefined(item.gd$street)) obj.street = item.gd$street.$t;
    if (!_.isUndefined(item.gd$region)) obj.region = item.gd$region.$t;
    if (!_.isUndefined(item.gd$postcode)) obj.postcode = item.gd$postcode.$t;
    if (!_.isUndefined(item.gd$country)) obj.country = item.gd$country.$t;

    return obj;
  });
}

exports.visit = function (results, obj) {
  if (!_.isUndefined(obj.gd$structuredPostalAddress)) {
    results.postalAddress = parseAddress(obj.gd$structuredPostalAddress);
  }
};
