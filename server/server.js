const path = require('path');
const http = require('http');
const publicPath = path.join(__dirname, "../public");//__dirname là đường dẫn đến folder server dùng join() sẽ tạo đường dẫn đến folder public
const express = require('express');
const socketIO = require('socket.io');
const {generateMessage,generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);//tích hợp socket.io vào server
const port = process.env.PORT || 8080;
let users = new Users();

app.use(express.static(publicPath));// middleware qua public folder
io.on('connection', (socket)=> {//tạo event với name mặc định
    console.log('New user connected');
    socket.on('disconnect', ()=> {
       var user = users.removeUser(socket.id);
       if (user) {
           socket.to(user.room).emit('updateUserList', users.getUserList(user.room));
           socket.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`))
       }
    });
    //terminal (bên server) viết trong file server.js
    // browser (bên client) viết trong file index.html
    // socket.emit('newMessage', {
    //     from: 'GAU',
    //     text: "See you then",
    //     createAt: 123123
    // }) // emit event: phát ra event để phía client listen.
    // socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
    // socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));// khi có client mới vào server thì bên các client cũ sẽ chạy mess này
    // với broadcast.emit() các client đều listen (chỉ trừ client hiện hành (mới nhất))
    socket.on('join', (params, callback)=> {
        if(!isRealString(params.name) || !isRealString(params.room)) {
           return callback('Name and room name are required.');
        }
        socket.join(params.room);// join vao room
        users.removeUser(socket.id);// bỏ user trong các room đã join
        users.addUser(socket.id, params.name, params.room);
        io.to(params.room).emit('updateUserList', users.getUserList(params.room))
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`));

    })
    
    socket.on('createMessage', (message, callback)=> {
       var user = users.getUser(socket.id);
       if (user && isRealString(message.text)) {
        io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
       };
        
        callback();//callback là acknowledgement với vai trò trung gian để xác thực data từ client đến server có valid hay k?
    //socket.emit() emit an event to a single connection/ phát event đến 1 client
    //io.emit() emit an event to every single connection/ phát event đến tất cả client ()
    //socket.broadcast.emit() phát event đến tất cả client chỉ trừ client hiện hành
    //io.to('...')emit()  phát event đến tất cả client trong room
    })// listen event từ phía client

    socket.on('createLocation', (coords)=> {
        var user = users.getUser(socket.id);
        if (user) {
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
        }
        
    });

});

server.listen(port, () => {
console.log(`Server is up on port ${port}`);
})