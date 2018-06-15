const Mongoose      = require('mongoose');
const mongooseLeanVirtuals = require('mongoose-lean-virtuals');
const Promise       = require('bluebird');
const AddressSchema = require('./address');
const EmailStatusSchema = require('./emailStatusSchema');
// Use bluebird promises
Mongoose.Promise = Promise;

const phoneValidator = {
  validator: (value) => {
    return /\(\d{3}\) \d{3}-\d{4}/.test(value) || !value;
  },
  message: '{VALUE} is not a valid phone number!'
};

// define the Member model schema
// I'm wishing I'd defined fields nounAdjective like phoneMobile and nameLast but oh well.
let MemberSchema = new Mongoose.Schema({
  memberUserKey: String,
  email: String,
  emailStatus:  { type: EmailStatusSchema, default: EmailStatusSchema },
  firstName: String,
  lastName: String,
  nameSuffix: String,
  mobilePhone: {
    type: String,
    validate: phoneValidator
  },
  homePhone: {
    type: String,
    validate: phoneValidator
  },
  officePhone: {
    type: String,
    validate: phoneValidator
  },
  neighborhood: {
    type: String,
    validate: {
      validator: (value) => {
        /^(farmette|mado|((upper|lower)\s)*selborne|((hillside)\s)grange|swann ridge|gainey lane|crossroads|textile lofts)$/i.test(value);
      },
      message: 'Invalid neighborhood'
    }
  },
  lotCode: String, // represents the real estate development lot number when applicable
  propertyAddress: { type: AddressSchema, default: AddressSchema },
  alternateAddress: { type: AddressSchema, default: AddressSchema },
  originallyFrom: String,
  profession: String,
  employer: String,
  passionsInterests:String,
  hobbies:String,
  children: String,
  adultResidents: String,
  websiteURL: String,
  residentSinceDate: Date,
  optIn: Boolean,
  directorySubscriptionActivatedAt: Date,
  directorySubscriptionExpiresAt: Date,
  recordOriginNote: String,
  lastInvitedAt: Date,
  inviteCount: { type: Number, default: 0 },
  profilePhoto: {
    thumbnailURL: String,
    fullsizeURL: String,
    uncroppedURL: String
  }
},
{
  timestamps: true
});


/**
 * The pre-save hook method.
 */
MemberSchema.pre('save', function saveHook(next) {
    return next();
});

MemberSchema.set('toJSON', {
  virtuals: true,
  versionKey:false,
  transform: function (doc, ret) {   delete ret._id  }
});

// Plugin must be *after* virtuals
MemberSchema.plugin(mongooseLeanVirtuals);

module.exports = Mongoose.model('Member', MemberSchema);
