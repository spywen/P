/**
 * Created by Laurent on 26/01/14.
 */

var
    obj = require('../../serveur_scripts/objects.js'),
    psql = require('../../serveur_scripts/psql.js'),
    pSession = require('../../serveur_scripts/psession.js'),
    strings = require('../../serveur_scripts/strings.js');

var crypto = require('crypto'),
    hash = function (pass, salt) {
        var h = crypto.createHash('sha512');
        h.update(pass);
        h.update(salt);
        return h.digest('base64');
    };

exports.get = function(req, res){

    res.render('auth/rooms',{
        user : pSession.getUser(req,res),
        rooms : pSession.getRooms(req,res)
    });
};

exports.post = function(req, res){
    var room = new obj.room();
    if(room.checkName(req.body.name)){
        room.init(hash("pictionary",req.session.user.username), req.body, req.session.user.username);
        pSession.createRoom(req,res,room);

        console.log(pSession.getUser(req,res));

        res.render('auth/play',{
            user : pSession.getUser(req,res)
        });
    }else{
        res.render('auth/rooms',{
            user : pSession.getUser(req,res),
            rooms : pSession.getRooms(req,res),
            message : new obj.pmessage("danger",strings.noNameRoom)
        });
    }

};