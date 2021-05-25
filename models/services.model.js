const mongoose = require('mongoose');
const serviceSchema = new mongoose.Schema({
    name: String,
    price: Number,
});
const Service = mongoose.model('Service', serviceSchema);
module.exports = Service;