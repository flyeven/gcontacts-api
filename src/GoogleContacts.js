var url = require('url');
var Promise = require('bluebird');
var request = require('request');
var isUrl = require('is-url');
var type = require('type-of');
var _ = require('lodash');

function GoogleContacts(props) {
  if (!_.isPlainObject(props)) {
    throw new Error('Invalid props argument; expected object, received ' + type(props));
  }

  if (!_.isString(props.clientId)) {
    throw new Error('Invalid clientId property; expected string, received ' + type(props.clientId));
  }

  if (!_.isString(props.clientSecret)) {
    throw new Error('Invalid clientSecret property; expected string, received ' + type(props.clientSecret));
  }

  if (!isUrl(props.redirectUrl)) {
    throw new Error('Invalid redirectUrl property; expected string, received ' + type(props.redirectUrl));
  }

  this._clientId = props.clientId;
  this._clientSecret = props.clientSecret;
  this._redirectUrl = props.redirectUrl;
}

GoogleContacts.prototype.getAuthUrl = function () {
  return url.format({
    protocol: 'https',
    host: 'accounts.google.com',
    pathname: '/o/oauth2/auth',
    query: {
      response_type: 'code',
      client_id: this._clientId,
      redirect_uri: this._redirectUrl,
      scope: 'https://www.google.com/m8/feeds',
      approval_prompt: 'force'
    }
  });
};

GoogleContacts.prototype.authorize = function (token, callback) {
  var _this = this;
  var resolver;

  if (!_.isString(token)) {
    throw new Error('Invalid token argument; expected string, received ' + type(token));
  }

  resolver = function (resolve, reject) {
    var params;

    params = {
      method: 'POST',
      uri: 'https://accounts.google.com/o/oauth2/token',
      form: {
        grant_type: 'authorization_code',
        code: token,
        client_id: _this._clientId,
        client_secret: _this._clientSecret,
        redirect_uri: _this._redirectUrl
      },
      json: true
    };

    request(params, function (err, response, data) {
      var statusCode = response.statusCode;

      if (err) return reject(err);

      statusCode = response.statusCode;
      if (statusCode >= 400 || data.error_description) {
        return reject(new Error(data.error_description));
      }

      // update client token
      _this._token = data.access_token;

      resolve(data);
    });
  };

  return new Promise(resolver).nodeify(callback);
};

GoogleContacts.prototype.getContacts = function (options, callback) {
  var _this = this;
  var limit;
  var offset;
  var resolver;

  // handle optional "options" param
  if (_.isFunction(options)) {
    callback = options;
    options = {};
  } else if (_.isUndefined(options)) {
    options = {};
  } else if (!_.isPlainObject(options)) {
    throw new Error('Invalid options argument; expected object, received ' + type(options));
  }

  // set default options
  options = _.default(options, {
    limit: 100,
    offset: 0
  });

  resolver = function (resolve, reject) {
    var params;

    params = {
      method: 'GET',
      uri: 'https://www.google.com/m8/feeds/contacts/default/full',
      qs: {v: '3.0'},
      headers: {'Authorization': 'Bearer ' + _this._token}
    };

    // append options to querystring
    params.qs = _.extend(params.qs, {
      'max-results': options.limit,
      'start-index': options.offset + 1, // 1-based index
    });

    request(params, function (err, response, data) {
      var statusCode;

      if (err) return reject(err);

      statusCode = response.statusCode;
      if (statusCode >= 400 || data.error_description) {
        return reject(new Error(data.error_description));
      }

      resolve(data);
    });
  };

  return new Promise(resolver).nodeify(callback);
};


GoogleContacts.prototype.getSingleContact = function (contactId, callback) {
  var _this = this;
  var limit;
  var offset;
  var resolver;

  if (!_.isString(contactId)) {
    throw new Error('Invalid contactId property; expected string, received ' + type(contactId));
  }

  resolver = function (resolve, reject) {
    var params;

    params = {
      method: 'GET',
      uri: url.resolve('https://www.google.com/m8/feeds/contacts/default/full/', contactId),
      qs: {v: '3.0'},
      headers: {'Authorization': 'Bearer ' + _this._token}
    };

    request(params, function (err, response, data) {
      var statusCode;

      if (err) return reject(err);

      statusCode = response.statusCode;
      if (statusCode >= 400 || data.error_description) {
        return reject(new Error(data.error_description));
      }

      resolve(data);
    });
  };

  return new Promise(resolver).nodeify(callback);
};


module.exports = GoogleContacts;
