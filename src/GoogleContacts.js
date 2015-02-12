var url = require('url');
var Promise = require('bluebird');
var request = require('request');
var isUrl = require('is-url');
var type = require('type-of');
var _ = require('lodash');
var Document = require('./Document');
var formatResponse = require('./formatResponse');


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

GoogleContacts.prototype.getAuthUrl = function (options) {
  // validate options argument
  if (!_.isPlainObject(options)) {
    throw new Error('Invalid options argument; expected object, received ' + type(options));
  }

  // validate redirectUrl option
  if (!isUrl(options.redirectUrl)) {
    throw new Error('Invalid redirectUrl options; expected string, received ' + type(options.redirectUrl));
  }

  // set default options
  options = _.defaults(options, {
    accessType: 'offline',
    approvalPrompt: 'auto'
  });

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

GoogleContacts.prototype.authorize = function (code, redirectUrl, callback) {
  var _this = this;
  var resolver;

  if (!_.isString(code)) {
    throw new Error('Invalid code argument; expected string, received ' + type(code));
  }

  if (!isUrl(redirectUrl)) {
    throw new Error('Invalid redirectUrl argument; expected string, received ' + type(redirectUrl));
  }

  resolver = function (resolve, reject) {
    var params;

    params = {
      method: 'POST',
      uri: 'https://accounts.google.com/o/oauth2/token',
      form: {
        grant_type: 'authorization_code',
        code: code,
        client_id: _this._clientId,
        client_secret: _this._clientSecret,
        redirect_uri: redirectUrl
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

GoogleContacts.prototype.authorizeOffline = function(refreshToken, callback) {
  var _this = this;
  var resolver;

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
    limit: 100,
    offset: 0
  });

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


// Probably should rename that method.
GoogleContacts.prototype.getSingleContact = function (options, callback) {
  var _this = this;
  var resolver;
  var baseUrl;

  // handle optional "options" param
  if (_.isFunction(options)) {
    callback = options;
    options = {};
  } else if (_.isUndefined(options)) {
    options = {};
  } else if (!_.isPlainObject(options)) {
    throw new Error('Invalid options argument; expected object, received ' + type(options));
  }
  // I am sure this can rewritten better.
  if (_.isUndefined(options.id) && _.isUndefined(options.query)) {
    throw new Error('Invalid options properties; Expected either an id or query ');
  }

  if (!_.isUndefined(options.id) && !_.isString(options.id)) {
    throw new Error('Invalid id property; expected string, received ' + type(options.id));
  }

  if (!_.isUndefined(options.query) && !_.isString(options.query)) {
    throw new Error('Invalid query property; expected string, received ' + type(options.query));
  }

  baseUrl = 'https://www.google.com/m8/feeds/contacts/default/full/';

  if (!_.isUndefined(options.id)) {
    baseUrl = url.resolve(baseUrl, options.id);
  }

  options = _.defaults(options, {
    limit: 100,
    offset: 0,
    query: ''
  });

  resolver = function (resolve, reject) {
    var params;

    params = {
      method: 'GET',
      uri: baseUrl,
      qs: {
        v: '3.0',
        alt: 'json'
      },
      json: true,
      headers: {'Authorization': _this._tokenType + ' ' + _this._token}
    };

    params.qs = _.extend(params.qs, {
      'max-results': options.limit,
      'start-index': options.offset + 1, // 1-based index
      'q': options.query
    });

    request(params, function (err, response, data) {
      var statusCode;

      if (err) return reject(err);

      statusCode = response.statusCode;
      if (statusCode >= 400 || data.error_description) {
        return reject(new Error(data.error_description));
      }

      // Should check here, because Google returns different format
      // if single or multiple entries are returned.
      if (!_.isUndefined(data.feed)) {
        data = _.map(data.feed.entry, function (obj) {
          return formatResponse(obj);
        });
      } else {
        data = formatResponse(data.entry);
      }

      resolve(data);
    });
  };

  return new Promise(resolver).nodeify(callback);
};


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


GoogleContacts.prototype.createContact = function (obj, callback) {
  var _this = this;
  var resolver;

  if (!_.isPlainObject(obj)) {
    throw new Error('Invalid obj argument; expected object, received ' + type(obj));
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
      body: Document.fromJSON(obj)
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


GoogleContacts.prototype.updateContact = function (id, obj, etag, callback) {
  var _this = this;
  var resolver;

  if (!_.isString(id)) {
    throw new Error('Invalid id argument; expected string, received ' + type(id));
  }

  if (!_.isPlainObject(obj)) {
    throw new Error('Invalid obj argument; expected object, received ' + type(obj));
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
      body: Document.fromJSON(obj)
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
