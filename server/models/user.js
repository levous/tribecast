const mongoose = require('mongoose');
const mongooseLeanVirtuals = require('mongoose-lean-virtuals');

const bcrypt = require('bcrypt');
const EmailStatusSchema = require('./emailStatusSchema');
// define the User model schema
const UserSchema = new mongoose.Schema({
  memberUserKey: String,
  email: {
    type: String,
    index: { unique: true }
  },
  emailStatus:  { type: EmailStatusSchema, default: EmailStatusSchema },
  password: String,
  name: String,
  roles: [String],
  source: String,
  passwordResetToken: String,
  passwordResetTokenExpires: Date,
  confirmedAt: Date,
  accessExpiresAt: Date,
  lastAuthCheckAt: Date
},
{
  timestamps: true
});


/**
 * Compare the passed password with the value in the database. A model method.
 *
 * @param {string} password
 * @returns {object} callback
 */
UserSchema.methods.comparePassword = function comparePassword(password, callback) {
  bcrypt.compare(password, this.password, callback);
};


/**
 * The pre-save hook method.
 */
UserSchema.pre('save', function saveHook(next) {
  const user = this;

  // proceed further only if the password is modified or the user is new
  if (!user.isModified('password')) return next();


  return bcrypt.genSalt((saltError, salt) => {
    if (saltError) { return next(saltError); }

    return bcrypt.hash(user.password, salt, (hashError, hash) => {
      if (hashError) { return next(hashError); }

      // replace a password string with hash value
      user.password = hash;

      return next();
    });
  });
});



UserSchema.set('toJSON', {
  virtuals: true,
  versionKey:false,
  transform: function (doc, ret) {   delete ret._id  }
});

// Plugin must be *after* virtuals
UserSchema.plugin(mongooseLeanVirtuals);

module.exports = mongoose.model('User', UserSchema);
