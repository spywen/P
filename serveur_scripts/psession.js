/**
 * Created by Laurent on 15/01/14.
 */

var
    obj = require('./objects.js'),
    strings = require('./strings.js');
var _ = require('underscore.deferred');

module.exports = {
    //------------USERS
    requireLogin: function (req, res, next) {
        if (req.session.user) {
            next();
        } else {
            res.redirect("/login");
        }
    },
    getUser:function(req,res){
        return req.session.user;
    },
    isConnected: function(req){
        if (req.session.user)
            return true;
        return false;
    },
    connect: function(req,user){
        req.session.user = user;
    },
    disconnect: function(req,res){
        req.session.destroy();
        res.redirect('/');
    },
    disconnectUser:function(req,user){
        req.sessionStore.destroy(user.sessionId,null);
    },

    //------------ROOMS
    createRoom:function(req,res, room){
        console.log("Création d'une salle");
        req.session.user.game = room;
        req.session.user.play = room.id;
    },
    addPlayerRoom:function(req,res,room){
        var dfd = new _.Deferred();
        var countRooms = 0;
        req.sessionStore.all(function(err,sessions){
            for (var i=0; i<sessions.length; i++) {
                var session = JSON.parse(sessions[i]);
                if(session.user!=undefined){
                    if(session.user.game!=null && session.user.game.id == room.id){
                        countRooms++;
                        if(session.user.game.onAir || session.user.game.players.length == session.user.game.default_properties.maxPlayers){//La partie a démarrée
                            dfd.reject(strings.roomOnAir);
                        }else{
                            req.session.user.play = room.id;
                            var player = new obj.player();
                            player.init(req.session.user);
                            session.user.game.players.push(player);
                            dfd.resolve(session.user.game);
                        }
                    }
                }
            }
        });
        if(countRooms==0){
            dfd.reject(strings.noRoomToJoin);
        }
        return dfd.promise();
    },
    getRooms:function(req,res){
        var rooms = [];
        req.sessionStore.all(function(err,sessions){
            for (var i=0; i<sessions.length; i++) {
                var session = JSON.parse(sessions[i]);
                if(session.user!=undefined){
                    if(session.user.game!=null){
                        rooms.push(session.user.game);
                    }
                }
            }
        });
        return rooms;
    },
    findRoom:function(req,res,id){
        var dfd = new _.Deferred();
        var countRooms = 0;
        req.sessionStore.all(function(err,sessions){
            for (var i=0; i<sessions.length; i++) {
                var session = JSON.parse(sessions[i]);
                if(session.user!=undefined){
                    if(session.user.game!=null && session.user.game.id == id){
                        countRooms++;
                        if(session.user.game.onAir || session.user.game.players.length == session.user.game.default_properties.maxPlayers){//La partie a démarrée
                            dfd.reject(strings.roomOnAir);
                        }else{
                            dfd.resolve(session.user.game);
                        }
                    }
                }
            }
        });
        if(countRooms==0){
            dfd.reject(strings.noRoomToJoin);
        }
        return dfd.promise();
    }
};
/*
var powerLevel = function(level) {
    return level > 9000 ? "it's over 9000!!!" : level;
};
module.exports = powerLevel;
-----
 var powerLevel = require('./powerlevel')
 powerLevel(9050);
    */