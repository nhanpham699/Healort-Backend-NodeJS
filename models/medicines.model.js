const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MedicineSchema = new mongoose.Schema({ 
    name: String,
    quantity: Number,
    type: String,
    times: Number,
    price: Number,
    seller: String,
    date: String
});

const Medicine = mongoose.model('medicine', MedicineSchema);
module.exports = Medicine;