var express = require('express');
var router = express.Router();
var Schedule = require('../models/schedules.model');

router.post('/add', async(req,res) => {
    console.log(req.body);
    const schedule = new Schedule(req.body)
    schedule.save(() => {
        res.status(250).send('add successfully!')
    })
})

router.get('/getallschedules', async(req,res) => {
    Schedule.find({})
    .then(data => {
        res.json(data)
    })
})


module.exports = router;
