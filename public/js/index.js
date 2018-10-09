var socket = io();
socket.on('connect', function () {
    //dùng regular function để tránh lỗi trên các browser và device
    console.log('Connected to server');
    socket.emit('createMessage', {
        form: 'ngatrandev',
        text: 'Hey, that works for me'
    })//phát ra event đến server
});
socket.on('disconnect', function () {
    console.log('Disconnected from the server');
});

socket.on('newMessage', function (message) {
    console.log('New message', message);
});//tạo event listener