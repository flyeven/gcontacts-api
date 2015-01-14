// load environmental variables
require('dotenv').load();

var GoogleContacts = require('../');
var client;

client = new GoogleContacts({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUrl: process.env.REDIRECT_URL,
});

console.log(client.getAuthorizationUrl());

client.authorize('4/B72FrpShzUEnftTFQGU4UkjXA-tIrSR78xaODMqV9tM.8nFgJcZGFwUfoiIBeO6P2m_G1zTVlQI')
  .then(function () {
    console.log('authorized');
    return client.getContacts()
  })
  .then(function() {
    console.log('got contacts');
  })
  .catch(function (err) {
    console.error(err);
  });
