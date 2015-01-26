var xmlbuilder = require('xmlbuilder');
var _ = require('lodash');

function Document () {
  this._root = xmlbuilder.create('root');
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

Document.prototype.toString = function () {
  return this._root.end();
};

Document.fromJSON = function (obj) {
  var doc = new Document();

  console.log(doc);
  _.forOwn(obj, function (value, key) {
    if (doc[key]) doc[key](value);
  });

  return doc.toString();
};

console.log(Document.fromJSON({email: {address: 123}}));
