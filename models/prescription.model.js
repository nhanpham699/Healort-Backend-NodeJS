const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PrescriptionSchema = new mongoose.Schema({ 
    date: Date,
    medicine: [
        {   
            medicineId: { type: Schema.Types.ObjectId, ref: 'medicine' }, 
            price: Number,
            name: String,
            quantity: Number
        }
    ],
    scheduleId: { type: Schema.Types.ObjectId, ref: 'schedule' }, 
    doctorId: { type: Schema.Types.ObjectId, ref: 'doctor' },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    times: Number,
    note: String,
    disease: String,
    total: Number
});

const Prescription = mongoose.model('prescription', PrescriptionSchema);
module.exports = Prescription;
