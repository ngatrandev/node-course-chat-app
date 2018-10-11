class Users {
    constructor () {
        this.userArray = [];
    }
    addUser (id, name, room) {
        let user = {id, name, room};
        this.userArray.push(user);
        return user;
    };
    removeUser (id) {
        let user = this.getUser(id)
        if(user) {
        this.userArray = this.userArray.filter((user)=> user.id !== id);
        }
        return user;
    };
    getUser (id) {
        return this.userArray.filter((user)=> user.id === id)[0];
    };
    getUserList (room) {
        let users = this.userArray.filter((user)=> user.room === room);
        var nameArray = users.map((user)=>user.name);
        return nameArray;
    }

};
module.exports = {Users};