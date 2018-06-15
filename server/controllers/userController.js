const Mongoose = require('mongoose');

const moment = require('moment');

//const Promise = require ('bluebird');
const Member = require('../models/member');
const User = require('../models/user');
const AuditArchive = require('../models/auditArchive');
const errors = require('../../shared-modules/http-errors');
const log = require('../modules/log')(module);
const uuid = require('../modules/uuid');
const user_roles = require('../../config/user_roles');

// Use bluebird promises
Mongoose.Promise = Promise;

exports.getAll = function(){

  return User
    .find()
    .select('-password -__v')
    .lean({ virtuals: true })
    .exec();
};

exports.findByUserAuthenticationToken = function(token) {
  // find a user by authentication token.  For now, this is simly user id
  return User.findById(token);
};

exports.findByEmail = function(email) {
  // find a user by email address
  return User.findOne({ email: email.toLowerCase() }).exec();
};

exports.findByMemberUserKey = function(memberUserKey) {
  // find a user by associate member user key
  return User.findOne({ memberUserKey: memberUserKey }).exec();
};

exports.findByMemberUserKeys = function(memberUserKeys) {
  // find a user by email address
  return User.find({ memberUserKey: { $in: memberUserKeys } }).exec();
};


/**
 * Get Users updated since 
 * @returns (Promise) [Users]
 */
exports.findUpdatedSince = function(since){
  if(!since) return Promise.reject(new errors.MissingParameterError('since [date] was not provided'));
  const query = {'updatedAt': {"$gt": since} };
  return User.find(query).exec();
}

exports.update = function(id, user){

  if(!id) return Promise.reject(new errors.MissingParameterError('id was not provided'));
  if(!user) return Promise.reject(new errors.MissingParameterError('user was not provided'));
  if(user._id && user._id != id) return Promise.reject(new errors.InvalidArgumentError('id did not match user._id'));
  user.updatedAt = moment();
  const query = {'_id': id };
  return User.findOneAndUpdate(query, user, {upsert:false, new: true, runValidators: true}).exec();
}

exports.forgotPassword = function(email) {
  return User.findOne({ email: email.toLowerCase() }).exec()
    .then(user => {
      if (!user) {
        const err = new errors.ResourceNotFoundError('No user found using provided email address')
        return Promise.reject(err);
      }

      user.passwordResetToken = uuid();
      user.passwordResetTokenExpires = Date.now() + (3600000 * 12); // 12 hour
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
  const expireDuration = 4 * 7 * 24 * 3600000; // 4 weeks
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
      memberUser.accessExpiresAt = moment().add(1, 'years');
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

exports.removeUserFromRole = function(user, role){
  const idx = user.roles.indexOf(role);
  if(idx > -1) {
    user.roles.splice(idx, 1);
    return user.save();
  } else {
    return Promise.reject(`User was not assigned to the '${role}' role`);
  }
};



exports.removeUserMembershipByMemberUserKey = function(memberUserKey){
  return exports.findByMemberUserKey(memberUserKey)
  .then(user => {
    if(!user) return Promise.reject(new errors.PreconditionFailedError(`User not found having memberUserKey '${memberUserKey}'`));
    user.roles = [];
    user.memberUserKey = null;
    console.log('saving user with no roles or muk');
    return user.save();
  });
};


/**
 * Delete existing User
 * @param {string} id
 * @returns (Promise) deleted {userId}
 */
exports.delete = function(id){

  if(!id) return Promise.reject(new errors.MissingParameterError('id was not provided'));

  const query = {'_id': id };

  return User.findOne(query).exec()
  .then(user => {
    const archive = new AuditArchive({user: user, operation: 'DELETE'});
    return Promise.all([archive.save(), user.remove()]);
  })
  .then(results => {
    const archiveResult = results[0];
    return {archiveId: archiveResult._id};
  });
}

exports.auditAuthCheck = function(user){
  //TODO: consider using a queue such as redis for performance if needed to scale
  const update = { '$set': { 'lastAuthCheckAt': moment().toDate() } };

  // this method of update does not change timestamps. We don't want to update timestamps when auditing auth check
  Mongoose.connection.db.collection('users').update(
    {'_id': user._id},
    update
  );

  console.log('updated? ', user.email)

  //return User.findOneAndUpdate({'_id': user._id }, update).exec();
}
