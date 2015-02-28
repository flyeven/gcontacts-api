// load environmental variables
require('dotenv').load();

var _ = require('lodash');
var assert = require('chai').assert;
var GoogleContacts = require('../');

describe('GoogleContacts API', function () {

  var gContacts = new GoogleContacts({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });

  describe('constructor', function () {

    it('throws error when props is invalid', function () {
      assert.throws(function () { new GoogleContacts(); }, /invalid props argument/i);
      assert.throws(function () { new GoogleContacts('string'); }, /invalid props argument/i);
      assert.throws(function () { new GoogleContacts(123); }, /invalid props argument/i);
      assert.throws(function () { new GoogleContacts(true); }, /invalid props argument/i);
      assert.throws(function () { new GoogleContacts(null); }, /invalid props argument/i);
      assert.throws(function () { new GoogleContacts(new Date()); }, /invalid props argument/i);
    });

    it('throws error when clientId property is invalid', function () {
      assert.throws(function () { new GoogleContacts({}); }, /invalid clientId property/i);
      assert.throws(function () { new GoogleContacts({clientId: 123}); }, /invalid clientId property/i);
      assert.throws(function () { new GoogleContacts({clientId: true}); }, /invalid clientId property/i);
      assert.throws(function () { new GoogleContacts({clientId: null}); }, /invalid clientId property/i);
      assert.throws(function () { new GoogleContacts({clientId: new Date()}); }, /invalid clientId property/i);
    });

    it('throws error when clientSecret property is invalid', function () {
      assert.throws(function () { new GoogleContacts({clientId: 'valid'}); }, /invalid clientSecret property/i);
      assert.throws(function () { new GoogleContacts({clientId: 'valid', clientSecret: 123}); }, /invalid clientSecret property/i);
      assert.throws(function () { new GoogleContacts({clientId: 'valid', clientSecret: true}); }, /invalid clientSecret property/i);
      assert.throws(function () { new GoogleContacts({clientId: 'valid', clientSecret: null}); }, /invalid clientSecret property/i);
      assert.throws(function () { new GoogleContacts({clientId: 'valid', clientSecret: new Date()}); }, /invalid clientSecret property/i);
    });

  });

  describe('#getAuthUrl', function () {

    it('throws error when redirectUrl option is invalid', function () {
      assert.throws(function () { gContacts.getAuthUrl({}); }, /invalid redirectUrl option/i);
      assert.throws(function () { gContacts.getAuthUrl({redirectUrl: 'string-not-url'}); }, /invalid redirectUrl option/i);
      assert.throws(function () { gContacts.getAuthUrl({redirectUrl: 123}); }, /invalid redirectUrl option/i);
      assert.throws(function () { gContacts.getAuthUrl({redirectUrl: true}); }, /invalid redirectUrl option/i);
      assert.throws(function () { gContacts.getAuthUrl({redirectUrl: null}); }, /invalid redirectUrl option/i);
      assert.throws(function () { gContacts.getAuthUrl({redirectUrl: new Date()}); }, /invalid redirectUrl option/i);
    });

    it('returns string on valid redirectUrl', function () {
      assert.isString(gContacts.getAuthUrl({redirectUrl: 'http://www.google.com'}));
    });

  });

  describe('#authorize', function () {

    it('throws error when token is invalid', function () {
      assert.throws(function () { gContacts.authorize(); }, /invalid refreshToken argument/i);
      assert.throws(function () { gContacts.authorize(123); }, /invalid refreshToken argument/i);
      assert.throws(function () { gContacts.authorize(true); }, /invalid refreshToken argument/i);
      assert.throws(function () { gContacts.authorize(null); }, /invalid refreshToken argument/i);
      assert.throws(function () { gContacts.authorize(new Date()); }, /invalid refreshToken argument/i);
    });

    //  Have not removed them completely until we finilize method
//  it('throws error when redirectUrl is invalid', function () {
//    assert.throws(function () { gContacts.authorize('token'); }, /invalid redirectUrl argument/i);
//    assert.throws(function () { gContacts.authorize('token', 123); }, /invalid redirectUrl argument/i);
//    assert.throws(function () { gContacts.authorize('token', true); }, /invalid redirectUrl argument/i);
//    assert.throws(function () { gContacts.authorize('token', null); }, /invalid redirectUrl argument/i);
//    assert.throws(function () { gContacts.authorize('token', new Date()); }, /invalid redirectUrl argument/i);
//    assert.throws(function () { gContacts.authorize('token', 'string-not-url'); }, /invalid redirectUrl argument/i);
//  });

  });

  describe('#getContacts', function () {

    it('throws error when options is invalid', function () {
      assert.throws(function () { gContacts.getContacts(123); }, /invalid options argument/i);
      assert.throws(function () { gContacts.getContacts(true); }, /invalid options argument/i);
      assert.throws(function () { gContacts.getContacts(null); }, /invalid options argument/i);
      assert.throws(function () { gContacts.getContacts(new Date()); }, /invalid options argument/i);
    });

  });

  describe('#getSingleContact', function () {

    it('throws error when id is invalid', function () {
      assert.throws(function () { gContacts.getSingleContact(123); }, /invalid id property/i);
      assert.throws(function () { gContacts.getSingleContact(true); }, /invalid id property/i);
      assert.throws(function () { gContacts.getSingleContact(null); }, /invalid id property/i);
      assert.throws(function () { gContacts.getSingleContact(new Date()); }, /invalid id property/i);
    });

  });

  describe('#deleteContact', function () {

    it('throws error when id is invalid', function () {
      assert.throws(function () { gContacts.deleteContact(123, 'etag'); }, /invalid id argument/i);
      assert.throws(function () { gContacts.deleteContact(true, 'etag'); }, /invalid id argument/i);
      assert.throws(function () { gContacts.deleteContact(null, 'etag'); }, /invalid id argument/i);
      assert.throws(function () { gContacts.deleteContact(new Date(), 'etag'); }, /invalid id argument/i);
    });

    it('throws error when etag is invalid', function () {
      assert.throws(function () { gContacts.deleteContact('contactId', 123); }, /invalid etag argument/i);
      assert.throws(function () { gContacts.deleteContact('contactId', true); }, /invalid etag argument/i);
      assert.throws(function () { gContacts.deleteContact('contactId', null); }, /invalid etag argument/i);
      assert.throws(function () { gContacts.deleteContact('contactId', new Date()); }, /invalid etag argument/i);
    });

  });

  describe('#createContact', function () {

    it('throws error when payload is invalid', function () {
      assert.throws(function () { gContacts.createContact(); }, /invalid payload argument/i);
      assert.throws(function () { gContacts.createContact('string'); }, /invalid payload argument/i);
      assert.throws(function () { gContacts.createContact(123); }, /invalid payload argument/i);
      assert.throws(function () { gContacts.createContact(true); }, /invalid payload argument/i);
      assert.throws(function () { gContacts.createContact(null); }, /invalid payload argument/i);
      assert.throws(function () { gContacts.createContact(new Date()); }, /invalid payload argument/i);
    });

  });

  describe('#updateContact', function () {

    it('throws error when id is invalid', function () {
      assert.throws(function () { gContacts.updateContact(123, {}); }, /invalid id argument/i);
      assert.throws(function () { gContacts.updateContact(true, {}); }, /invalid id argument/i);
      assert.throws(function () { gContacts.updateContact(null, {}); }, /invalid id argument/i);
      assert.throws(function () { gContacts.updateContact(new Date(), {}); }, /invalid id argument/i);
    });

    it('throws error when payload is invalid', function () {
      assert.throws(function () { gContacts.updateContact('contactId'); }, /invalid payload argument/i);
      assert.throws(function () { gContacts.updateContact('contactId', 123); }, /invalid payload argument/i);
      assert.throws(function () { gContacts.updateContact('contactId', true); }, /invalid payload argument/i);
      assert.throws(function () { gContacts.updateContact('contactId', null); }, /invalid payload argument/i);
      assert.throws(function () { gContacts.updateContact('contactId', new Date()); }, /invalid payload argument/i);
    });

    it('throws error when etag is invalid', function () {
      assert.throws(function () { gContacts.updateContact('contactId', {}, 123); }, /invalid etag argument/i);
      assert.throws(function () { gContacts.updateContact('contactId', {}, true); }, /invalid etag argument/i);
      assert.throws(function () { gContacts.updateContact('contactId', {}, null); }, /invalid etag argument/i);
      assert.throws(function () { gContacts.updateContact('contactId', {}, new Date()); }, /invalid etag argument/i);
    });

  });

  it('successfully completes a CRUD operation', function (done) {
    // authorize
    gContacts.authorize(process.env.REFRESH_TOKEN)
      .then(function (response) {
        assert.isObject(response);
        assert.property(response, 'access_token');
        assert.property(response, 'token_type');
        assert.property(response, 'expires_in');
      })
      // create new contact
      .then(function () {
        return gContacts.createContact({
          email: {
            address: 'mj@nba.com'
          },
          name: {
            givenName: 'Michael',
            familyName: 'jordan'
          },
          phone: {
            phoneNumber: 23456
          },
          notes: {
            text: 'shirt number 23'
          },
          im: {
            address: 'michael@bulls.com'
          },
          address: {
            city: 'Chicago',
            street: 'Ave',
            country: 'USA'
          }
        });
      })
      .then(function (response) {
        assert.isObject(response);
        assert.property(response, 'etag');
        assert.property(response, 'id');

        return [response.id, response.etag];
      })
      // read created contact
      .spread(function (id, etag) {
        return gContacts.getSingleContact(id);
      })
      .then(function (response) {
        assert.isObject(response);
        assert.strictEqual(response.email[0].address, 'mj@nba.com');

        return response;
      })
      // update contact
      .then(function (contact) {
        contact.phone[0].phoneNumber = '234567';
        return gContacts.updateContact(contact.id, contact, contact.etag);
      })
      .then(function (response) {
        assert.isObject(response);
        assert.strictEqual(response.phone[0].number, '234567');

        return response.id;
      })
      // read contact (again) to see if update was successfull
      .then(function (id) {
        return gContacts.getSingleContact(id);
      })
      .then(function (response) {
        assert.isObject(response);
        // assert.strictEqual(response.phone[0].number, '234567');

        return [response.id, response.etag];
      })
      // delete contact
      .spread(function (id, etag) {
        return gContacts.deleteContact(id, etag)
          .delay(3000).then(function (response) {
            assert.isUndefined(response);
          })
          .return();
      })
      .then(done, done);
  });

});
