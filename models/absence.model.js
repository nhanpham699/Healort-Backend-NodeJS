const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const absenceSchema = new mongoose.Schema({
    dates: [],
    reason: String,
    doctorId: { type: Schema.Types.ObjectId, ref: 'doctor' }
});
const Absence = mongoose.model('Absence', absenceSchema);
module.exports = Absence;