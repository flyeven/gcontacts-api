var assert = require('chai').assert;
var formatResponse = require('../src/formatResponse');
var response1 = require('../assets/response-1');

describe('formatResponse', function () {

  it('successfully parses response #1 (Lebron James) contact', function () {
    var results = formatResponse(response1);

    assert.strictEqual(results.id, '415e59720ed3cf57');
    assert.strictEqual(results.etag, '"QXY4fTVSLit7I2A9XRRRGUwMRAI."');
    assert.strictEqual(results.title, 'Lebron james');
    assert.instanceOf(results.updated, Date);

    assert.isArray(results.category);
    assert.lengthOf(results.category, 1);
    assert.deepEqual(results.category[0], {
      scheme: 'http://schemas.google.com/g/2005#kind',
      term: 'http://schemas.google.com/contact/2008#contact'
    });

    assert.isArray(results.email);
    assert.lengthOf(results.email, 1);
    assert.deepEqual(results.email[0], {
      address: 'lebron@nba.com',
      type: 'http://schemas.google.com/g/2005#home'
    });

    assert.isObject(results.name);
    assert.deepEqual(results.name, {
      fullName: 'Lebron james',
      givenName: 'Lebron',
      familyName: 'james'
    });

    assert.isArray(results.phone);
    assert.lengthOf(results.phone, 1);
    assert.deepEqual(results.phone[0], {
      number: '2306232',
      type: 'http://schemas.google.com/g/2005#home'
    });

    assert.isArray(results.postalAddress);
    assert.lengthOf(results.postalAddress, 1);
    assert.deepEqual(results.postalAddress[0], {
      address: 'Ohaio State\nCleveland\nUSA',
      city: 'Cleveland',
      street: 'Ohaio State',
      country: 'USA'
    });
  });

});
