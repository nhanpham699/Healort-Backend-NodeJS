var express = require('express');
var router = express.Router();
var Medicine = require('../models/medicines.model');
var Prescription = require('../models/prescription.model');


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

router.get('/getmedicinebyid/:id', async(req,res) => {
    const condition = {_id : req.params.id}
    const medicine = await Medicine.findOne(condition)
    res.json(medicine);
})

router.post('/purchase', async(req,res) => {
    for(let med of req.body.medicine){
        const medicine = await Medicine.findOne({_id: med.value})
        if(medicine){
            const condition = {_id: med.value}
            const set = {quantity: medicine.quantity - med.quantity*req.body.times}
            await Medicine.updateOne(condition,set)
            res.send("update successfully")
        }
    }
})

module.exports = router;
