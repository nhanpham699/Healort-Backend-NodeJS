var express = require('express');
var router = express.Router();
var Reexam = require('../models/reexam.model');

router.post('/add', async(req,res) => {
    const reexam = new Reexam(req.body)
    await reexam.save(() => {
        res.status(250).send('add successfully!')
    })
})

router.get('/getallreexamsbyuser/:id', async(req,res) => {
    const condition = {userId : req.params.id}
    const reexam = await Reexam.find(condition)
    .populate('doctorId')
    .populate('userId')
    .populate('scheduleId')
    res.json(reexam)
})

module.exports = router;
