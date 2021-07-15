//main file of our page

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const users = {};

io.on('connection', (socket) => {
    
    var clientName="wrong";
    socket.on('get name',(name)=>{
        clientName=name;
        users[socket.id]=name;
        console.log(socket.id,"by name");
        socket.broadcast.emit('chat message',{"msg":`${clientName} is connected on chat`,"id":socket.id,"clientName":"Official"})
    });

    console.log('a user connected');
    socket.on('chat message', (msg) => {
        io.emit('chat message',{"msg":msg,"id":socket.id,"clientName":clientName});
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});