const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReexamSchema = new mongoose.Schema({ 
    date: Date,  
    begin: Number,
    doctorId: { type: Schema.Types.ObjectId, ref: 'doctor' },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    scheduleId: { type: Schema.Types.ObjectId, ref: 'schedule' },
    status: Number,
    times: Number,
    problem: String,
    note: String,
    confirmation: {
        date: Date,
        begin: Number
    },
});

const Reexam = mongoose.model('reexam', ReexamSchema);
module.exports = Reexam;