const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PrescriptionSchema = new mongoose.Schema({ 
    date: Date,
    medicineId: { type: Schema.Types.ObjectId, ref: 'medicine' },
    doctorId: { type: Schema.Types.ObjectId, ref: 'doctor' },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    note: String,
    total: Number
});

const Prescription = mongoose.model('medicine', PrescriptionSchema);
module.exports = Prescription;
