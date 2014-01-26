/**
 * Created by Laurent on 26/01/14.
 */

var
    obj = require('../../serveur_scripts/objects.js'),
    psql = require('../../serveur_scripts/psql.js'),
    pSession = require('../../serveur_scripts/psession.js'),
    strings = require('../../serveur_scripts/strings.js');

var moment = require('moment');

exports.get = function(req, res){

    res.render('auth/rooms',{
        user : pSession.getUser(req,res),
        rooms : pSession.getRooms(req,res)
    });
};

exports.post = function(req, res){
    var room = new obj.room();
    if(room.checkName(req.body.name)){
        room.init(moment().format('X'), req.body, req.session.user.username);
        pSession.createRoom(req,res,room);

        console.log(pSession.getUser(req,res));



        console.log("Join the room by the owner (room id : "+room.id+")");
        res.redirect('/play?room='+room.id);
    }else{
        res.render('auth/rooms',{
            user : pSession.getUser(req,res),
            rooms : pSession.getRooms(req,res),
            message : new obj.pmessage("danger",strings.noNameRoom)
        });
    }

};