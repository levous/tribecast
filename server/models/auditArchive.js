const Mongoose      = require('mongoose');
const Promise       = require('bluebird');

// Use bluebird promises
Mongoose.Promise = Promise;

// define the Member model schema
let AuditArchiveSchema = new Mongoose.Schema({
  member: Mongoose.Schema.Types.Mixed,
  operation: String
},
{
  timestamps: true
});

module.exports = Mongoose.model('AuditArchive', AuditArchiveSchema);
