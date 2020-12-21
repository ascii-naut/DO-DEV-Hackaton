class Users {
    constructor() {
        this.users = [];
    }

    addUser(id, name, room, role, alive) {
        let user = {id, name, room, role, alive};
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

    updateUserListRoles (room, role1, role2) {
        let random1 = Math.floor(Math.random() * this.users.length);
        let random2 = Math.floor(Math.random() * this.users.length);
        role1 = "Killer";
        role2 = "Medic";

        // let user = this.users[0];
        // let user2 = this.users[1];
        let user = this.users.filter((user) => user.room === room)[0];
        let user2 = this.users.filter((user) => user.room === room)[1];
        user.role = role1;
        user2.role = role2;

        // console.log(random1 + " ------ " + random2 );
        // console.log(this.users.length);
    }

    isAlive(playerName, status, room) {
        let user = this.users.filter((user) => user.name === playerName && user.room === room)[0];
        user.alive = status;
        return user;
    }

    isVoted(playerName, room) {
        let user = this.users.filter((user) => user.name === playerName && user.room === room)[0];
        user.alive += 1;
        return user;
    }

    refreshVotePoints(room) {
        let users = this.users.filter((user) => user.room === room);
        for (let i = 0; i<users.length; i++) {
            if(users[i].alive != 'alreadyVotedOut' && users[i].alive != 'alreadyDead'){
                users[i].alive = 0;
            }
        }
    }

    getHighestVote(room) {
        let userList = this.users.filter((user) => user.room === room);
        let voteArray = [];
        let finalVote;
        for(let i = 0; i<userList.length-1; i++) {
            voteArray[i] = userList[i].alive;
        }

        finalVote = Math.max.apply(null, voteArray);
        let votedUser = this.users.filter((user) => user.room === room && user.alive === finalVote);

        if(votedUser.length == 1) {
            for(let a = 0; a<votedUser.length; a++) {
                console.log(votedUser[a].name);
                return votedUser[a];
            }
        }
        else if(votedUser.length >= 1) {
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

        if(killer.alive == 'alredyVotedOut') {
            return 1;
        }
        else if(medic.alive == 'alreadyVotedOut' || medic.alive == 'alreadyDead') {
            return 2;
        }
        else {
            return null;
        }
    }

    getUserAlive (alive, room) {
        return this.users.filter((user) => user.alive === alive && user.room === room);
    }
    
}

module.exports = {Users};