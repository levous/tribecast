const Mongoose = require('mongoose');
//const Promise = require ('bluebird');
const Member = require('../models/member');
const User = require('../models/user');
const errors = require('../../shared-modules/http-errors');
const log = require('../modules/log')(module);
const uuid = require('../modules/uuid');
const user_roles = require('../../config/user_roles');

// Use bluebird promises
Mongoose.Promise = Promise;



exports.getAll = function(){

  return User
    .find()
    .select('-_id -password -__v')
    .lean()
    .exec();
};

exports.findByEmail = function(email) {
  // find a user by email address
  return User.findOne({ email: email.toLowerCase() }).exec();
};

exports.findByMemberUserKeys = function(memberUserKeys) {
  // find a user by email address
  return User.find({ memberUserKey: { $in: memberUserKeys } }).exec();
};

exports.forgotPassword = function(email) {
  return User.findOne({ email: email.toLowerCase() }).exec()
    .then(user => {
      if (!user) {
        const err = new errors.ResourceNotFoundError('No user found using provided email address')
        return Promise.reject(err);
      }

      user.passwordResetToken = uuid();
      user.passwordResetTokenExpires = Date.now() + 3600000; // 1 hour
      log.info(`forgotPassword - reset token: ${user.passwordResetToken}`);
      return user.save();
    })
    .then(user => {

      return {
        message: 'forgot password routine completed successfully',
        resetToken: user.passwordResetToken,
        userName: user.name,
        undeliverable: (user.emailStatus && !user.emailStatus.deliverable)
      }
    });
};

exports.findByPasswordResetToken = function(resetToken) {
  if(!resetToken || !resetToken.length) return Promise.reject(new errors.PreconditionFailedError('Reset token missing or invalid'));

  // find a user by password reset token
  return User.findOne({ passwordResetToken: resetToken, passwordResetTokenExpires: { $gt: Date.now() } }).exec()
    .then(user => {
      if (!user) {
        const err = new errors.ResourceNotFoundError('Password reset token is invalid or has expired')
        return Promise.reject(err);
      }
      return user;
    });
};

exports.updatePasswordUsingResetToken = function(resetToken, newPassword) {
  return this.findByPasswordResetToken(resetToken)
  .then(user => {
    if (!user) {
      const err = new errors.ResourceNotFoundError('User not found')
      return Promise.reject(err);
    }

    user.password = newPassword;
    user.confirmedAt = user.confirmedAt || new Date();

    return user.save();
  });
};

exports.createUser = function(userData) {
  const newUser = new User(userData);
  return newUser.save();
}

exports.generateInvite = function(member) {

  let memberUser;
  const expireDuration = 7 * 24 * 3600000; // 1 week
  return this.findByEmail(member.email)
    .then(user => {

      if (!user) {
        log.info(`creating new user for member invite ${member.email}`);
        const userData = {
          email: member.email.toLowerCase(),
          name: `${member.firstName} ${member.lastName}`.trim(),
          password: `invited ${new Date()}`,
          memberUserKey: uuid(),
          source: 'member-invite'
        };
        return this.createUser(userData);
      }

      log.info(`found user for member invite ${member.email}`);
      return user;
    }).then(user => {
      memberUser = user;
      member.memberUserKey = user.memberUserKey;
      member.lastInvitedAt = new Date();
      member.inviteCount = member.inviteCount + 1;
      return member.save();
    }).then(member => {
      memberUser.passwordResetToken = uuid();
      memberUser.passwordResetTokenExpires = Date.now() + expireDuration;
      // ensure member role for invited member
      if(!memberUser.roles) memberUser.roles = [];
      if(!memberUser.roles.find(role => role === user_roles.member)) memberUser.roles.push(user_roles.member);
      return memberUser.save();
    });
};


exports.addUserToRole = function(user, role){
  if(!user.roles) user.roles = [];

  if(user.roles.find && user.roles.find(r => r === role)){
    return Promise.reject(new errors.PreconditionFailedError(`User having email address '${user.email}' already assigned to '${role}' role`));
  }
  user.roles.push(role);
  return user.save();
};
