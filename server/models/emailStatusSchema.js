const Mongoose = require('mongoose');

let EmailStatusSchema = {
  smtpCode: Number,
  smtpDescription: String,
  verifiedAt: Date,
  deliverable: {type: Boolean, default: true}
};

module.exports = EmailStatusSchema;
