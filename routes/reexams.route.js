var express = require('express');
var router = express.Router();
var Reexam = require('../models/reexam.model');

router.post('/add', async(req,res) => {
    const condition = {scheduleId: req.body.scheduleId}
    const oldReexam = await Reexam.findOne(condition)
    let data = {...req.body}

    if(oldReexam){
        data = {
            ...data,
            times: ++ oldReexam.times,
            status: 0
        }
        await Reexam.updateOne(condition, data)
        res.status(250).send('update successfully!')
    }else{
        data = {...data, times: 1}
        const reexam = new Reexam(data)
        await reexam.save(() => {
            res.status(250).send('add successfully!')
        })
    }
})

router.get('/getallreexamsbyuser/:id', async(req,res) => {
    const condition = {userId : req.params.id}
    const reexam = await Reexam.find(condition)
    .populate('doctorId')
    .populate('userId')
    .populate('scheduleId')
    res.json(reexam)
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
        const reexamData = await Reexam.findOne(condition)
        const confirmation = reexamData.confirmation
        set = {
            date: confirmation.date,
            begin: confirmation.begin,
            confirmation: null
        }
    }
    await Reexam.updateOne(condition,set)
    const reexam = await Reexam.findOne(condition)
    .populate('doctorId')
    .populate('userId')
    console.log(reexam);
    res.send(reexam)
      
})

router.get('/getallreexams',async (req,res) => {
    const reexams = await Reexam.find({})
    .populate('doctorId')
    .populate('userId')
    .sort({date: 1})
    res.send(reexams)
})

router.post('/delete', async(req,res) => {
    const condition = {_id: req.body.id}
    await Reexam.deleteOne(condition)
    res.send("Delete successfully!")
})

router.post('/examed', async(req,res) => {
    console.log(req.body);
    const condition = {_id: req.body.id}
    const set = {
        status: 1
    }
    await Reexam.updateOne(condition,set)
    res.send("update successfully")
})

router.get('/getallreexamsbydoctor/:id', async (req,res) => {
    const id = req.params.id
    const reexams = await Reexam.find({doctorId: id})
    .populate('doctorId')
    .populate('userId')
    .populate('scheduleId')
    .sort({date: 1})
    res.send(reexams)
})

router.post('/confirmation', async (req,res) => {
    const condition = { _id: req.body.id }

    const dataset = {
        date: req.body.date,
        begin: req.body.begin,
    }
    const set = { confirmation : dataset }
    console.log(set);
    await Reexam.updateOne(condition,set)
    res.send("update successfully!")
})

module.exports = router;
