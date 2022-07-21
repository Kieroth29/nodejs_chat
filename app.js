const fs = require("fs");
const { createServer } = require("https");
const { Server } = require('socket.io');

var app = require('./config/server');

const options = {
    key: fs.readFileSync(process.env.SERVER_KEY),
    cert: fs.readFileSync(process.env.SERVER_CERT),
};

const httpsServer = createServer(options, app);
const ws = new Server(httpsServer, {
    cors: {
        origin: 'https://chat.kieroth29.xyz'
    }
});

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

httpsServer.listen(3000);

module.exports = app;
module.exports.ws = ws;