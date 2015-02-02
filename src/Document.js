var xmlbuilder = require('xmlbuilder');
var _ = require('lodash');


function Document () {

  this._root = xmlbuilder.create('atom:entry');

  this._root.att('xmlns:atom', 'http://www.w3.org/2005/Atom');
  this._root.att('xmlns:gd', 'http://schemas.google.com/g/2005');

  this._root.ele('atom:category', {
    scheme: 'http://schemas.google.com/g/2005#kind',
    term: 'http://schemas.google.com/contact/2008#contact'
  });
}


Document.prototype.email = function (obj) {
  var ele;

  obj = _.defaults(obj, {
    primary: false,
    rel: 'home'
  });

  ele = this._root.ele('gd:email', {
    address: obj.address,
    rel: 'http://schemas.google.com/g/2005#' + obj.rel
  });

  if (obj.primary) ele.att('primary', 'true');
  if (obj.displayName) ele.att('displayName', obj.displayName);

  return ele;
};


Document.prototype.name = function (obj) {
  var ele;

  ele = this._root.ele('gd:name');

  obj = _.defaults(obj, {
    fullName: _.filter(obj, _.isString).join(' ')
  });

  _.forOwn(obj, function(value, key) {
    ele.ele('gd:' + key, value);
  });

  return ele;
};


Document.prototype.phone = function (obj) {
  var ele;

  obj = _.defaults(obj, {
    primary: false,
    rel: 'home'
  });

  ele = this._root.ele('gd:phoneNumber', {
    rel: 'http://schemas.google.com/g/2005#' + obj.rel
  }, obj.phoneNumber);

  if (obj.primary) ele.att('primary', 'true');

  return ele;
};


Document.prototype.im = function (obj) {
  var ele;

  obj = _.defaults(obj, {
    primary: false,
    protocol: 'GOOGLE_TALK',
    rel: 'home'
  });

  ele = this._root.ele('gd:im', {
    address: obj.address,
    protocol: 'http://schemas.google.com/g/2005#' + obj.protocol,
    rel: 'http://schemas.google.com/g/2005#' + obj.rel
  });

  if (obj.primary) ele.att('primary', 'true');

  return ele;
};


Document.prototype.address = function (obj) {
  var ele;

  obj = _.defaults(obj, {
    primary: false,
    rel: 'home'
  });

  ele = this._root.ele('gd:structuredPostalAddress', {
    rel: 'http://schemas.google.com/g/2005#' + obj.rel
  });

  if (obj.primary) ele.att('primary', 'true');

  // Don't loop over element attributes.
  _(obj)
    .omit(['primary', 'rel'])
    .forOwn(function (value, key) {
      ele.ele('gd:'+ key, value);
    });

  return ele;
};


Document.prototype.notes = function (obj) {
  var ele;

  ele = this._root.ele('atom:content', {
    type: 'text'}, obj.text);

  return ele;
};


Document.prototype.toString = function () {
  return this._root.end();
};


Document.fromJSON = function (obj) {
  var doc = new Document();

  _.forOwn(obj, function (value, key) {
    if (doc[key]) doc[key](value);
  });

  return doc.toString();
};


module.exports = Document;
