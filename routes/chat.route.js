
var express = require('express');
var router = express.Router();
var Chat = require('../models/chat.model');

router.post('/createRoom', async(req, res) => {
    const { room } = req.body;
    const isCheck = await Chat.findOne({ room: room })
    if(!isCheck) {
        const chat = new Chat({ room: room })
        await chat.save()
        res.send("create succuessfully")
    }
})

router.get('/showMessages/:room',  async(req, res) => {
    const { room } = req.params;
    const data = await Chat.findOne({ room: room })
    res.json(data)
})

router.get('/getUserListMessages/:id', async(req, res) => {
    const chat = await Chat.find()
    const list = chat.filter(dt => {
        const id = dt.room.slice(dt.room.indexOf("_") + 1);
        return id == req.params.id
    })
    res.json(list)
})

router.get('/getDoctorListMessages/:id', async(req, res) => {
    const chat = await Chat.find()
    const list = chat.filter(dt => {
        const id = dt.room.slice(0, dt.room.indexOf("_"));
        return id == req.params.id
    })
    res.json(list)
})



module.exports = router;
