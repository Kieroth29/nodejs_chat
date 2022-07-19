const { Server } = require('socket.io');
const { createServer } = require("http");

var app = require('./config/server');

const httpServer = createServer(app);
const ws = new Server(httpServer);

onlineUsers = []

ws.on('connection', function(socket){
    console.log("New connection established. ID " + socket.id);
    
    if(!onlineUsers.includes(socket.id)){
        onlineUsers.push(socket.id);
    }

    socket.emit('newConnection', {onlineUsers: onlineUsers});

    socket.on('disconnect', function(){
        console.log("User disconnected.");
    });

    socket.on('disconnecting', function(reason){
        socket.emit('userDisconnect', {id: socket.id});
        socket.broadcast.emit('userDisconnect', {id: socket.id});

        onlineUsers = onlineUsers.filter(function(f) { return f !== socket.id });
    });

    socket.on('clientMessage', function(data){
        socket.emit('clientMessage', data);

        socket.broadcast.emit('clientMessage', data);
    });
});

httpServer.listen(3000);

module.exports = app;
module.exports.ws = ws;