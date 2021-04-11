const mongoose = require('mongoose');
const chatSchema = new mongoose.Schema({
    messages: [],
    room: String,
});
const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;