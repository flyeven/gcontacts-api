var url = require('url');
var Promise = require('bluebird');
var request = require('request');
var isUrl = require('is-url');
var type = require('type-of');
var _ = require('lodash');
var Document = require('./Document');
var formatResponse = require('./formatResponse');

/**
 * Creates a Google Contacts client.
 * @param {Object} props client properties
 * @param {String} props.clientId the cliend id obtained from the Developers Console
 * @param {String} props.clientSecret the cliend secret obtained from the Developers Console
 * @constructor
 */
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

  this._clientId = props.clientId;
  this._clientSecret = props.clientSecret;
}

/**
 * Compiles and returns a URL to display OAuth dialog to the user.
 * @see {@link https://developers.google.com/accounts/docs/OAuth2WebServer}
 * @param {Object} options auth options
 * @param {String} options.redirectUrl URL to redirect the user after authentication
 * @param {String} [options.accessType=offline] indicates whether your app needs to access Google Contacts when the user is not present
 * @param {String} [options.approvalPrompt=auto] indicates whether the user should be re-prompted for consent. The default is auto, so a given user should only see the consent page for a given set of scopes the first time through the sequence
 * @return {String}
 */
GoogleContacts.prototype.getAuthUrl = function (options) {
  // validate options argument
  if (!_.isPlainObject(options)) {
    throw new Error('Invalid options argument; expected object, received ' + type(options));
  }

  // validate redirectUrl option
  if (!isUrl(options.redirectUrl)) {
    throw new Error('Invalid redirectUrl option; expected string, received ' + type(options.redirectUrl));
  }

  // set default options
  options = _.defaults(options, {
    accessType: 'offline',
    approvalPrompt: 'auto'
  });

  // validate accessType option
  if (['offline', 'online'].indexOf(options.accessType) === -1) {
    throw new Error('Invalid accessType option; expected "offile" or "online", received ' + type(options.accessType));
  }

  // validate approvalPrompt option
  if (['auto', 'force'].indexOf(options.approvalPrompt) === -1) {
    throw new Error('Invalid approvalPrompt option; expected "auto" or "force", received ' + type(options.approvalPrompt));
  }

  // create and return URL
  return url.format({
    protocol: 'https',
    host: 'accounts.google.com',
    pathname: '/o/oauth2/auth',
    query: {
      response_type: 'code',
      client_id: this._clientId,
      redirect_uri: options.redirectUrl,
      scope: 'https://www.google.com/m8/feeds',
      access_type: options.accessType,
      approval_prompt: options.approvalPrompt
    }
  });
};

/**
 * Authorizes the client for offline access using the specified refresh token.
 * @see {@link https://developers.google.com/accounts/docs/OAuth2WebServer}
 * @param {String} refreshToken
 * @param {Function} [callback] optional callback function
 * @return {Promise}
 */
GoogleContacts.prototype.authorize = function(refreshToken, callback) {
  var _this = this;
  var resolver;

  if (!_.isString(refreshToken)) {
    throw new Error('Invalid refreshToken argument; expected string, received ' + type(refreshToken));
  }

  resolver = function (resolve, reject) {
    var params;

    params = {
      method: 'POST',
      uri: 'https://www.googleapis.com/oauth2/v3/token',
      form: {
        refresh_token: refreshToken,
        client_id: _this._clientId,
        client_secret: _this._clientSecret,
        grant_type: 'refresh_token'
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
      _this._tokenType = data.token_type;

      resolve(data);
    });
  };

  return new Promise(resolver).nodeify(callback);
};

/**
 * Retreives contacts from Google Contacts.
 * @see {@link https://developers.google.com/google-apps/contacts/v3/#retrieving_all_contacts}
 * @see (@link https://developers.google.com/google-apps/contacts/v3/#retrieving_contacts_using_query_parameters}
 * @param {Object} [options] retrieval options
 * @param {String} [options.query] query to filter the contacts
 * @param {Number} [options.limit=100] maximum number of contacts to return
 * @param {Number} [options.offset=0] number of contacts to skip
 * @param {Function} [callback] optional callback function with (err, contacts) arguments
 * @return {Promise}
 */
GoogleContacts.prototype.getContacts = function (options, callback) {
  var _this = this;
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
  options = _.defaults(options, {
    query: '',
    limit: 100,
    offset: 0
  });

  // validate query option
  if (!_.isString(options.query)) {
    throw new Error('Invalid query option; expected string, received ' + type(options.query));
  }

  resolver = function (resolve, reject) {
    var params;

    params = {
      method: 'GET',
      uri: 'https://www.google.com/m8/feeds/contacts/default/full',
      qs: {
        v: '3.0',
        alt: 'json'
      },
      json: true,
      headers: {'Authorization': _this._tokenType + ' ' + _this._token}
    };

    // append options to querystring
    params.qs = _.extend(params.qs, {
      'q': options.query,
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

      data = _.map(data.feed.entry, function (obj) {
        return formatResponse(obj);
      });

      resolve(data);
    });
  };

  return new Promise(resolver).nodeify(callback);
};


/**
 * Retrieves a single contact from Google Contacts.
 * @see {@link https://developers.google.com/google-apps/contacts/v3/#retrieving_a_single_contact}
 * @param {String} id the contact id
 * @param {Function} [callback] optional callback function with (err, date) arguments
 * @return {Promise}
 */
