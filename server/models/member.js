const Mongoose      = require('mongoose');
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
let MemberSchema = new Mongoose.Schema({
  memberUserKey: String,
  email: String,
  emailStatus:  { type: EmailStatusSchema, default: EmailStatusSchema },
  firstName: String,
  lastName: String,
  mobilePhone: {
    type: String,
    validate: phoneValidator
  },
  homePhone: {
    type: String,
    validate: phoneValidator
  },
  neighborhood: {
    type: String,
    validate: {
      validator: (value) => {
        /farmette|mado|selborne|grange|swann ridge/i.test(value);
      },
      message: 'Invalid neighborhood'
    }
  },
  propertyAddress: { type: AddressSchema, default: AddressSchema },
  alternateAddress: { type: AddressSchema, default: AddressSchema },
  originallyFrom: String,
  profession: String,
  passionsInterests:String,
  hobbies:String,
  children: String,
  adultResidents: String,
  websiteURL: String,
  optIn: Boolean,
  directorySubscription: Boolean,
  recordOriginNote: String,
  lastInvitedAt: Date,
  inviteCount: { type: Number, default: 0 }
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


module.exports = Mongoose.model('Member', MemberSchema);
