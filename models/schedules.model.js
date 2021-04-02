const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ScheduleSchema = new mongoose.Schema({ 
    date: Date,  
    begin: Number,
    services: [],
    doctorId: { type: Schema.Types.ObjectId, ref: 'doctor' },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    note: String,
    status: Number
});

const Schedule = mongoose.model('schedule', ScheduleSchema);
module.exports = Schedule;