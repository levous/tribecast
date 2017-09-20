// test boilerplate - BEGIN (NOTE:can this be consolidated, configured globally?)
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
chai.should();
// test boilerplate -- END
const Mongoose = require('mongoose');
const {expect, assert} = chai;

import Validator from './Validator.js';

describe('Validator', () => {

  after(() => {
    //
  });

  describe('isValidEmail()', () => {
    it('should return true for good email address', () => {
      return expect(Validator.isValidEmail('rusty@google.com')).to.be.true();
    });
    it('should return false for email address having invalid domain format', () => {
      return expect(Validator.isValidEmail('rusty@google')).to.be.false();
    });
    it('should return false for email address having no @', () => {
      return expect(Validator.isValidEmail('rusty.google.com')).to.be.false();
    });
    it('should return false for email address having two @', () => {
      return expect(Validator.isValidEmail('rusty@@google.com')).to.be.false();
    });
    it('should return false for email address having only a domain', () => {
      return expect(Validator.isValidEmail('google.com')).to.be.false();
    });

  });



});
