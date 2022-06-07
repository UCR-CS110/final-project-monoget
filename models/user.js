const mongoose = require("mongoose");

//is used to create the schema
const Schema = mongoose.Schema; //fields and data types within the database

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
      type: String,
      required: true
  },
  email: {
    type: String,
    unique: true
  },
});

module.exports = Item = mongoose.model('UserData', UserSchema);