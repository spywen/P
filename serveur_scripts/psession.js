/**
 * Created by Laurent on 15/01/14.
 */
module.exports = {
    requireLogin: function (req, res, next) {
        if (req.session.user) {
            next();
        } else {
            res.redirect("/login");
        }
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
    createRoom:function(req,res, room){
        req.session.user.game = room;
    },
    getUser:function(req,res){
        return req.session.user;
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