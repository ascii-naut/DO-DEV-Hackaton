class Users {
    constructor() {
        this.users = [];
    }

    addUser(id, name, room, role) {
        let user = {id, name, room, role};
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

    addUserRole(id, role) {
        let user = this.getUser(id);
        if(user) {
            user.role = role;
        }
        return user;
    }

    getUserList (room) {
        let users = this.users.filter((user) => user.room === room);
        let namesArray = users.map((user) => user.name);

        return namesArray;
    }

    getUserRole (room) {
        let users = this.users.filter((user) => user.room === room);
        let rolesArray = users.map((user) => user.role);

        return rolesArray;
    }

    getUser(id) {
        return this.users.filter((user) => user.id === id)[0];
    }
}

module.exports = {Users};