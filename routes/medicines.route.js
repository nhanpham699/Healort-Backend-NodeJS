var express = require('express');
var router = express.Router();
var Medicine = require('../models/medicines.model');

router.get('/getallmedicines', async(req, res) => {
    const medicine = await Medicine.find({})
    res.json(medicine)
})

router.post('/add', async(req, res) => {
    const medicine = new Medicine({
        name: req.body.name,
        quantity: Number(req.body.quantity),
        type: req.body.type,
        price: Number(req.body.price),
        seller: req.body.seller,
        date: req.body.date,
    })
    await medicine.save()
    res.send({action: true})
})

router.post('/update', async(req,res) => {
    const condition = {_id : req.body._id }
    const set = {
        name: req.body.name,
        quantity: Number(req.body.quantity),
        type: req.body.type,
        price: Number(req.body.price),
        seller: req.body.seller,
        date: req.body.date,
    }
    await Medicine.updateOne(condition,set)
    res.send('update successfully')
})

router.post('/delete', async(req,res) => {
    const condition = {_id : req.body._id }
    await Medicine.deleteOne(condition)
    res.send('Delete successfully')
})



module.exports = router;
