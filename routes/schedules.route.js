var express = require('express');
var router = express.Router();
var Schedule = require('../models/schedules.model');
var axios = require('axios')

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
    .sort({date: 1})
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
    .sort({date: 1})
    res.send(schedules)
})

router.get('/getallbydoctor/:id', async (req,res) => {
    const id = req.params.id
    const schedules = await Schedule.find({doctorId: id})
    .populate('doctorId')
    .populate('userId')
    .sort({date: 1})
    res.send(schedules)
})

router.post('/confirmation', async (req,res) => {
    const condition = { _id: req.body.id }
    const dataset = {
        date: req.body.date,
        begin: req.body.begin
    }
    const set = { confirmation : dataset }

    await Schedule.updateOne(condition,set)
    res.send("update successfully!")
})

function getMonday(d) {
    d = new Date(d);
    var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
    return new Date(d.setDate(diff));
}

router.get('/getschedulesbyweek/:week', async (req, res) => {
    const schedules = await Schedule.find({status: 1})
    const date = new Date()
    const currentMonth = date.getMonth()
    const { week } = req.params
    const d = getMonday(new Date()) 
    let firstDate = d

    
    if(week == 1){
        firstDate = new Date(d.setDate(d.getDate() - 7))
    }else if(week == 2){
        firstDate = new Date(d.setDate(d.getDate() - 7*2))
    }

    const schedulesMonth = schedules.filter(dt => dt.date.getMonth() == currentMonth)
    const dayArr = [firstDate.getDate()]
    for(let i=1; i<=6; i++){
        dayArr.push(new Date(firstDate.setDate(firstDate.getDate() + 1)).getDate())
    } 

    const newData = schedulesMonth.filter(dt => dayArr.indexOf(dt.date.getDate()) != -1 )

    const responseData = []

    newData.reduce((res, val) => { 
        if (!res[val.date.getDate()]) {
          res[val.date.getDate()] = {
                date: val.date.getDate(),  
                total: 0,
                quantity: 0,
            };
          responseData.push(res[val.date.getDate()])
        }
        res[val.date.getDate()].total += val.total 
        res[val.date.getDate()].quantity += 1 
        return res
    }, {});

    res.json(responseData);

})

router.get('/getschedulesbyyear/:year', async (req, res) => {
    const schedules = await Schedule.find()
    const yearData = schedules.filter(dt => {
        return dt.date.getFullYear() == req.params.year && dt.status == 1
    })
    const responseData = []

    yearData.reduce((res, val) => { 
        if (!res[val.date.getMonth() + 1]) {
          res[val.date.getMonth() + 1] = {
                month: val.date.getMonth() + 1,  
                total: 0,
                quantity: 0,
            };
          responseData.push(res[val.date.getMonth() + 1])
        }
        res[val.date.getMonth() + 1].total += val.total 
        res[val.date.getMonth() + 1].quantity += 1 
        return res
    }, {});

    const newData = responseData.sort((a,b) => {
        return a.month - b.month
    })

    res.json(newData)
})


const n = 3600000

setInterval( async() => { 
    try {
        const currentDate = new Date()
        const date = currentDate.getDate()
        const hour = currentDate.getHours() + 1
        await Schedule.find()
        .populate("userId")
        .populate("doctorId")
        .then(async (data) => {
            const schedule = data.filter(dt => {
                return dt.date.getDate() == date && dt.begin == hour
            })
        
            const newData = schedule.map(dt => {
                return { userTokens: dt.userId.tokens, doctorTokens: dt.doctorId.tokens}
            })
            // console.log(newData);
            for(let i of newData){
                for(let token of i.userTokens){
                    await sendPushNotification(token.tokenDevices)
                }
                for(let token of i.doctorTokens){
                    await sendPushNotification(token.tokenDevices)
                }
            }
        })
    }catch {
        console.log("err");
    }
    
}, n)

async function sendPushNotification(expoPushToken) {
    const message = {
        to: expoPushToken,
        sound: 'default',
        title: 'Schedule reminder',
        body: 'You have an appointment in the next hour',
        data: { someData: 'goes here' },
    }

    console.log(message);
    await axios.post('https://exp.host/--/api/v2/push/send', JSON.stringify(message), {
        headers: {
            Accept: 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
          }
       
    }).then(()=>{
        console.log('jihih');
    }).catch((e)=>{
        console.log('err',e);
    });
 }
module.exports = router;
