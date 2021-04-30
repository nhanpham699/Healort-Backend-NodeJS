const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationSchema = new mongoose.Schema({ 
    sender: String,
    date: Date,  
    title: String,
    body: String,
    doctorId: { type: Schema.Types.ObjectId, ref: 'doctor' },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    scheduleId: { type: Schema.Types.ObjectId, ref: 'schedule' },
    reexamId: { type: Schema.Types.ObjectId, ref: 'reexam' },
    status: Number
});

const Notification = mongoose.model('notification', NotificationSchema);
module.exports = Notification;