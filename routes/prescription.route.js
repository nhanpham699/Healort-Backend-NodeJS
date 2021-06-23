var express = require('express');
var router = express.Router();
var Prescription = require('../models/prescription.model');

router.post('/addpres', async(req,res) => {
    const pres = new Prescription(req.body)
    await pres.save()
    res.send({action: true}) 
})

router.get('/getallpres/:id', async(req, res) => {
    const pres = await Prescription.find({userId: req.params.id})
    .populate('doctorId')
    .populate('scheduleId')
    res.json(pres)
})

router.post('/delete', async(req, res) => {
    await Prescription.deleteOne({_id : req.body.id})
    res.send("Delete successfully")
})

router.get('/getallprescriptions', async(req, res) => {
    const pres = await Prescription.find()
    .populate('doctorId')
    .populate('userId')
    res.json(pres)
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
