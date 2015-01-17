// load environmental variables
require('dotenv').load();

var GoogleContacts = require('../');
var client;
var params;

client = new GoogleContacts({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUrl: process.env.REDIRECT_URL,
});

params = {
  'max-results': 200,
  'start-index': 1, // 1-based index
  'alt': 'json'
};


console.log(client.getAuthorizationUrl());

client.authorize('4/2EXCbpt7M331re2EtWEqkptTSaca7UFp5j2R-RR9xc4.ov3hKfDntFceoiIBeO6P2m8wmkfvlQI')
  .then(function () {
    console.log('authorized');
    return client.getContacts(params)
  })
  .then(function() {
    console.log('got contacts');
  })
  .catch(function (err) {
    console.error(err);
  });
