require('dotenv').config();

const port = process.env.PORT || 8080

const express = require('express');
const app = express();
const mongoose = require('mongoose');
// const fileUpload = require('express-fileupload');
var cors = require('cors');
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')

var path = require('path');

// const socketio = require('socket.io');
const http = require('http');
const server = http.createServer(app);



var usersRouter = require('./routes/users.route');
var doctorsRouter = require('./routes/doctors.route');
var schedulesRouter = require('./routes/schedules.route');



server.listen(port, () => {
    console.log('listening on *:' + port);
  });

app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads',express.static(path.join(__dirname, '/uploads')));  

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));
// app.use(fileUpload());
// app.use(logger('dev'));

mongoose.connect(process.env.MONGO_URL, (err) =>{
    if(err) console.log("Error! " + err);
    else console.log("successful mongoose conection!"); 
});

app.use('/users', usersRouter);
app.use('/doctors', doctorsRouter)
app.use('/schedules', schedulesRouter)