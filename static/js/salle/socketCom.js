/**
 * Created by Laurent on 25/01/14.
 */
var socket = io.connect();
var chatForm = document.getElementById('chatForm');
var inputText = document.getElementById('text');
var messagesArea = document.getElementById('messagesArea');


var socketEvents_receive = {
    message: function(username,message,time){
        if (typeof time != 'string') {
         var date = new Date(time);
         time = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
         }
        var line = '[' + time + '] <strong>' + username + '</strong>: ' + message + '<br />';
        messagesArea.innerHTML = line + messagesArea.innerHTML;
    },
    draw : function(events){
        canvas.color = events.color;
        canvas.lineWidth = events.lineWidth;
        if(events.dragging){
            canvas.draw(events.x, events.y);
        }else{
            canvas.addClick(events.x, events.y, events.dragging);
        }
    },
    swipe : function(){
        canvas.swipe();
    }
}


var socketEvents_send = {
    message : function(e){
        socket.emit('write', inputText.value);
        socketEvents_receive.message("I", inputText.value, moment().format('HH:mm:ss'));
        inputText.value = '';
        e.preventDefault();
    },
    draw : function(events){
        socket.emit('postDraw', events);
    },
    swipe : function(){
        canvas.swipe();
        socket.emit('postSwipe');
    }
}


socket
    .on('connect', function () {
        // at connection, first send my username
        socket.emit('user', "mm");
    })
    .on('join', function (username, time) {
        // someone joined room
        socketEvents_receive.message(username, 'joined room', time);
    })
    .on('bye', function (username, time) {
        // someone left room
        socketEvents_receive.message(username, 'left room', time);
    })
    .on('error', function (error) {
        // an error occured
        alert('Error: ' + error);
    })
    .on('message', function (username, message, time) {
        // someone wrote a message
        socketEvents_receive.message(username, message, time);
    })
    .on('getDraw', function (trace){
        socketEvents_receive.draw(trace);
    })
    .on('getSwipe', function(){
        socketEvents_receive.swipe();
    });


//Events
chatForm.addEventListener('submit',socketEvents_send.message);

