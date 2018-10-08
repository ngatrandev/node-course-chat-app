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
io.on('connection', (socket)=> {//tạo event với name là connection
    console.log('New user connected');
    socket.on('disconnect', ()=> {
        console.log('User was disconnected');
    })
});

server.listen(port, () => {
console.log(`Server is up on port ${port}`);
})