
var express = require('express');
var router = express.Router();
var Admin = require('../models/admin.model');

router.post('/login', async(req,res) => {
    const { username, password } = req.body
    const admin = await Admin.findOne({username: username, password: password})
    if(!admin){
        res.send({err: true})
    }
    res.send({err: false, admin: admin})
})




module.exports = router;
