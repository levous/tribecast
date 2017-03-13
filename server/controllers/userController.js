const Mongoose = require('mongoose');
//const Promise = require ('bluebird');
const Member = require('../models/member');
const User = require('../models/user');
const errors = require('restify-errors');
const uuidV1 = require('uuid/v1');

// Use bluebird promises
Mongoose.Promise = Promise;

exports.getAll = function(){

  return User
    .find()
    .select('-_id -password -__v')
    .lean()
    .exec();
};

exports.findByEmailAddress = function(email) {
  // find a user by email address
  return User.findOne({ email: email });
};

exports.findByPasswordResetKey = function(resetKey) {
  // find a user by email address
  return User.findOne({ passwordResetKey: resetKey });
};

exports.addUserToRole = function(user, role){
  if(!user.roles) user.roles = [];

  if(user.roles.find && user.roles.find(r => r === role)){
    return Promise.reject(new errors.PreconditionFailedError(`User having email address '${user.email}' already assigned to '${role}' role`));
  }
  user.roles.push(role);
  return user.save();
}
