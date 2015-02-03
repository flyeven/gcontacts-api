var path = require('path');
var Mocha = require('mocha');
var mocha;

// init mocha
mocha = new Mocha({
  reporter: 'spec',
  timeout: 30000 // 30 secs
});

// load the test files
mocha.addFile(path.resolve(__dirname, './google-contacts'));
mocha.addFile(path.resolve(__dirname, './format-response'));
mocha.addFile(path.resolve(__dirname, './filters'));

// run the tests
mocha.run(function (failures) {
  process.on('exit', function () {
    process.exit(failures);
  });
});
