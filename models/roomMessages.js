const mongoose = require('mongoose');
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
    }
});

module.exports = Item = mongoose.model('roomMessages', roomMessagesSchema);