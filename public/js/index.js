var socket = io();
socket.on('connect', function () {
    //dùng regular function để tránh lỗi trên các browser và device
    console.log('Connected to server');
    // socket.emit('createMessage', {
    //     form: 'ngatrandev',
    //     text: 'Hey, that works for me'
    // })//phát ra event đến server
});
socket.on('disconnect', function () {
    console.log('Disconnected from the server');
});

socket.on('newMessage', function (message) {
    console.log('New message', message);
    var li = jQuery('<li></li>');
    li.text(`${message.from}: ${message.text} `);// add text vào tab <li></li>
    jQuery('#messages').append(li);//gắn các tab li(list) vào tab ol(order list)
    //jQuery lấy theo id dùng dấu #
});//tạo event listener
socket.emit('createMessage', {
    from: 'joseph',
    text: 'Acknowledgement'
}, function (data) {//function này để chạy acknowledgement
    //data là giá trị trong callback(...) bên file server(phía listen event)
    console.log(data);
});

jQuery('#message-form').on('submit', function (e) {//dùng onsubmit event
    e.preventDefault();
    socket.emit('createMessage', {
        from: 'User',
        text: jQuery('[name=message]').val()//lấy value trong input text
    }, function () {

    })
})