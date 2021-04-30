var express = require('express');
var router = express.Router();
var Notification = require('../models/nofification.model');

router.post('/add', async(req,res) => {
    const notification = new Notification(req.body)
    await notification.save(() => {
        res.status(250).send('add successfully!')
    })
})

router.post('/update', async(req,res) => {
    const condition = {_id: req.body.id}
    const set = { status : 1}
    await Notification.updateOne(condition,set)
    .then(() => {
        res.send("update successfully")
    })
})

router.get('/getnotificationsbydoctor/:id', async (req,res) => {
    const condition = {doctorId : req.params.id}
    const notification = await Notification.find(condition)
    .populate('userId')
    .sort({date: -1})
    .limit(10)
    
    res.json(notification)
})  

router.get('/getnotificationsbyuser/:id', async (req,res) => {
    const condition = {userId : req.params.id}
    const notification = await Notification.find(condition)
    .populate('doctorId')
    .populate('scheduleId')
    .populate('reexamId')
    .sort({date: -1})
    .limit(10)

    res.json(notification)
}) 

module.exports = router;
