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
    let user = users.addUser(socket.id, params.name, params.room, role, 0, 0);

    //let user = users.getUser(socket.id);
    let existingUser = users.getUsersFromRoom(params.room, user.name);

    if(existingUser[1]!=undefined) {
      users.removeUser(existingUser[1].id);
      return callback('There is already a user with that name in the game. Please choose a different one.');
    }

    io.to(user.room).emit('resetButtons');
    io.to(user.room).emit('updatePlayers', users.getUserList(params.room));

    callback();
  })

  socket.on('disconnect', () => {
    let user = users.removeUser(socket.id);
    if(user) {
      io.to(user.room).emit('removeUser', user.name);
      //socket.leave(user.room);
    }
  })

  socket.on('startGame', (params) => {
    let user = users.getUser(socket.id);
    let allRoomUsers = users.getRoom(params.room);
    io.to(user.room).emit('resetButtons');
    io.to(user.room).emit('gameStatusChange');
    io.to(user.room).emit('updateUserList', users.getUserList(params.room));
    io.to(user.room).emit(users.updateUserListRoles(params.room));
    
    for (let i = 0; i<allRoomUsers.length; i++) {
       io.to(allRoomUsers[i].id).emit('removeSelf', allRoomUsers[i].name);
    }


    io.to(user.room).emit('timerStart');


    updateUserCards(params);
 })





  socket.on('updateRounds', () => {
    let user = users.getUser(socket.id);
    io.to(user.id).emit('newRound');
  })

  socket.on('clickOnPlayer', (isDiscussion) => {
    let user = users.getUser(socket.id);

    if(isDiscussion == false) {
      if(user.role == "Killer") {
        io.to(user.id).emit('killPlayer');
      }
      else if(user.role == "Medic"){
        io.to(user.id).emit('healPlayer');
      }
    }
    else if(isDiscussion == true) {
      io.to(user.id).emit('votePlayer');
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
    users.isVoted(clickedUser, params.room);
  })
  

  



  socket.on('endRound', (params, isDiscussion) => {
    let dead = "isDead";
    let healed = "isHealed";

    let deadUser = users.getUserAlive(dead, params.room);
    let healedUser = users.getUserAlive(healed, params.room);
    let userId = users.getUser(socket.id);
    let votedPlayer = users.getHighestVote(params.room);

    if(!isDiscussion) {
      if(deadUser.length >= 1) {
        for (let i = 0; i<1; i++) {
          io.to(deadUser[i].id).emit('alertOnDeath');
          io.to(userId.room).emit('clearRoom');
          io.to(deadUser[i].room).emit('updateDeadUser', isDeadUser);
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
      if(votedPlayer != null) {
        let isVotedPlayer = votedPlayer.name;
        io.to(votedPlayer.id).emit('alertOnVote');
        io.to(userId.room).emit('clearRoom');
        io.to(votedPlayer.room).emit('updateVotedPlayer', isVotedPlayer);
        votedPlayer.alive = "alreadyVotedOut";
        if(votedPlayer.role != "Killer") {
          io.to(userId.room).emit('alertOnVoteNotKiller');
        }
        if(votedPlayer.role == "Medic") {
          io.to(userId.room).emit('alertOnVoteMedic');
        }
        else if(votedPlayer.role == "Killer") {
          io.to(userId.room).emit('alertOnVoteKiller');
        }
        users.refreshVotePoints(params.room);
      }
      else if (votedPlayer == null) {
        io.to(userId.room).emit('clearRoom');
        users.refreshVotePoints(params.room);
      }
    }
  })

  socket.on('resetStatus', (params) => {
     users.refreshVotePoints(params.room);
  })

  socket.on('checkEndGame', (params) => {
    let gameEnd = users.getUserRoleAndStatus(params.room);
    let usersExcept = users.getAllUsersExceptKiller(params.room);
    let killer = users.getUserRoles("Killer", params.room);

      if (gameEnd == 1) {
        for(let i = 0; i<usersExcept.length; i++) {
          io.to(usersExcept[i].id).emit('adminsWon');
        }
        io.to(killer[0].id).emit('killerLost');
        console.log('The killer lost. Good job.');
      }
      else if (gameEnd == 2) {
        io.to(params.room).emit('medicIsDead');
        console.log('The medic is dead.');
      }
      else if(gameEnd == 3) {
        io.to(params.room).emit('medicIsJailed');
        console.log('The medic is jailed.');
      }
      else if(gameEnd == 4) {
        for(let i = 0; i<usersExcept.length; i++) {
          io.to(usersExcept[i].id).emit('adminsLost');
        }
        io.to(killer[0].id).emit('killerWon');
        console.log('The killer won. Not cool, eh?');
      }
  })


  socket.on('setTimerEnd', () => {
    let thisUser = users.getUser(socket.id);
    io.to(thisUser.room).emit('setTimerEnd');
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

