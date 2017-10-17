const Mongoose = require('mongoose');

let AddressSchema = {
    street: String,
    street2: String,
    city: String,
    state: String,
    zip: String
};

module.exports = AddressSchema;
