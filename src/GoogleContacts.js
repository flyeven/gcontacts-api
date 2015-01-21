var url = require('url');
var Promise = require('bluebird');
var request = require('request');
var _ = require('lodash');

function GoogleContacts(props) {
  this._clientId = props.clientId;
  this._clientSecret = props.clientSecret;
  this._redirectUrl = props.redirectUrl;
}

GoogleContacts.prototype.getAuthorizationUrl = function () {
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
  var resolver;

  // handle optional "options" param
  if (typeof(options) === 'function') {
    callback = options;
    options = {};
  } else if (options === undefined) {
    options = {};
  }

  resolver = function (resolve, reject) {
    var params;

    params = {
      method: 'GET',
      uri: 'https://www.google.com/m8/feeds/contacts/default/full',
      qs: {v: '3.0'},
      headers: {'Authorization': 'Bearer ' + _this._token}
    };

    // append options to querystring
    params.qs = _.extend(params.qs, options);

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
