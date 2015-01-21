# gContacts API

Google Contacts API client for Node.js.

## Quick start

```javascript
var GoogleContacts = require('gcontacts-api');

var gContacts = new GoogleContacts({
  clientId: '####-####.apps.googleusercontent.com',
  clientSecret: '###-###',
  redirectUrl: 'http://www.mywebsite.com/oauth2callback'
});

var url = gContacts.getAuthorizationUrl();

// redirect user to authorization URL and acquire oAuth access token

gContacts.authorize(token)
  .then(function () {
    return gContacts.getContacts();
  })
  .then(function (contacts) {
    // do something with contacts
  })
  .catch(function (err) {
    console.error(err);
  });
```

For further information on how to use this library please refer to the [wiki](https://github.com/controlly/gcontacts-api/wiki).

## Features

* OAuth authorization;
* Basic CRUD functionality;
* Promise and callback API.

## Installation

```
$ npm install gcontacts-api
```

#### Requirements

* Node.js 0.8+*

## Contribute

Source code contributions are most welcome. The following rules apply:

1. JavaScript source code needs to follow the [Airbnb Style Guide](https://github.com/airbnb/javascript);
2. Functions need to be well documented;
3. Unit tests are obligatory.

## Support

If you are having issues with this library, please let us know.

* Issue Tracker: [github.com/controlly/gcontacts-api/issues](https://github.com/controlly/gcontacts-api/issues)

## License

The project is licensed under the [MIT license](http://opensource.org/licenses/MIT).
