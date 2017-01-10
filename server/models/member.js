const Mongoose      = require('mongoose');
const Promise       = require('bluebird');
const AddressSchema = require('./address');

// Use bluebird promises
Mongoose.Promise = Promise;

const phoneValidator = {
  validator: (value) => {
    return /\d{3}-\d{3}-\d{4}/.test(value);
  },
  message: '{VALUE} is not a valid phone number!'
};

// define the Member model schema
let MemberSchema = new Mongoose.Schema({
  email: String,
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
        /blue|green|white|red|orange|periwinkle/i.test(value);
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
  adultResident: String,
  websiteURL: String,
  optIn: Boolean,
  directorySubscription: Boolean
});


/**
 * The pre-save hook method.
 */
MemberSchema.pre('save', function saveHook(next) {
    return next();
});


module.exports = Mongoose.model('Member', MemberSchema);
