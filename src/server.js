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
let isVoted = 0;
let saveVote = [];



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
    users.addUser(socket.id, params.name, params.room, role, null);

    callback();
  })

  socket.on('disconnect', () => {
    let user = users.removeUser(socket.id);
  })

  socket.on('startGame', (params) => {
    let user = users.addUser(socket.id, params.name, params.room);
    io.to(user.room).emit('updateUserList', users.getUserList(params.room));
    io.to(user.room).emit('updateUserRole', users.updateUserListRoles(params.room));
    io.to(user.room).emit('timerStart');

    updateUserCards(params);
 })







  socket.on('updateRounds', (rounds) => {
    let user = users.getUser(socket.id);
    rounds++
    if(rounds>=3){ 
      rounds = 0;
    }
    io.to(user.room).emit('newRounds', rounds);
  })


  socket.on('clickOnPlayer', (isDiscussion) => {
    let user = users.getUser(socket.id);
    console.log(user.role);
    
    if(isDiscussion == false) {
      if(user.role == "Killer") {
        io.to(user.id).emit('killPlayer');
      }
      else if(user.role == "Medic"){
        io.to(user.id).emit('healPlayer');
      }
      else if(user.role == "Passanger") {
        console.log("It's just a passanger");
      }
    }
    else if(isDiscussion == true) {
      console.log("IS DISCUSSION");
      io.to(user.room).emit('votePlayer');
    }
  })
  socket.on('isKilled', (clickedUser, params) => {
    users.isAlive(clickedUser, "isDead", params.room);
    isDeadUser = clickedUser;
  })
  socket.on('isHealed', (clickedUser, params) => {
    users.isAlive(clickedUser, "isHealed", params.room);
  })
  socket.on('isVoted', (clickedUser, params) => {
    //isVoted++;
    let someUser = users.getUserVote(params.room, params.name);
    console.log(someUser);
    if(someUser == null) {
      users.isAlive(clickedUser, `isVoted-`, params.room)
    }
    else if (someUser != null) {
      users.isAlive(clickedUser, `ALREADY VOTED MAN-`, params.room)
    }
  })




  socket.on('endRound', (isDiscussion, params) => {
    let dead = "isDead";
    let healed = "isHealed";
    let votedCount = isVoted;

    let deadUser = users.getUserAlive(dead, params.room);
    let healedUser = users.getUserAlive(healed, params.room);
    let userId = users.getUser(socket.id);
    let allUsers = users.getUserList(params.room);

    if(!isDiscussion) {
      if(deadUser.length >= 1) {
        for (let i = 0; i<1; i++) {
          io.to(deadUser[i].id).emit('testDeath');
          io.to(deadUser[i].room).emit('updateDeadUser', isDeadUser);
          io.to(userId.room).emit('clearRoom');
          deadUser[i].alive = "alreadyDead";
        }
      }
      else if (healedUser.length >= 1) {
        for (let i = 0; i<1; i++) {
          io.to(userId.room).emit('clearRoom');
        }
      }
    }
    else if(isDiscussion) {
      if(votedCount >= (allUsers.length / 2)) {
        io.to(userId.room).emit('finalVote');
        io.to(userId.room).emit('clearRoom');
        isVoted = 0;
      }
      else {
        isVoted = 0;
      }

    }
  })






  socket.on('testRole', () => {
    // let user = users.getUserList(params.room);
    let user = users.getUser(socket.id);
    io.to(user.room).emit('testRole', users.getUser(socket.id));
  })
  socket.on('blackScreenPassanger', (params) => {
    let userList = users.getUserRoles("Passanger", params.room);
    for(let i = 0; i<userList.length; i++) {
      io.to(userList[i].id).emit('blackScreen');
    }
  });
  socket.on('blackScreenMedic', (params) => {
    let userList = users.getUserRoles("Medic", params.room);
    for(let i = 0; i<userList.length; i++) {
      io.to(userList[i].id).emit('blackScreen');
    }
  });
  socket.on('blackScreenKiller', (params) => {
    let userList = users.getUserRoles("Killer", params.room);
    for(let i = 0; i<userList.length; i++) {
      io.to(userList[i].id).emit('blackScreen');
    }
  });
  socket.on('whiteScreenKiller', (params) => {
    let userList = users.getUserRoles("Killer", params.room);
    for(let i = 0; i<userList.length; i++) {
      io.to(userList[i].id).emit('whiteScreen');
    }
  });
  socket.on('whiteScreenMedic', (params) => {
    let userList = users.getUserRoles("Medic", params.room);
    for(let i = 0; i<userList.length; i++) {
      io.to(userList[i].id).emit('whiteScreen');
    }
  });
  socket.on('whiteScreenPassanger', (params) => {
    let killer      = users.getUserRoles("Killer", params.room);
    let medic       = users.getUserRoles("Medic", params.room);
    let passangers  = users.getUserRoles("Passanger", params.room);
    for(let i = 0; i<passangers.length; i++) {
      io.to(passangers[i].id).emit('whiteScreen');
    }
    io.to(killer[0].id).emit('whiteScreen');
    io.to(medic[0].id).emit('whiteScreen');
  });
});

function updateUserCards(params) {
  let killer      = users.getUserRoles("Killer", params.room);
  let medic       = users.getUserRoles("Medic", params.room);
  let passangers  = users.getUserRoles("Passanger", params.room);
  for(let i = 0; i<passangers.length; i++) {
    io.to(passangers[i].id).emit('passangerCard');
  }
  io.to(killer[0].id).emit('killerCard');
  io.to(medic[0].id).emit('medicCard');
}

