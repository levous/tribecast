const Mongoose = require('mongoose');
//const Promise = require ('bluebird');
const MongooseObjectId = require('mongoose').Types.ObjectId;
const Member = require('../models/member');
const User = require('../models/user');
const errors = require('restify-errors');
const uuidV1 = require('uuid/v1');
const PhoneNumber = require('awesome-phonenumber');
// Use bluebird promises
Mongoose.Promise = Promise;

/**
 * Get all Members
 * @returns (Promise) [Member]
 */
exports.getAll = function(){
  return Member.find().lean().exec();
}

/**
 * Get Member
 * @returns (Promise) Member
 */
exports.get = function(id){
  if(!id) return Promise.reject(new errors.MissingParameterError('id was not provided'));
  const query = {'_id': id };
  return Member.findOne(query).exec();
}

/**
 * Create new Member
 * @param {Member} member
 * @returns (Promise) new {Member}
 */
exports.create = function(member){
  if(member._id) return Promise.reject(new errors.InvalidContentError('Cannot create member using provided "_id".  It is system a generated property.'));
  let newMember = new Member(member);
  return newMember.save();
}

/**
 * publish Members
 * @param [{Member}] members
 * @returns (Promise) array of save results [{
 *          statusCode: Integer,
 *          statusMessage: String,
 *          errors: [err, ...]
 *          member:{JSON representation of member}
 *        }, ...]
 */
exports.publish = function(members){
  if(!Array.isArray(members)) return Promise.reject(new errors.InvalidArgumentError('Expected an array of members'));

  let batch = [];
  //TODO: this might need to be a bulk op in order to perform well.  Trying it the simple way to see if that is good enough for occassional import
  //TODO: runValidators? Mongoose docs say it has caveats but not exactly what
  //TODO: consider splitting into updates and inserts, then use: Model.insertMany
  members.forEach(member => {
    //TODO: check for matching email?
    if(member._id) {
      batch.push(Member.findOneAndUpdate({'_id': member._id }, member, {upsert:false, new: true, runValidators: true}).exec());
    } else {
      batch.push(Member.create(member));
    }
  });
  //TODO: exec the promises and then evaluate results.  Even though the promises execute async,
  //  the array was constructed in the same ordinality as the members argument.  So nulls should correspond to
  //  the originating record.  Construct a not found error if the indexed result was null for a member with an _id
  return Promise.all(batch);
}

/**
 * check for matching Members
 * @param [{Member}] members
 * @returns (Promise) array of matching results [
 *           {
 *             matchingFields: [String],
 *             member: {JSON representation of member}
 *           }, ...
 *         ]
 */
exports.checkMatches = function(members){
  console.log(members);
  if(!Array.isArray(members)) return Promise.reject(new errors.InvalidArgumentError('Expected an array of members'));

  const batch = members.map(member => {
    let queryParams = [];

    //sanity check
    if(!member.propertyAddress) member.propertyAddress = {};
    // MongooseObjectId.isValid returning true for almost anything.  So, have to include in the OR query because it's not reliable
    if(member.id && MongooseObjectId.isValid(member.id)) queryParams.push({_id: MongooseObjectId(member.id)});
    if(member.email) queryParams.push({email: member.email});
    if(member.propertyAddress.street) queryParams.push({'propertyAddress.street': member.propertyAddress.street});
    // query is looking for reasonable or'd matches
    const query = {$or: queryParams};

    return Member.find(query).exec()
      .then(results => {
        let bestMatch;
        if(results && results.length > 0) {
          // id? > email, address, fullname? > address, fullname? > email? > first record
          bestMatch = ( results.find(m => m._id === member.id) ) ||
          ( member.email && member.propertyAddress.street && member.lastName && member.firstName ? results.find(m => m.email === member.email && m.propertyAddress.street === member.propertyAddress.street && m.lastName === member.lastName && m.firstName === member.firstName) : null ) ||
          ( member.email && member.propertyAddress.street ? results.find(m => m.email === member.email && m.propertyAddress.street === member.propertyAddress.street) : null ) ||
          ( member.propertyAddress.street && member.lastName && member.firstName ? results.find(m => m.propertyAddress.street === member.propertyAddress.street && m.lastName === member.lastName && m.firstName === member.firstName) : null ) ||
          ( member.email ? results.find(m => m.email === member.email) : results[0] );
        }
        return bestMatch;
      })
  });

  //TODO: exec the promises and then evaluate results.  Even though the promises execute async,
  //  the array was constructed in the same ordinality as the members argument.  So nulls should correspond to
  //  the originating record.  Construct a not found error if the indexed result was null for a member with an _id
  return Promise.all(batch)
    .then(matchResults => {

      let results = matchResults.map((match, i) => {
        const member = members[i];
        if(!match) return {matchingFields: [], newRecord:member};
        let fieldMatches = [];


        if(match && match.email === member.email) {
          fieldMatches.push('email');
        }

        if(match.propertyAddress.street === member.propertyAddress.street) {
          fieldMatches.push('propertyAddress.street');
        }

        if(match.lastName === member.lastName) {
          fieldMatches.push('lastName');
        }

        if(match.firstName === member.firstName) {
          fieldMatches.push('firstName');
        }

        return {
          matchingFields: fieldMatches,
          newRecord:member,
          oldRecord:match
        }

      });

      return results;
    });
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

  //normalize phone numbers
  let mobilePhone = new PhoneNumber(member.mobilePhone, 'US');
  let homePhone = new PhoneNumber(member.homePhone, 'US');
  member.homePhone = homePhone.getNumber( 'national' );
  member.mobilePhone = mobilePhone.getNumber( 'national' );

  const query = {'_id': id };
  return Member.findOneAndUpdate(query, member, {upsert:false, new: true, runValidators: true}).exec();
}

/**
 * Associate the user account with the member record
 * @param ObjectId userId
 * @param ObjectId memberId
 * @returns (Promise) success or failure
 */
exports.assignUserMember = function(userId, memberId){

  if(!userId) return Promise.reject(new errors.MissingParameterError('user id was not provided'));
  if(!memberId) return Promise.reject(new errors.MissingParameterError('member id was not provided'));

  const key = uuidV1();
  const update = { '$set': { 'memberUserKey': key } }
  return Member.findOneAndUpdate({'_id': memberId }, update).exec()
  .then(member => {
    if(!member) throw new errors.InvalidArgumentError('No member found using provided memberId');
    return User.findOneAndUpdate({'_id': userId }, update);
  })
  .then(user => {
    if(!user) throw new errors.InvalidArgumentError('No user found using provided userId');
  });
}
