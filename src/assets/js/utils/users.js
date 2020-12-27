class Users {
    constructor() {
        this.users = [];
    }

    addUser(id, name, room, role, alive, vote) {
        let user = {id, name, room, role, alive, vote};
        this.users.push(user);
        return user;
    }

    removeUser(id) {
        let user = this.getUser(id);
        if(user){
            this.users = this.users.filter((user) => user.id !== id);
        }

        return user;
    }

    getUserList (room) {
        let users = this.users.filter((user) => user.room === room);
        let namesArray = users.map((user) => user.name);

        return namesArray;
    }

    updateUserVote (room, vote, clickedUser) {
        let user = this.users.filter((user) => user.room === room && user.id === clickedUser.id)[0];
        user.alive = vote;
        return user;
    }

    getUserVote(room, name) {
        let user = this.users.filter((user) => user.room === room && user.name === name)[0];
        let vote = user.alive;
        return vote;
        //return user;
    }

    getUsersFromRoom(room, name) {
        let user = this.users.filter((user) => user.room === room && user.name === name);
        return user;
    }

    updateUserListRoles (room, role1, role2) {
        let random1 = Math.floor(Math.random() * this.users.length);
        let random2 = Math.floor(Math.random() * this.users.length);
        role1 = "Killer";
        role2 = "Medic";

        if(random1!=random2) {
            let user = this.users.filter((user) => user.room === room)[random1];
            let user2 = this.users.filter((user) => user.room === room)[random2];
            user.role = role1;
            user2.role = role2;
        }
        else if(random1==random2 && random1==this.users.length-1 && random1>0) {
            random1--;
            let user = this.users.filter((user) => user.room === room)[random1];
            let user2 = this.users.filter((user) => user.room === room)[random2];
            user.role = role1;
            user2.role = role2;
        }
        else if(random1==random2 && random1==0) {
            random1++;
            let user = this.users.filter((user) => user.room === room)[random1];
            let user2 = this.users.filter((user) => user.room === room)[random2];
            user.role = role1;
            user2.role = role2;
        }
        else if(random1==random2 && random1>0 && random1<this.users.length-1) {
            random1--;
            let user = this.users.filter((user) => user.room === room)[random1];
            let user2 = this.users.filter((user) => user.room === room)[random2];
            user.role = role1;
            user2.role = role2;
         }
        }
    

    isAlive(playerName, status, room) {
        let user = this.users.filter((user) => user.name === playerName && user.room === room)[0];
        user.alive = status;
        return user;
    }

    isVoted(playerName, room) {
        let user = this.users.filter((user) => user.name === playerName && user.room === room)[0];
        user.vote += 1;
        return user;
    }

    resetStatus(room) {
        let user = this.users.filter((user) => user.room === room);
        for (let i = 0; i<user.length; i++) {
            user[i].vote = 0;
        }
    }

    refreshVotePoints(room) {
        let userList = this.users.filter((user) => user.room === room);
        for (let i = 0; i<userList.length; i++) {
            userList[i].vote = 0;
        }
    }

    getHighestVote(room) {
        let userList = this.users.filter((user) => user.room === room);
        let voteArray = [];
        let finalVote;
        // for(let i = 0; i<userList.length-1; i++) { ########### CHECK LATER
        for(let i = 0; i<userList.length; i++) {
            voteArray[i] = userList[i].vote;
        }

        finalVote = Math.max.apply(null, voteArray);
        let votedUser = this.users.filter((user) => user.room === room && user.vote === finalVote);

        if(votedUser.length == 1) {
            for(let a = 0; a<votedUser.length; a++) {
                console.log(votedUser[a].name);
                return votedUser[a];
            }
        }
        else if(votedUser.length > 1) {
            return null;
        }

    }

    getUser(id) {
        return this.users.filter((user) => user.id === id)[0];
    }

    getRoom(room) {
        let users = this.users.filter((user) => user.room === room);
        return users;
    }

    getUserRoles (role, room) {
        return this.users.filter((user) => user.role === role && user.room === room);
    }

    getUserRoleAndStatus(room) {
        let killer = this.users.filter((user) => user.room === room && user.role === "Killer")[0];
        let medic = this.users.filter((user) => user.room === room && user.role === "Medic")[0];

        let allPlayers = this.users.filter((user) => user.room === room);
        let deadPlayers = this.users.filter((user) => user.room === room && user.alive === "alreadyDead" || user.alive === "alreadyVotedOut");

        if(medic.alive == 'alreadyDead') {
            if(killer.alive == 'alreadyVotedOut') {
                return 1;
                //Killer is out and the passangers win.
            }
            else if(deadPlayers.length > allPlayers.length-3 && killer.alive != 'alreadyVotedOut') {
                return 4;
                // Killer wins
            }
            return 2;
            // Medic is dead
        }
        else if(medic.alive == 'alreadyVotedOut') {
            if(killer.alive == 'alreadyVotedOut') {
                return 1;
                //Killer is out and the passangers win.
            }
            else if(deadPlayers.length > allPlayers.length-3 && killer.alive != 'alreadyVotedOut') {
                return 4;
                // Killer wins
            }
            return 3;
            // Medic is jailed
        }
        else {
            if(killer.alive == 'alreadyVotedOut') {
                return 1;
                //Killer is out and the passangers win.
            }
            else if(deadPlayers.length > allPlayers.length-3 && killer.alive != 'alreadyVotedOut') {
                return 4;
                // Killer wins
            }
        }
    }

    getAllUsersExceptKiller(room) {
        let userList = this.users.filter((user) => user.room === room && user.role != "Killer");
        return userList;
    }

    getUserAlive (alive, room) {
        return this.users.filter((user) => user.alive === alive && user.room === room);
    }
    
}

module.exports = {Users};