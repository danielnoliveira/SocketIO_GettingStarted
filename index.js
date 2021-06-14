const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const {Server} = require('socket.io');
const io = new Server(server);

const users = {};

app.get('/',(req,res)=>{
  res.sendFile(__dirname+'/index.html');
});

io.on('connect',socket => {
  console.log('a user conected: ',socket.id);
  socket.on('disconnect',()=>{
    socket.broadcast.emit('chat message','system',`${users[socket.id]} disconnected from chat`,'d');
    delete users[socket.id];
    io.emit('users connected',users);
  });
  socket.on('my nickname',nickname => {
    users[socket.id] = nickname;
    io.emit('users connected',users);
    socket.broadcast.emit('chat message','system',`${users[socket.id]} connected to chat`,'c');
  });
  socket.on('user is typing',user => {
    socket.broadcast.emit('someone is typing',user);
  });

  socket.on('chat message', (msg) => {
    //socket.to(`room#${socket_id}`).emit('chat message',users[socket.id],msg);
    socket.broadcast.emit('chat message', users[socket.id] ,msg);
  });
});

server.listen(3000,()=>{
  console.log('Server running!!!!');
});