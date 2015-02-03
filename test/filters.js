var assert = require('chai').assert;
var birthday = require('../src/filters/birthday');

describe('Filters', function () {

  describe('birthday', function () {

    it('appends no properties when $birthday is undefined', function () {
      var results = {};
      birthday.visit(results, {});
      assert.deepEqual(results, {});
    });

  });

});
