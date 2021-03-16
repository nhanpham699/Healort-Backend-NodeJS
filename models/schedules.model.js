const mongoose = require('mongoose');

const ScheduleSchema = new mongoose.Schema({ 
    date: Date,  
    begin: Number,
    end: Number,
    services: [],
    doctorId: String,
    userId: String,
    note: String
});

const Schedule = mongoose.model('schedule', ScheduleSchema);
module.exports = Schedule;