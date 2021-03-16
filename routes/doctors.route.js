var express = require('express');
var router = express.Router();
var Doctor = require('../models/doctors.model');

router.post('/signup', async(req, res) => {
    const doctor = new Doctor({
        email: req.body.email,
        password: req.body.password,
        fullname: req.body.fullname,
        phone: req.body.phone,
        birthyear: req.body.birthyear,
        hometown: req.body.hometown,
        gender: req.body.gender 
    })
    await doctor.save()
    res.send({action: true})
})

router.get('/getalldoctors', async(req,res) => {
    Doctor.find({}).then(data => {
        res.json(data)
    }).catch(err => {
        console.log(err)
    })
})

router.post('/update', async(req,res) => {
    const condition = {_id : req.body._id }
    const set = {
        fullname: req.body.fullname,
        email: req.body.email,
        birthyear: req.body.birthyear,
        gender: req.body.gender,
        phone: req.body.phone,
        hometown: req.body.hometown,
    }
    Doctor.updateOne(condition,set)
    .then(() => {        
        res.send('update successfully')
    }).catch( err => {
        res.send(err)
    })      
})

module.exports = router;
