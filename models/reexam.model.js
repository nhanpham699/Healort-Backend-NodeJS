const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReexamSchema = new mongoose.Schema({ 
    date: Date,  
    begin: Number,
    doctorId: { type: Schema.Types.ObjectId, ref: 'doctor' },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    scheduleId: { type: Schema.Types.ObjectId, ref: 'schedule' },
    status: Number,
    total: Number
});

const Reexam = mongoose.model('reexam', ReexamSchema);
module.exports = Reexam;