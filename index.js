const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const ss = require('@sap_oss/node-socketio-stream');

app.use(express.static('public'))

app.get('/', (req, res) => {
    var room = makeid(6);
    console.log(room);
    res.redirect(room);
})

app.get('/:room', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
})

io.on('connection', (socket) => {
    var query = socket.handshake.query;
    let room = query.room;
    if(!room) {
        room = makeid(6);
    }
    socket.join(room);
    socket.on('synctext', (text) => {
        socket.to(room).emit('synctext', text);
    })
    socket.to(room).emit('new-join');
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});

function makeid(length) {
    var result           = '';
    var characters       = 'abcdefghijklmnopqrstuvwxyz123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}