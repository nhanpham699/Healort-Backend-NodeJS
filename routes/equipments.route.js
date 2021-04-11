var express = require('express');
var router = express.Router();
var Equipment = require('../models/equipment.model');

router.get('/getallequipments', async(req, res) => {
    const equipment = await Equipment.find({})
    res.json(equipment)
})

router.post('/add', async(req, res) => {
    const equipment = new Equipment({
        seller: req.body.seller,
        address: req.body.address,
        phone: req.body.phone, 
        name: req.body.name,
        price: Number(req.body.price),
        quantity: Number(req.body.quantity),
        type: req.body.type,
        date: req.body.date,
        note: req.body.note,
    })
    await equipment.save()
    res.send({action: true})
})

router.post('/update', async(req,res) => {
    const condition = {_id : req.body._id }
    const set = {
        seller: req.body.seller,
        address: req.body.address,
        phone: req.body.phone, 
        name: req.body.name,
        price: Number(req.body.price),
        quantity: Number(req.body.quantity),
        type: req.body.type,
        date: req.body.date,
        note: req.body.note,
    }
    await Equipment.updateOne(condition,set)
    res.send('update successfully')
})

router.post('/delete', async(req,res) => {
    const condition = {_id : req.body._id }
    await Equipment.deleteOne(condition)
    res.send('Delete successfully')
})



module.exports = router;
