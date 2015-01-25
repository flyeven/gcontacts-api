// load environmental variables
require('dotenv').load();

var assert = require('chai').assert;
var GoogleContacts = require('../');

describe('GoogleContacts API', function () {

  var gContacts = new GoogleContacts({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUrl: process.env.REDIRECT_URL
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

    it('throws error when redirectUrl property is invalid', function () {
      assert.throws(function () { new GoogleContacts({clientId: 'valid', clientSecret: 'valid'}); }, /invalid redirectUrl property/i);
      assert.throws(function () { new GoogleContacts({clientId: 'valid', clientSecret: 'valid', redirectUrl: 'string-not-url'}); }, /invalid redirectUrl property/i);
      assert.throws(function () { new GoogleContacts({clientId: 'valid', clientSecret: 'valid', redirectUrl: 123}); }, /invalid redirectUrl property/i);
      assert.throws(function () { new GoogleContacts({clientId: 'valid', clientSecret: 'valid', redirectUrl: true}); }, /invalid redirectUrl property/i);
      assert.throws(function () { new GoogleContacts({clientId: 'valid', clientSecret: 'valid', redirectUrl: null}); }, /invalid redirectUrl property/i);
      assert.throws(function () { new GoogleContacts({clientId: 'valid', clientSecret: 'valid', redirectUrl: new Date()}); }, /invalid redirectUrl property/i);
    });

  });

  describe('#getAuthUrl', function () {

    it('returns string', function () {
      assert.isString(gContacts.getAuthUrl());
    });

  });

  describe('#authorize', function () {

    it('throws error when token is invalid', function () {
      assert.throws(function () { gContacts.authorize(); }, /invalid token argument/i);
      assert.throws(function () { gContacts.authorize(123); }, /invalid token argument/i);
      assert.throws(function () { gContacts.authorize(true); }, /invalid token argument/i);
      assert.throws(function () { gContacts.authorize(null); }, /invalid token argument/i);
      assert.throws(function () { gContacts.authorize(new Date()); }, /invalid token argument/i);
    });

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

    it('throws error when cid is invalid', function () {
      assert.throws(function () { gContacts.getSingleContact(123); }, /invalid cid argument/i);
      assert.throws(function () { gContacts.getSingleContact(true); }, /invalid cid argument/i);
      assert.throws(function () { gContacts.getSingleContact(null); }, /invalid cid argument/i);
      assert.throws(function () { gContacts.getSingleContact(new Date()); }, /invalid cid argument/i);
    });

  });

  describe('#deleteContact', function () {

    it('throws error when cid is invalid', function () {
      assert.throws(function () { gContacts.deleteContact(123, 'etag'); }, /invalid cid argument/i);
      assert.throws(function () { gContacts.deleteContact(true, 'etag'); }, /invalid cid argument/i);
      assert.throws(function () { gContacts.deleteContact(null, 'etag'); }, /invalid cid argument/i);
      assert.throws(function () { gContacts.deleteContact(new Date(), 'etag'); }, /invalid cid argument/i);
    });

    it('throws error when etag is invalid', function () {
      assert.throws(function () { gContacts.deleteContact('contactId', 123); }, /invalid etag argument/i);
      assert.throws(function () { gContacts.deleteContact('contactId', true); }, /invalid etag argument/i);
      assert.throws(function () { gContacts.deleteContact('contactId', null); }, /invalid etag argument/i);
      assert.throws(function () { gContacts.deleteContact('contactId', new Date()); }, /invalid etag argument/i);
    });

  });

  describe('#createContact', function () {

    it('throws error when obj is invalid', function () {
      assert.throws(function () { gContacts.createContact(); }, /invalid obj argument/i);
      assert.throws(function () { gContacts.createContact('string'); }, /invalid obj argument/i);
      assert.throws(function () { gContacts.createContact(123); }, /invalid obj argument/i);
      assert.throws(function () { gContacts.createContact(true); }, /invalid obj argument/i);
      assert.throws(function () { gContacts.createContact(null); }, /invalid obj argument/i);
      assert.throws(function () { gContacts.createContact(new Date()); }, /invalid obj argument/i);
    });

    it('throws error when name property is invalid', function () {
      assert.throws(function () { gContacts.createContact({}); }, /invalid name property/i);
      assert.throws(function () { gContacts.createContact({name: 123}); }, /invalid name property/i);
      assert.throws(function () { gContacts.createContact({name: true}); }, /invalid name property/i);
      assert.throws(function () { gContacts.createContact({name: null}); }, /invalid name property/i);
      assert.throws(function () { gContacts.createContact({name: new Date()}); }, /invalid name property/i);
    });

    it('throws error when email property is invalid', function () {
      assert.throws(function () { gContacts.createContact({name: {value: 'valid'}}); }, /invalid email property/i);
      assert.throws(function () { gContacts.createContact({name: {value: 'valid'}, email: 123}); }, /invalid email property/i);
      assert.throws(function () { gContacts.createContact({name: {value: 'valid'}, email: true}); }, /invalid email property/i);
      assert.throws(function () { gContacts.createContact({name: {value: 'valid'}, email: null}); }, /invalid email property/i);
      assert.throws(function () { gContacts.createContact({name: {value: 'valid'}, email: new Date()}); }, /invalid email property/i);
    });

    it('throws error when phone property is invalid', function () {
      assert.throws(function () { gContacts.createContact({name: {value: 'valid'}, email: {value: 'valid'}}); }, /invalid phone property/i);
      assert.throws(function () { gContacts.createContact({name: {value: 'valid'}, email: {value: 'valid'}, phone: 'phone-string'}); }, /invalid phone property/i);
      assert.throws(function () { gContacts.createContact({name: {value: 'valid'}, email: {value: 'valid'}, phone: 123}); }, /invalid phone property/i);
      assert.throws(function () { gContacts.createContact({name: {value: 'valid'}, email: {value: 'valid'}, phone: true}); }, /invalid phone property/i);
      assert.throws(function () { gContacts.createContact({name: {value: 'valid'}, email: {value: 'valid'}, phone: null}); }, /invalid phone property/i);
      assert.throws(function () { gContacts.createContact({name: {value: 'valid'}, email: {value: 'valid'}, phone: new Date()}); }, /invalid phone property/i);
    });

  });

});
