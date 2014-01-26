/**
 * Created by Laurent on 25/01/14.
 */
var socket = io.connect();
var chatForm = document.getElementById('chatForm');
var inputText = document.getElementById('text');
var messagesArea = document.getElementById('messagesArea');


var socketEvents_receive = {
    message: function(username,message,time,indic){
        if (typeof time != 'string') {
         var date = new Date(time);
            time = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
         }
        var line = '<div class="row '+indic+'"><span class="time">[' + time + ']</span> <strong>' + username + '</strong><span class="message">: ' + message + '</span></div>';
        messagesArea.innerHTML = messagesArea.innerHTML + line;
        messagesArea.scrollTop = messagesArea.scrollHeight;
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
        socketEvents_receive.message("Me", inputText.value, moment().format('HH:mm'),"me");
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
        socket.emit('user', "mm");
    })
    .on('join', function (username, message, time) {
        socketEvents_receive.message(username, message, time, "join");
    })
    .on('bye', function (username, message, time) {
        socketEvents_receive.message(username, message, time, "bye");
    })
    .on('error', function (error) {
        document.location.href="index";
    })
    .on('message', function (username, message, time) {
        socketEvents_receive.message(username, message, time, "message");
    })
    .on('getDraw', function (trace){
        socketEvents_receive.draw(trace);
    })
    .on('getSwipe', function(){
        socketEvents_receive.swipe();
    });


//Events
chatForm.addEventListener('submit',socketEvents_send.message);
inputText.focus();
//Ecrire automatiquement dans le chat à la pression d'une touche
document.onkeydown = function(){
    inputText.focus();
};