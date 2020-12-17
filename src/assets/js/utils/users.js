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

        if(random1 != random2) {
            let user = this.users[random1];
            let user2 = this.users[random2];
            user.role = role1;
            user2.role = role2;
            return user, user2
        }
        else {
            if(random1==this.users.length){
                random1--;
                let user = this.users[random1];
                let user2 = this.users[random2];
                user.role = role1;
                user2.role = role2;
                return user, user2
            }
            else if(random1==0) {
                random1++;
                let user = this.users[random1];
                let user2 = this.users[random2];
                user.role = role1;
                user2.role = role2;
                return user, user2
            }
            else {
                random1--;
                let user = this.users[random1];
                let user2 = this.users[random2];
                user.role = role1;
                user2.role = role2;
                return user, user2
            }

        }
    }

    getUser(id) {
        return this.users.filter((user) => user.id === id)[0];
    }

    getUserRoles (role) {
        // let users = this.users.filter((user) => user.room === room && user.role == role);
        // return users;

        return this.users.filter((user) => user.role === role);
    }
    
}

module.exports = {Users};