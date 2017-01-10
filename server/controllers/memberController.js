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

/*  var body = req.body;
  req.pet.name = body.pet.name;
  res.message('Information updated!');
  res.redirect('/pet/' + req.pet.id);
};*/
