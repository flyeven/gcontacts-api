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

client.authorize('4/15aRk4gneDnVqR715muTcJ439Ojd07hJu4PBM5A6ZMI.op6rtnmFvZAToiIBeO6P2m-4lBvAlQI')
  .then(function () {
    console.log('authorized');
  })
  .catch(function (err) {
    console.error(err);
  });
