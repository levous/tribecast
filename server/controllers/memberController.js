const Mongoose = require('mongoose');
const Promise = require ('bluebird');
const Member = require('../models/member');
// Use bluebird promises
Mongoose.Promise = Promise;

/**
 * Get all Members
 * @returns (Promise) [Member]
 */
exports.getAll = function(){
  
  return Member.find().exec();
}

/**
 * Create new Members
 * @param {Member} member
 * @returns (Promise) new {Member}
 */
exports.create = function(member){
  //TODO: validate member
  let newMember = new Member(member);
  return newMember.save();
}

/**
 * Update existing Member
 * @param {Member} member
 * @returns (Promise) updated {Member}
 */
exports.update = function(member){
  //TODO: validate member
  const query = {'_id': member.id }
  //TODO: convert to promise
  MyModel.findOneAndUpdate(query, member, {upsert:false}, function(err, doc){
    if (err) return res.send(500, { error: err });
    return doc
  });
}

