/**
 * Created by Laurent on 25/01/14.
 */
var socket = io.connect();
var chatForm = document.getElementById('chatForm');
var inputText = document.getElementById('text');
var messagesArea = document.getElementById('messagesArea');



var socketEvents_receive = {
    idRoomLocal: 0,
    filtre: function(receiveIdRoom){
        if(this.idRoomLocal== receiveIdRoom){
            return true;
        }else{
            return false;
        }
    },
    message: function(user,message,time,indic, local){
        if (typeof time != 'string') {
         var date = new Date(time);
            time = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
         }
        var username = "";
        if(local){
            username = "Me";
        }else{
            username = user.username;
        }
        var line = '<div class="row '+indic+'"><span class="time">[' + time + ']</span> <strong>' + username + '</strong><span class="message"> : ' + message + '</span></div>';
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
        if(inputText.value.length>0 && inputText.value.length<200){
            socket.emit('write', inputText.value);
            socketEvents_receive.message("Me", inputText.value, moment().format('HH:mm'),"me", true);
            inputText.value = '';
        }else{
            socketEvents_receive.message("Me", "Message not send. Please enter a correct message (0-200 characters)", moment().format('HH:mm'),"error", true);
        }
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
    .on('join', function (user, message, time) {
        if(socketEvents_receive.filtre(user.play)){
            socketEvents_receive.message(user, message, time, "join");
        }
    })
    .on('bye', function (user, message, time) {
        if(socketEvents_receive.filtre(user.play)){
            socketEvents_receive.message(user, message, time, "bye");
        }
    })
    .on('error', function (error) {
        document.location.href="index";
    })
    .on('message', function (user, message, time) {
        if(socketEvents_receive.filtre(user.play)){
            socketEvents_receive.message(user, message, time, "message", false);
        }
    })
    .on('getDraw', function (trace, user){
        if(socketEvents_receive.filtre(user.play)){
            socketEvents_receive.draw(trace);
        }
    })
    .on('getSwipe', function(user){
        if(socketEvents_receive.filtre(user.play)){
            socketEvents_receive.swipe();
        }
    })
    .on('idRoom', function(idRoom){
        socketEvents_receive.idRoomLocal=idRoom;
    });


//Events
chatForm.addEventListener('submit',socketEvents_send.message);
inputText.focus();
//Ecrire automatiquement dans le chat à la pression d'une touche
document.onkeydown = function(){
    inputText.focus();
};