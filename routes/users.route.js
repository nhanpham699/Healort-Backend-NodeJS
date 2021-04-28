const jwt = require('jsonwebtoken')
const { Router } = require('express');
var express = require('express');
var router = express.Router();
var User = require('../models/users.model');
const multer = require("multer");



var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads/images/users")
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + file.originalname)
    }
})
const upload = multer({storage: storage});

router.post('/login', async(req, res) => {
    try {
        const { email, password, tokenDevices } = req.body 
        const user = await User.findByCredentials(email, password)

        if (!user) {
            return res.status(250).send({error: 'Login failed!'})
        }

        const token = await user.generateAuthToken(tokenDevices)
        const data = {
            id: user._id,
            email: user.email,
            fullname: user.fullname,
            address: user.address,
            date: user.date,
            phone: user.phone,
            avatar: user.avatar,
            gender: user.gender
        }
        res.send({ data, token })
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/signup', async(req, res) => {
    const user = new User({
        email: req.body.email,
        password: req.body.password,
        fullname: req.body.fullname,
        phone: req.body.phone,
    })
    await user.save()
    res.send({action: true})
})

router.get('/logout', async(req,res) => {
    // console.log(req);
    const token = req.header('Authorization').replace('Bearer ', '')
    const data = jwt.verify(token, process.env.JWT_KEY)
    console.log(data, token);
    try {
        const user = await User.findOne({ _id: data._id, 'tokens.token': token })
        if (!user) {
            throw new Error()
        }
        // console.log(user);
        await user.removeAuthToken(token)

        res.status(250).send("logout successfully")
        
    }catch{
        res.status(500).send("err")
    }
})

router.get('/getuser', async(req,res) => {
    const token = req.header('Authorization').replace('Bearer ', '')
    const data = jwt.verify(token, process.env.JWT_KEY)

    try {
        const user = await User.findOne({ _id: data._id, 'tokens.token': token })
        if (!user) {
            throw new Error()
        }
        // console.log(typeof(user.date));
        const dataSending = {
            id: user._id,
            email: user.email,
            fullname: user.fullname,
            address: user.address,
            date: user.date,
            phone: user.phone,
            avatar: user.avatar,
            gender: user.gender
        }
        res.send({dataSending})
        
    }catch{
        res.status(500).send("err")
    }
})

router.get('/getallusers', async(req,res) => {
    User.find({}).then(data => {
        res.json(data)
    }).catch(err => {
        console.log(err)
    })
})

router.post('/update', upload.single('photo'), async(req,res) => {
    const condition = {_id : req.body.id }
    var set = {
        fullname: req.body.fullname,
        email: req.body.email,
        date: new Date(req.body.date),
        gender: req.body.gender,
        phone: req.body.phone,
        address: {
            city: req.body.city,
            district: req.body.district,
            ward: req.body.ward,
            street: req.body.street
        },
    }
    if(req.file){
        const avatar = '/' + req.file.path.replace('\\', "/").replace('\\', "/").replace('\\', "/");
        set = {...set, avatar: avatar}
    }
    User.updateOne(condition,set)
    .then(() => {        
        res.send('update successfully')
    }).catch( err => {
        res.send(err)
    })    
})

router.post('/delete', async(req,res) => {
    const condition = {_id : req.body._id }
    await User.deleteOne(condition)
    res.send('Delete successfully')
})

module.exports = router;
