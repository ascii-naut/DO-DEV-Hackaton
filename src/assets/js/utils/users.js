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

    updateUserListRoles (role1, role2) {
        let random1 = Math.floor(Math.random() * this.users.length);
        let random2 = Math.floor(Math.random() * this.users.length);
        role1 = "Killer";
        role2 = "Medic";

        let user = this.users[0];
        let user2 = this.users[1];
        user.role = role1;
        user2.role = role2;

        // console.log(random1 + " ------ " + random2 );
        // console.log(this.users.length);
    }

    isAlive(playerName, status) {
        let user = this.users.filter((user) => user.name === playerName)[0];
        user.alive = status;
        return user;
    }

    getUser(id) {
        return this.users.filter((user) => user.id === id)[0];
    }

    getUserRoles (role) {
        return this.users.filter((user) => user.role === role);
    }

    getUserAlive (alive) {
        return this.users.filter((user) => user.alive === alive);
    }
    
}

module.exports = {Users};