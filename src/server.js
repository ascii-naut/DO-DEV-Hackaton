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

let isDeadUser = "";
let isHealedUser = "";



const {isRealString} = require('./assets/js/utils/isRealString')
const {Users} = require('./assets/js/utils/users');

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
  })

  socket.on('startGame', (params) => {
    let user = users.addUser(socket.id, params.name, params.room);
    io.to(user.room).emit('updateUserList', users.getUserList(params.room));
    io.to(user.room).emit('updateUserRole', users.updateUserListRoles());
    io.to(user.room).emit('timerStart');

    updateUserCards();
 })







  socket.on('updateRounds', (rounds) => {
    rounds++
    if(rounds>=3){ 
      rounds = 0;
    }
    socket.emit('newRounds', rounds);
  })


  socket.on('clickOnPlayer', () => {
    let user = users.getUser(socket.id);
    if(user.role == "Killer") {
      console.log("KILLER");
      socket.emit('killPlayer');
    }
    else if(user.role == "Medic"){
      console.log("MEDIC");
      socket.emit('healPlayer');
    }
    
    // else if(user.role == "Passanger"){
    //   console.log("PASSANGER");
    //   socket.emit('passPlayer');
    // }
  })
  socket.on('isKilled', (clickedUser) => {
    users.isAlive(clickedUser, "isDead");
    isDeadUser = clickedUser;
  })
  socket.on('isHealed', (clickedUser) => {
    users.isAlive(clickedUser, "isHealed");
  })





  socket.on('endRound', () => {
    let dead = "isDead";
    let healed = "isHealed";

    let deadUser = users.getUserAlive(dead);
    let healedUser = users.getUserAlive(healed);

    if(deadUser.length >= 1) {
      for (let i = 0; i<1; i++) {
        io.to(deadUser[i].id).emit('testDeath');
        io.to(deadUser[i].room).emit('updateDeadUser', isDeadUser);
        io.to(healedUser[i].room).emit('clearRoom');
        deadUser[i].alive = "alreadyDead";
      }
    }
    else if (healedUser.length >= 1) {
      for (let i = 0; i<1; i++) {
        io.to(healedUser[i].room).emit('clearRoom');
      }
    }
  })






  socket.on('testRole', () => {
    // let user = users.getUserList(params.room);
    let user = users.getUser(socket.id);
    io.to(user.room).emit('testRole', users.getUser(socket.id));
  })
  socket.on('blackScreenPassanger', () => {
    let userList = users.getUserRoles("Passanger");
    for(let i = 0; i<userList.length; i++) {
      io.to(userList[i].id).emit('blackScreen');
    }
  });
  socket.on('blackScreenMedic', () => {
    let userList = users.getUserRoles("Medic");
    for(let i = 0; i<userList.length; i++) {
      io.to(userList[i].id).emit('blackScreen');
    }
  });
  socket.on('blackScreenKiller', () => {
    let userList = users.getUserRoles("Killer");
    for(let i = 0; i<userList.length; i++) {
      io.to(userList[i].id).emit('blackScreen');
    }
  });

  socket.on('whiteScreenKiller', () => {
    let userList = users.getUserRoles("Killer");
    for(let i = 0; i<userList.length; i++) {
      io.to(userList[i].id).emit('whiteScreen');
    }
  });
  socket.on('whiteScreenMedic', () => {
    let userList = users.getUserRoles("Medic");
    for(let i = 0; i<userList.length; i++) {
      io.to(userList[i].id).emit('whiteScreen');
    }
  });
  socket.on('whiteScreenPassanger', () => {
    let killer      = users.getUserRoles("Killer");
    let medic       = users.getUserRoles("Medic");
    let passangers  = users.getUserRoles("Passanger");
    for(let i = 0; i<passangers.length; i++) {
      io.to(passangers[i].id).emit('whiteScreen');
    }
    io.to(killer[0].id).emit('whiteScreen');
    io.to(medic[0].id).emit('whiteScreen');
  });
});

function updateUserCards() {
  let killer      = users.getUserRoles("Killer");
  let medic       = users.getUserRoles("Medic");
  let passangers  = users.getUserRoles("Passanger");
  for(let i = 0; i<passangers.length; i++) {
    io.to(passangers[i].id).emit('passangerCard');
  }
  io.to(killer[0].id).emit('killerCard');
  io.to(medic[0].id).emit('medicCard');
}

