const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

const EquipmentSchema = new mongoose.Schema({
    seller: String,
    address: String,
    type: String,
    phone: String, 
    name: String,
    price: Number,
    quantity: Number,
    date: String,
    note: String,
});

const Equipment = mongoose.model('equipment', EquipmentSchema);
module.exports = Equipment;