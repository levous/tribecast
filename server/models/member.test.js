import chai from 'chai';
chai.should(); // Tell chai th  at we'll be using the "should" style assertions

import Mongoose from 'mongoose';
import MemberSchema from './member';


describe('Member', () => {
  describe('new member', () => {
    let member;

    beforeEach((done) => {
      member = new MemberSchema();
      done();
    });

    after(() => {
      // clear mongoose models to avoid >> MongooseError: Cannot overwrite `Member` model once compiled.
      Mongoose.models = {};
      Mongoose.modelSchemas = {};
      return Mongoose.connection.close();
    });

    it('should be invalid if mobile phone is not a phone number', () => {
      member.mobilePhone = '12345678901';
      member.validate(function(err) {
          expect(err.errors.name).to.exist;
          done();
      });
    });

    it('can be changed', () => {
      member.firstName = 'Larry';
      member.firstName.should.equal('Larry');
    });
  });

});
