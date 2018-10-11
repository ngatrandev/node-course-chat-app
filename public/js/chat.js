var socket = io();
function scrollToBottom () {//để auto scroll bar
    var messages =jQuery('#messages');
    var newMessage = messages.children('li:last-child');
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();
    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        messages.scrollTop(scrollHeight);
    }
}

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
    var formatedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#message-template').html();
    var html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formatedTime
    });
    jQuery('#messages').append(html);
    scrollToBottom();
    // var formatedTime = moment(message.createdAt).format('h:mm a');
    // var li = jQuery('<li></li>');
    // li.text(`${message.from}: ${formatedTime} ${message.text} `);// add text vào tab <li></li>
    // jQuery('#messages').append(li);//gắn các tab li(list) vào tab ol(order list)
    //jQuery lấy theo id dùng dấu #
});//tạo event listener

socket.on('newLocationMessage', function (message) {
    var formatedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#location-message-template').html();
    var html = Mustache.render(template, {
        url: message.url,
        from: message.from,
        createdAt: formatedTime
    });
    jQuery('#messages').append(html);
    scrollToBottom();
    // var li = jQuery('<li></li>');
    // var a = jQuery('<a target="_blank">My current location</a>');
    // li.text(`${message.from} ${formatedTime} `);
    // a.attr('href', message.url);
    // li.append(a);
    // jQuery('#messages').append(li);
});

socket.emit('createMessage', {
    from: 'joseph',
    text: 'Acknowledgement'
}, function (data) {//function này để chạy acknowledgement
    //data là giá trị trong callback(...) bên file server(phía listen event)
    console.log(data);
});

jQuery('#message-form').on('submit', function (e) {//dùng onsubmit event
    e.preventDefault();
    const messageTextbox = jQuery('[name=message]');
    socket.emit('createMessage', {
        from: 'User',
        text: messageTextbox.val()//lấy value trong input text
    }, function () {
        messageTextbox.val('');//để sau khi bấm sent textbox rỗng.
    })
});
const locationButton = jQuery('#send-location');
locationButton.on('click', function () {
    if(!navigator.geolocation) {
        return alert('Geolocation not supported by your browser');
    }
    locationButton.attr('disabled', 'disabled').text('Sending location...');
    navigator.geolocation.getCurrentPosition(function(position) {
        locationButton.removeAttr('disabled').text('send location');
        socket.emit('createLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    }, function () {
        locationButton.removeAttr('disabled').text('send location');
        alert('Unable to fetch location');
    })
})