import Mongoose from 'mongoose';
import chai from 'chai';
import MemberSchema from './member';

// Tell chai that we'll be using the "should" style assertions.
chai.should();

describe('Member', () => {
  describe('new member', () => {
    let member;

    beforeEach((done) => {
      member = new MemberSchema();
      done();
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
