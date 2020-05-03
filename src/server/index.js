var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

let users = {};

io.on('connection', function (socket) {
    // console.log('a user connected');

    const id = socket.handshake.query.id;
    console.log('polaczy ', id);


    // if (!users[id]) {
    //     users[id] = []//IMPORTANT:
    //     //Because a user can have more than one window open, an array of sockets is needed.
    // }
    // users[id].push(socket);
    users[id] = socket;

    socket.on('disconnect', function () {
        console.log('user disconnected');
    });

    // console.log(users[id][0].id);

    socket.on('chat message', function (id) {
        // console.log(id)
        // console.log(users)
        // console.log(users[id][0].id);
        // console.log('___________')
        // if (users[id] && users[id][0] && users[id][0].id) {
            // console.log('wysylam')
            socket.broadcast.to(users[id].id).emit('chat message');
        // }
    });

    socket.on('new conversation', function (id) {
        console.log('nowa konwersacja dla: ' ,id)
        // if (users[id] && users[id][0] && users[id][0].id) {
            socket.broadcast.to(users[id].id).emit('new conversation');
        // }
    })
});

http.listen(3000, function () {
    console.log('listening on *:3000');
})