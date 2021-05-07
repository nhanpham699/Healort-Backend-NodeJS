
var express = require('express');
var router = express.Router();
var Absence = require('../models/absence.model');

router.post('/add', async(req, res) => {
    console.log(req.body)
    const absence = new Absence(req.body)
    await absence.save()
    res.send("create succuessfully")
})

router.get('/getallabsences/:id', async(req, res) => {
    const condition = { doctorId: req.params.id } 
    const absence = await Absence.find(condition)
    res.send(absence)
})

router.get('/getallabsences', async(req, res) => {
    const absence = await Absence.find().populate("doctorId")
    res.send(absence)
})

module.exports = router;
