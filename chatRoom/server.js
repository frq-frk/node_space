const express = require('express');
const http = require('http')
const path = require('path')
const socketio = require('socket.io')

const formatMessage = require('./utils/messages')
const {userJoin, getCurrentUser, getRoomUsers, userLeave} = require('./utils/users')
const app = express();

const server = http.createServer(app);

const io = socketio(server)

// set static folder
app.use(express.static(path.join(__dirname,'public')));
app.use(express.json())

const bot = 'Jarvis';

io.on('connection', (socket) => {

    socket.on('joinRoom', ({username, room}) => {

        const user = userJoin(socket.id, username, room);

        // display();

        socket.join(user.room);

        socket.emit('message', formatMessage(bot, 'welocme to the ChatRoom'));

        socket.broadcast.to(user.room).emit('message', formatMessage(bot, `${user.userName} has joined the chat`))


        // send users and room info
        io.to(user.room).emit('roomUsers', {
            room : user.room,
            users : getRoomUsers(room)
        })
    })

    // three types of emits
    // .emit() to the user only
    // .broadcast.emit() to all the users except the user
    // io.emmit() to all including the user
    

    // Listening for chatMessage
    socket.on('chatMessage', (msg) => {

        const user = getCurrentUser(socket.id)
        // console.log(user);
        io.to(user.room).emit('message', formatMessage(user.userName,msg));
    })


    socket.on('disconnect', () => {

        const user = userLeave(socket.id);

        if(user){
            io.to(user.room).emit('message', formatMessage(bot, `${user.userName} has left the chat`));
            
            // send users and room info
            io.to(user.room).emit('roomUsers', {
            room : user.room,
            users : getRoomUsers(user.room)
        })
        
        }
        
    })
})

const port = process.env.PORT || 3000;

// Listening
server.listen(port, () => {
    console.log("Server is listening on ",port);
});

