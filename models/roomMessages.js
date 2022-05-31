const mongoose = require('mongoose');
const messageID = require("../util/roomIdGenerator.js"); //will use this for message id generator
const Schema = mongoose.Schema;

const roomMessagesSchema = new Schema ({
    room: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        default: 'guest'
    },
    dateEntry: {
        type: Date,
        default: Date.now(),
        required: true
    },
    content: {
        type: String,
        required: true
    },
    votes: {
        type: Number,
        required: true,
    },
    messageID: {
        type: String,
        required: true,
    }

});

module.exports = Item = mongoose.model('roomMessages', roomMessagesSchema);