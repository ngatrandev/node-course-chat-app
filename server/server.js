const path = require('path');
const http = require('http');
const publicPath = path.join(__dirname, "../public");//__dirname là đường dẫn đến folder server dùng join() sẽ tạo đường dẫn đến folder public
const express = require('express');
const socketIO = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);//tích hợp socket.io vào server
const port = process.env.PORT || 8080
app.use(express.static(publicPath));// middleware qua public folder
io.on('connection', (socket)=> {//tạo event với name mặc định
    console.log('New user connected');
    socket.on('disconnect', ()=> {
        console.log('User was disconnected');
    });
    //terminal (bên server) viết trong file server.js
    // browser (bên client) viết trong file index.html
    // socket.emit('newMessage', {
    //     from: 'GAU',
    //     text: "See you then",
    //     createAt: 123123
    // }) // emit event: phát ra event để phía client listen.
    socket.emit('newMessage', {
        from: 'Admin',
        text: 'Welcome to the chat app'
    });
    socket.broadcast.emit('newMessage', {
        form: 'Admin',
        text: 'New user joined',
        createdAt: new Date().getTime()
    });// khi có client mới vào server thì bên các client cũ sẽ chạy mess này
    // với broadcast.emit() các client đều listen (chỉ trừ client hiện hành (mới nhất))
    
    
    socket.on('createMessage', (message)=> {
        console.log('createMessage', message);
        io.emit('newMessage', {
            from: message.from,
            text: message.text,
            createdAt: new Date().getTime()
        });
    //socket.emit() emit an event to a single connection/ phát event đến 1 client
    //io.emit() emit an event to every single connection/ phát event đến tất cả client ()
    //socket.broadcast.emit() phát event đến tất cả client chỉ trừ client hiện hành
    })// listen event từ phía client
});

server.listen(port, () => {
console.log(`Server is up on port ${port}`);
})