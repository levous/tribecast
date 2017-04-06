const crypto = require("crypto");

const uuid = function() {
  return crypto.randomBytes(16).toString("hex");
}

module.exports = uuid;
