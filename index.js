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

var users = {};
var port = process.env.PORT || 3000

io.on('connection', (socket) => {
    
    var clientName="wrong";
    socket.on('get name',(name)=>{
        clientName=name;
        users[socket.id]=name;
        console.log(users,socket.id);
        socket.emit('header data',{"name":clientName,"id":socket.id});
        io.emit('connected-member',users);
        socket.broadcast.emit('connection message',{"msg":`${clientName} is connected on chat`})
    });
    
    socket.on("private message", (anotherSocketId, msg) => {
        socket.to(anotherSocketId).emit("private message", users[socket.id], msg);
    });

    // console.log('a user connected');
   
    socket.on('chat message', (msg) => {
        io.emit('chat message',{"msg":msg,"id":socket.id,"clientName":clientName});
    });


    socket.on('disconnect', () => {
      delete users[socket.id];
      io.emit('connected-member',users);
      // console.log('user disconnected');
    });
});

server.listen(port, () => {
  console.log(`listening on *:${port}`);
});