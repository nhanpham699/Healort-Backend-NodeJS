var express = require('express');
var router = express.Router();
var Schedule = require('../models/schedules.model');

router.post('/add', async(req,res) => {
    // console.log(req.body);
    const schedule = new Schedule(req.body)
    schedule.save(() => {
        res.status(250).send('add successfully!')
    })
})

router.post('/update', async(req,res) => {
    console.log(req.body);

    const condition = {_id: req.body.id}
    const set = {
        date: req.body.date,
        begin: req.body.begin,
    }
    await Schedule.updateOne(condition,set)
    res.send("update successfully")
      
})

router.post('/delete', async(req,res) => {
    await Schedule.deleteOne({_id : req.body.id})
    res.send("Delete successfully!")
})


router.get('/getallschedules/:id',async (req,res) => {
    const id = req.params.id
    let responseData = []
    const schedules = await Schedule.find({userId : id})
        for(var i of schedules){
            responseData.push(await Schedule.findOne({_id: i._id}).populate('doctorId'))
        }
    res.send(responseData)
})


router.get('/getallschedules',async (req,res) => {
    let responseData = []
    const schedules = await Schedule.find({})
        for(var i of schedules){
            responseData.push(await Schedule.findOne({_id: i._id}).populate('doctorId').populate('userId'))
        }
    res.send(responseData)
})

module.exports = router;
