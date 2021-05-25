var express = require('express');
var router = express.Router();
var Service = require('../models/services.model');


router.get('/getallservices', async(req, res) => {
    const services = await Service.find({})
    res.json(services)
})



router.post('/add', async(req, res) => {
    const services = new Service({
        name: req.body.name,
        price: Number(req.body.price),
    })
    await services.save()
    res.send({action: true})
})

router.post('/update', async(req,res) => {
    const condition = {_id : req.body._id }
    const set = {
        name: req.body.name,
        price: Number(req.body.price),
    }
    await Service.updateOne(condition,set)
    res.send('update successfully')
})

router.post('/delete', async(req,res) => {
    const condition = {_id : req.body._id }
    await Service.deleteOne(condition)
    res.send('Delete successfully')
})

module.exports = router;
