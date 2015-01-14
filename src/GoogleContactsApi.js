var url = require('url');
var Promise = require('bluebird');
var request = require('request');

/**
 * Constructs a new Google Contacts API client.
 * @param {object} props application properties.
 * @param {object} props.clientId
 * @param {object} props.clientSecret
 * @constructor
 */
function GoogleContactsApiClient(props) {
  this.clientId = props.clientId;
  this.clientSecret = props.clientSecret;
  this.redirectUrl = props.redirectUrl;
}

/**
 * Generates and returns an auth URL to redirect the user.
 * @return {string}
 */
GoogleContactsApiClient.prototype.getAuthorizationUrl = function () {
  return url.format({
    protocol: 'https',
    host: 'accounts.google.com',
    pathname: '/o/oauth2/auth',
    query: {
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.redirectUrl,
      scope: 'https://www.google.com/m8/feeds',
      approval_prompt: 'force'
    }
  });
};

/**
 * Authorizes the client to access a pararticular user's contacts using the given token.
 * @param {string} code
 * @param {function} [callback] optional callback function with (err) arguments
 * @return {Promise}
 */
GoogleContactsApiClient.prototype.authorize = function (code, callback) {
  var _this = this;
  var options;
  var resolver;
  var body;

  // set request options
  options = {
    method: 'POST',
    uri: 'https://accounts.google.com/o/oauth2/token',
    form: {
      grant_type: 'authorization_code',
      code: code,
      client_id: this.clientId,
      client_secret: this.clientSecret,
      redirect_uri: this.redirectUrl
    }
  };

  resolver = function (resolve, reject) {
    request(options, function (err, response, data) {
      var statusCode = response.statusCode;

      if (err) return reject(err);

      if (statusCode >= 400 || data.error_description) {
        return reject(new Error(data.error_description));
      }

      resolve(data);
    });
  };

  return new Promise(resolver)
    .then(function (response) {
      body = JSON.parse(response);
      _this._token = body.access_token;
    })
    .nodeify(callback);
};

/**
 * Retrieves from Google API the (first page) of user's contacts.
 * @param {function} [callback] optional callback function with (err) arguments
 * @return {Promise}
 */
GoogleContactsApiClient.prototype.getContacts = function (callback) {
  var options;
  var resolver;

  // set /GET request options
  options = {
    method: 'GET',
    // Use of query parameter v=3.0 to ask for v3 google api.
    uri: 'https://www.google.com/m8/feeds/contacts/default/full?v=3.0',
    headers: {
      'Authorization': 'Bearer ' + this._token
    }
  };

  resolver = function (resolve, reject) {
    request(options, function (err, response, data) {
      var statusCode = response.statusCode;

      if (err) return reject(err);

      if (statusCode >= 400 || data.error_description) {
        return reject(new Error(data.error_description));
      }

      resolve(data);
    });
  };

  return new Promise(resolver)
    .then(function (response) {
      console.log('Response is: ', response);
    })
    .nodeify(callback);
};


module.exports = GoogleContactsApiClient;
