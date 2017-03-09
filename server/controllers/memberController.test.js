// test boilerplate - BEGIN (NOTE:can this be consolidated, configured globally?)
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
chai.should();
// test boilerplate -- END
const Mongoose = require('mongoose');
const {expect, assert} = chai;

import errors from 'restify-errors';
import memberController from './memberController';

describe('memberController', () => {

  after(() => {
    // clear mongoose models to avoid >> MongooseError: Cannot overwrite `Member` model once compiled.
    Mongoose.models = {};
    Mongoose.modelSchemas = {};
    return Mongoose.connection.close();
  });

  describe('get()', () => {
    it('should throw if no id is provided', () => {
      return expect(memberController.get()).to.be.rejectedWith(errors.MissingParameterError);
    });
  });

  describe('create()', () => {
    let member;

    beforeEach((done) => {
      member = {
        firstName: 'Tester',
        lastName: 'McGillicuty',
        email: 'this@willEventually.fail'
      };
      done();
    });

    it('should throw if _id is provided', () => {

      member._id = '12345678901';
      return expect(memberController.create(member)).to.be.rejectedWith(errors.InvalidContentError);

    });

    it('should succeed if member content is good', () => {
      memberController.create(member).then(doc => {
        return doc.firstName.should.equal(member.firstName);
      });

    });

  });

  describe('publish()', () => {

    beforeEach((done) => {

      done();
    });

    it('should replace old with new if found', (done) => {
      //hmm
      done();

    });
  });


});
