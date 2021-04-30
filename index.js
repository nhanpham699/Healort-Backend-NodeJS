require('dotenv').config();

const port = process.env.PORT || 8080

const express = require('express');
const app = express();
const mongoose = require('mongoose');
// const fileUpload = require('express-fileupload');
var cors = require('cors');
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
// const fileUpload = require('express-fileupload');
var path = require('path');

const socketio = require('socket.io');
const http = require('http');
const server = http.createServer(app);
const io = socketio(server, {
  cors: true
});

const Chat = require('./models/chat.model')

var usersRouter = require('./routes/users.route');
var doctorsRouter = require('./routes/doctors.route');
var schedulesRouter = require('./routes/schedules.route');
var reexamsRouter = require('./routes/reexams.route');
var chatRouter = require('./routes/chat.route');
var medicinesRouter = require('./routes/medicines.route');
var equipmentsRouter = require('./routes/equipments.route');
var notificationsRouter = require('./routes/notifications.route');


server.listen(port, () => {
    console.log('listening on *:' + port);
});

app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads',express.static(path.join(__dirname, '/uploads')));  
// app.use(fileUpload());
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
app.use('/chats', chatRouter)
app.use('/medicines', medicinesRouter)
app.use('/equipments', equipmentsRouter)
app.use('/notifications', notificationsRouter)
app.use('/reexams', reexamsRouter)




const { addUser, removeUser, getUser, getUsersInRoom } = require('./config/users');


io.on("connection", socket => {
  socket.on('join', ({ name, room }, callback) => {
      const { error, user } = addUser({ id: socket.id, name, room })

      if(error) return callback(error);

      socket.join(user.room)
  })

  socket.on('sendMessage', (message, callback) => {
      const user = getUser(socket.id)

      io.to(user.room).emit('message', { user: user.name, data: message })

      Chat.findOne({ room: user.room })
      .then(data => {
          console.log(message[0]);
          let { messages } = data;
          messages.unshift(message[0]);
          const newMessages = messages
          const condition = {room: user.room}
          const set = {messages: newMessages}
        //   console.log(user.room, newMessages);
          Chat.updateOne(condition, set)
          .then(() => {})
      })
  })
  socket.on('dis', () => {
    console.log('user had left!!!!');
    const user = removeUser(socket.id);
  })
});
