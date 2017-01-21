const Mongoose = require('mongoose');
//const Promise = require ('bluebird');
const Member = require('../models/member');
const errors = require('restify-errors');
// Use bluebird promises
//Mongoose.Promise = Promise;

/**
 * Get all Members
 * @returns (Promise) [Member]
 */
exports.getAll = function(){
  return Member.find().exec();
}

/**
 * Get Member
 * @returns (Promise) Member
 */
exports.get = function(id){
  if(!id) return Promise.reject(new errors.MissingParameterError('id was not provided'));
  const query = {'_id': id };
  return Member.findOne(query);
}

/**
 * Create new Members
 * @param {Member} member
 * @returns (Promise) new {Member}
 */
exports.create = function(member){
  if(member._id) return Promise.reject(new errors.InvalidContentError('Cannot create member using provided "_id".  It is system a generated property.'));
  let newMember = new Member(member);
  return newMember.save();
}

/**
 * Update existing Member
 * @param {Member} member
 * @returns (Promise) updated {Member}
 */
exports.update = function(id, member){

  if(!id) return Promise.reject(new errors.MissingParameterError('id was not provided'));
  if(!member) return Promise.reject(new errors.MissingParameterError('member was not provided'));
  if(member._id && member._id != id) return Promise.reject(new errors.InvalidArgumentError('id did not match member._id'));

  const query = {'_id': id };
  return Member.findOneAndUpdate(query, member, {upsert:false, new: true}).exec();
}
