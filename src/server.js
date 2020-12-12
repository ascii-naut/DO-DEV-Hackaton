const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const port = process.env.PORT || 3000;
let app = express();
let server = http.createServer(app);
let io = socketIO(server);
app.use(express.static(__dirname + '/'));
server.listen(port, ()=> {
  console.log(`Server is up on port ${port}.`)
});





const {isRealString} = require('./assets/js/utils/isRealString')
const {Users} = require('./assets/js/utils/users')

let users = new Users();
io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('join', (params, role, callback) => {
    if(!isRealString(params.name) || !isRealString(params.room)){
      return callback('Name and room are required.')
    }
    socket.join(params.room)

    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room, role);

    callback();
  })

  socket.on('disconnect', () => {
    let user = users.removeUser(socket.id);

    // if(user){
    //   io.to(user.room).emit('updateUserList', users.getUserList(user.room));
    // }
  })

  socket.on('testUpdate', (params, role) => {
    // let user = users.removeUser(socket.id);
    let user = users.addUser(socket.id, params.name, params.room, role);
    io.to(user.room).emit('updateUserList', users.getUserList(params.room));
    io.to(user.room).emit('updateUserRole', users.getUserRole(params.room));
 })

  socket.on('getThis', (data) => {
    users.addUserRole(socket.id, data);
    io.to(user.room)
  })
});

