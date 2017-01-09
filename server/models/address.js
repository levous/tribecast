import Mongoose from 'mongoose';

let AddressSchema = new Mongoose.Schema({
    street: String,
    street2: String,
    city: String,
    state: String,
    zip: String,
});

export default AddressSchema;
