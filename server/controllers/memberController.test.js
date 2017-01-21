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

    it('should succeed if id is valid', () => {
      memberController.get('58748d746ceaa679504d7f17')
        .then(doc => {
          console.log('doc', doc);
        })
        .catch(err => {
          console.log('err', err);
        });
      return expect(memberController.get('58748d746ceaa679504d7f17')).to.eventually.have.property("firstName");
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

});
