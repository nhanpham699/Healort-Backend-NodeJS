var express = require('express');
var router = express.Router();
var Schedule = require('../models/schedules.model');

router.post('/add', async(req,res) => {
    // console.log(req.body);
    const schedule = new Schedule(req.body)
    await schedule.save(() => {
        res.status(250).send('add successfully!')
    })
})

router.post('/update', async(req,res) => {
    // console.log(req.body);
    const condition = {_id: req.body.id}
    let set = {}

    if(req.body.begin){
        set = {
            date: req.body.date,
            begin: req.body.begin,
            confirmation: null
        }
    }else {
        const scheduleData = await Schedule.findOne(condition)
        const confirmation = scheduleData.confirmation
        set = {
            date: confirmation.date,
            begin: confirmation.begin,
            confirmation: null
        }
    }
    await Schedule.updateOne(condition,set)
    const schedule = await Schedule.findOne(condition)
    .populate('doctorId')
    .populate('userId')
    // console.log(schedule);
    res.send(schedule)
      
})

router.post('/examed', async(req,res) => {
    // console.log(req.body);
    const condition = {_id: req.body.id}
    const set = {
        status: 1
    }
    await Schedule.updateOne(condition,set)
    res.send("update successfully")
})

router.post('/updateReexam', async(req,res) => {
    const condition = {_id: req.body.id}
    const set = {reexam: 1}
    await Schedule.updateOne(condition, set)
    res.send("update reexam successfully")
})

router.post('/updatePrescription', async(req,res) => {
    const condition = {_id: req.body.id}
    const set = {prescription: 1}
    await Schedule.updateOne(condition, set)
    res.send("update prescription successfully")
})

router.post('/delete', async(req,res) => {
    const condition = {_id: req.body.id}
    await Schedule.deleteOne(condition)
    res.send("Delete successfully!")
})


router.get('/getallschedules/:id',async (req,res) => {
    const id = req.params.id
    const schedules = await Schedule.find({userId: id})
    .populate('doctorId')
    .populate('userId')
    .sort({date: -1})
    res.send(schedules)
})

router.get('/getschedulebyid/:id', async(req, res) => {
    const condition = {_id: req.params.id}
    const schedule = await Schedule.findOne(condition)
    res.json(schedule)
})

router.get('/getallschedules',async (req,res) => {
    const schedules = await Schedule.find({})
    .populate('doctorId')
    .populate('userId')
    .sort({date: -1})
    res.send(schedules)
})

router.get('/getallbydoctor/:id', async (req,res) => {
    const id = req.params.id
    const schedules = await Schedule.find({doctorId: id})
    .populate('doctorId')
    .populate('userId')
    .sort({date: -1})
    res.send(schedules)
})

router.post('/confirmation', async (req,res) => {
    const condition = { _id: req.body.id }

    const dataset = {
        date: req.body.date,
        begin: req.body.begin,
    }
    const set = { confirmation : dataset }
    console.log(set);
    await Schedule.updateOne(condition,set)
    res.send("update successfully!")
})

module.exports = router;
