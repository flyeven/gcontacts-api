// dotenv is used only for now ...
var dotenv = require('dotenv');
var express = require('express');
var request = require('request');

dotenv.load();
var app = express();


//  app.get('/auth', function(req, res) {
//    res.redirect(301, '/googleoauth2');
//  });


//  app.get('/googleoauth2', function(req, res) {
//    var queryAttributes = {
//      response_type: 'code',
//      client_id: '1054641297403-8df2n7hdq8qjb6oue2627gnrhul5ob4p.apps.googleusercontent.com',
//      redirect_uri: 'http://localhost:3000/oauth2callback',
//      scope: 'email@profile',
//      approval_prompt: 'auto'
//    };

//    var options = {
//      url: 'https://accounts.google.com/o/oauth2/auth',
//      qs: queryAttributes
//    }

//    request(options, function(err, resp, body) {
//        console.log(resp);
//    });
//  });


/*
 * Once client hits browser link, starts the authorization process.
 */
app.get('/oauth2callback', function(req, res) {
  var code = req.query.code;
  console.log('obtained code is: ' + code);

  request.post('https://accounts.google.com/o/oauth2/token', {
    form: {
      grant_type: 'authorization_code',
      code: code,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      redirect_uri: 'http://localhost:3000/oauth2callback'
    },
    json: true
  }, function(err, res, body) {
    console.log(body);
  });
});


// Start a dead simple http server.
app.listen(3000);
console.log('Express server listening on 3000');
