var express = require('express');
var router = express.Router();
var Doctor = require('../models/doctors.model');
var Schedule = require('../models/schedules.model');

const jwt = require('jsonwebtoken')


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

router.get('/getdoctor', async(req,res) => {
    const token = req.header('Authorization').replace('Bearer ', '')
    const data = jwt.verify(token, process.env.JWT_KEY)

    try {
        const doctor = await Doctor.findOne({ _id: data._id, 'tokens.token': token })
        if (!doctor) {
            throw new Error()
        }
        // console.log(typeof(doctor.date));
        const dataSending = {
            id: doctor._id,
            email: doctor.email,
            fullname: doctor.fullname,
            hometown: doctor.hometown,
            birthyear: doctor.birthyear,
            phone: doctor.phone,
            gender: doctor.gender
        }
        console.log(dataSending);
        res.send({dataSending})
        
    }catch{
        res.status(500).send("err")
    }
})

router.get('/getdoctorbyid/:id', async(req,res) => {
    const doctor = await Doctor.findOne({_id: req.params.id})
    res.json(doctor)
})

router.get('/gettopdoctor', async(req,res) => {
    let responseData = []
    let data = []
    const schedules = await Schedule.find({})
        for(var i of schedules){
            data.push(await Schedule.findOne({_id: i._id}).populate('doctorId').populate('userId'))
        }
    data = data.map(dt => dt.doctorId)

    data.reduce((res, val) => { 
        if (!res[val._id]) {
          res[val._id] = {
                _id: val._id,
                email: val._email,
                fullname: val.fullname,
                phone: val.phone,
                birthyear: val.birthyear,
                hometown: val.hometown,
                gender: val.gender,
                review: val.review,
                quantity : 0,
            };
          responseData.push(res[val._id])
        }
        res[val._id].quantity += 1;
        return res;
    }, {});

    responseData = responseData.sort((a,b) => {
        return b.quantity - a.quantity 
    })
    res.json(responseData)
})

router.get('/getalldoctors', async(req,res) => {
    const doctors = await Doctor.find({})
    res.json(doctors)
})

router.post('/login', async(req, res) => {
    try {
        const tokenDevices = 'Iphone'
        const { email, password } = req.body
        const doctor = await Doctor.findByCredentials(email, password)
        // console.log(doctor);
        if (!doctor) {
            return res.status(250).send({error: 'Login failed!'})
        }
        const token = await doctor.generateAuthToken(tokenDevices)
        // console.log("saaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
        console.log(token);
        // console.log(doctor);

        const data = {
            id: doctor._id,
            email: doctor.email,
            fullname: doctor.fullname,
            hometown: doctor.hometown,
            birthyear: doctor.birthyear,
            phone: doctor.phone,
            gender: doctor.gender
        }
        res.send({ data, token })
    } catch (error) {
        res.status(250).send(error)
    }
})

router.get('/logout', async(req,res) => {
    // console.log(req);
    const token = req.header('Authorization').replace('Bearer ', '')
    const data = jwt.verify(token, process.env.JWT_KEY)
    // console.log(data, token);
    try {
        const doctor = await Doctor.findOne({ _id: data._id, 'tokens.token': token })
        if (!doctor) {
            throw new Error()
        }
        // console.log(user);
        await doctor.removeAuthToken(token)

        res.status(250).send("logout successfully")
        
    }catch{
        res.status(500).send("err")
    }
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
    await Doctor.updateOne(condition,set)
    res.send('update successfully')
})

router.post('/delete', async(req,res) => {
    const condition = {_id : req.body._id }
    await Doctor.deleteOne(condition)
    res.send('Delete successfully')
})

router.post('/rate', async(req,res) => {
    const condition = {_id : req.body.doctorId }
    const data = await Doctor.findOne(condition)
    let flag = true
    let set = {}
    if(data){
        for(var i=0; i< data.review.length; i++){
            if(data.review[i].userId == req.body.userId){
                set = {
                    review: [...data.review.slice(0,i),
                        {
                            rating: req.body.rating,
                            comment: req.body.comment,
                            userId: req.body.userId,
                        },...data.review.slice(i+1)
                    ]
                }     
                flag = false
                break;
            }
        }
        if(flag) {
            set = {
                review: [...data.review,{
                    rating: req.body.rating,
                    comment: req.body.comment,
                    userId: req.body.userId,
                }]
            } 
        }
        await Doctor.updateOne(condition,set) 
        res.send('rate successfully')
    }
    

})

module.exports = router;
