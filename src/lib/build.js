var xml = require('xml');
var _ = require('lodash');

var GOOGLE_SCHEMA = 'http://schemas.google.com/g/2005#';

var atomDefaults = {
  'atom:entry': [
    {
      _attr: {'xmlns:atom': 'http://www.w3.org/2005/Atom', 'xmlns:gd': 'http://schemas.google.com/g/2005'}
    },
    {
      'atom:category': {
        _attr: {scheme: 'http://schemas.google.com/g/2005#kind', term: 'http://schemas.google.com/contact/2008#contact'}
      }
    },
  ]
};


function attachName(d, obj) {
  _.forOwn(obj, function(num, key) {
    if (key === 'name') {
      d['atom:entry'].push({
        'gd:name': [
          {'gd:givenName': num.firstName},
          {'gd:familyName': num.lastName},
          {'gd:fullName': num.firstName + num.lastName}
        ]
      });
    }
  });
}


function attachEmails(d, obj) {
  _.forOwn(obj, function(num, key) {
    if (key === 'email') {
      _.forOwn(num, function(v, k) {
        d['atom:entry'].push({
          'gd:email': {
            _attr: {
              rel: GOOGLE_SCHEMA + k,
              primary: v.primary,
              address: v.address
            }
          }
        });
      });
    }
  });
}


function attachPhones(d, obj) {
  _.forOwn(obj, function(num, key) {
    if (key === 'phone') {
      _.forOwn(num, function(v, k) {
        d['atom:entry'].push({
          'gd:phoneNumber': [{
            _attr: {
              rel: GOOGLE_SCHEMA + k,
              primary: v.primary
            }
          },
          v.number
          ]
        });
      });
    }
  });
}


function generateContactAsXML(obj) {
  attachName(atomDefaults, obj);
  attachEmails(atomDefaults, obj);
  attachPhones(atomDefaults, obj);
  
  var contact = [];
  contact.push(atomDefaults);
  return xml(contact, true);
}


module.exports = generateContactAsXML;