GoogleContacts.prototype.getSingleContact = function (id, callback) {
  var _this = this;
  var resolver;
  var uri;

  if (!_.isString(id)) {
    throw new Error('Invalid id property; expected string, received ' + type(id));
  }

  uri = url.resolve('https://www.google.com/m8/feeds/contacts/default/full/', id);

  resolver = function (resolve, reject) {
    var params;

    params = {
      method: 'GET',
      uri: uri,
      qs: {
        v: '3.0',
        alt: 'json'
      },
      json: true,
      headers: {'Authorization': _this._tokenType + ' ' + _this._token}
    };

    request(params, function (err, response, data) {
      var statusCode;

      if (err) return reject(err);

      statusCode = response.statusCode;
      if (statusCode >= 400 || data.error_description) {
        return reject(new Error(data.error_description));
      }

      resolve(formatResponse(data.entry));
    });
  };

  return new Promise(resolver).nodeify(callback);
};

/**
 * Deletes the designated contact from Google Contacts.
 * @see {@link https://developers.google.com/google-apps/contacts/v3/#deleting_contacts}
 * @param {String} id the contact id
 * @param {String} [etag]
 * @param {Function} [callback] optional callback function with (err) arguments
 * @return {Promise}
 */
GoogleContacts.prototype.deleteContact = function (id, etag, callback) {
  var _this = this;
  var resolver;

  if (!_.isString(id)) {
    throw new Error('Invalid id argument; expected string, received ' + type(id));
  }

  // handle optional etag argument
  if (_.isFunction(etag)) {
    callback = etag;
    etag = '*';
  } else if (_.isUndefined(etag)) {
    etag = '*';
  }

  if (!_.isString(etag)) {
    throw new Error('Invalid etag argument; expected string, received ' + type(etag));
  }

  resolver = function (resolve, reject) {
    var params;

    params = {
      method: 'DELETE',
      uri: url.resolve('https://www.google.com/m8/feeds/contacts/default/full/', id),
      qs: {v: '3.0'},
      headers: {
        'Authorization': _this._tokenType + ' ' + _this._token,
        'If-match': etag
      }
    };

    request(params, function (err, response, data) {
      var statusCode;

      if (err) return reject(err);

      statusCode = response.statusCode;
      if (statusCode >= 400 || data.error_description) {
        return reject(new Error(data.error_description));
      }

      resolve();
    });
  };

  return new Promise(resolver).nodeify(callback);
};

/**
 * Creates the given contact in Google Contacts.
 * @see {@link https://developers.google.com/google-apps/contacts/v3/#creating_contacts}
 * @param {Object} payload the contact payload
 * @param {Function} [callback] optional callback function with (err, data) arguments.
 * @return {Promise}
 */
GoogleContacts.prototype.createContact = function (payload, callback) {
  var _this = this;
  var resolver;

  if (!_.isPlainObject(payload)) {
    throw new Error('Invalid payload argument; expected object, received ' + type(payload));
  }

  resolver = function (resolve, reject) {
    var params;

    params = {
      method: 'POST',
      uri: 'https://www.google.com/m8/feeds/contacts/default/full/',
      qs: {
        v: '3.0',
        alt: 'json'
      },
      headers: {
        'Authorization': _this._tokenType + ' ' + _this._token,
        'Content-Type': 'application/atom+xml; charset=utf-8; type=feed'
      },
      body: Document.fromJSON(payload)
    };

    request(params, function (err, response, data) {
      var statusCode;

      if (err) return reject(err);

      statusCode = response.statusCode;
      if (statusCode >= 400 || data.error_description) {
        return reject(new Error(data.error_description));
      }

      resolve(formatResponse(JSON.parse(data).entry));
    });
  };

  return new Promise(resolver).nodeify(callback);
};

/**
 * Updates the designated contact with the given payload.
 * @see {@link https://developers.google.com/google-apps/contacts/v3/#updating_contacts}
 * @param {String} id the contact id
 * @param {Object} payload the contact payload
 * @param {String} [etag]
 * @param {Function} [callback] optional callback function with (err, data) arguments
 * @return {Promise}
 */
GoogleContacts.prototype.updateContact = function (id, payload, etag, callback) {
  var _this = this;
  var resolver;

  if (!_.isString(id)) {
    throw new Error('Invalid id argument; expected string, received ' + type(id));
  }

  if (!_.isPlainObject(payload)) {
    throw new Error('Invalid payload argument; expected object, received ' + type(payload));
  }

  // handle optional etag argument
  if (_.isFunction(etag)) {
    callback = etag;
    etag = '*';
  } else if (_.isUndefined(etag)) {
    etag = '*';
  }

  if (!_.isString(etag)) {
    throw new Error('Invalid etag argument; expected string, received ' + type(etag));
  }

  resolver = function (resolve, reject) {
    var params;

    params = {
      method: 'PUT',
      uri: url.resolve('https://www.google.com/m8/feeds/contacts/default/full/', id),
      qs: {
        v: '3.0',
        alt: 'json'
      },
      headers: {
        'Authorization': _this._tokenType + ' ' + _this._token,
        'Content-Type': 'application/atom+xml; charset=utf-8; type=feed',
        'If-match': etag
      },
      body: Document.fromJSON(payload)
    };

    request(params, function (err, response, data) {
      var statusCode;

      if (err) return reject(err);

      statusCode = response.statusCode;
      if (statusCode >= 400 || data.error_description) {
        return reject(new Error(data.error_description));
      }

      resolve(formatResponse(JSON.parse(data).entry));
    });
  };

  return new Promise(resolver).nodeify(callback);
};

module.exports = GoogleContacts;
