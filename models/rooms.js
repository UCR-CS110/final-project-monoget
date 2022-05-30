const mongoose = require("mongoose");

//is used to create the schema
const Schema = mongoose.Schema; //fields and data types within the database

const RoomSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  id : {
      type: String,
      required: true
  }
});

module.exports = Item = mongoose.model('rooms', RoomSchema);