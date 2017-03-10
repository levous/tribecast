
import {setUp, tearDown, resetDb} from '../test-utils/db'
import User from '../models/User';
import {expect} from 'chai';

describe('User', () => {
  before(setUp);
  after(tearDown);
  afterEach(resetDb);


    it('should save user', () => {
      var data, user;
      data = {
        email: 'foo@example.com'
      };
      user = new User(data);
      return user.save(function(err, user) {
        if (err) {
          return Promise.reject(err);
        }
        expect(user.email).to.equal(data.email);
        expect(user._id).to.exist;
        expect(1).to.equal(2);
        expect(1).to.equal(6);
      });
    });

});
