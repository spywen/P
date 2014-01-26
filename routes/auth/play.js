/**
 * Created by Laurent on 24/01/14.
 */
var
    obj = require('../../serveur_scripts/objects.js'),
    psql = require('../../serveur_scripts/psql.js'),
    pSession = require('../../serveur_scripts/psession.js'),
    strings = require('../../serveur_scripts/strings.js');

exports.get = function(req, res){
    console.log("Id of room : "+req.query.room);
    if(req.query.room!='undefined' && req.query.room!=''){
        //On check si il reste de la place pour la partie et qu'elle existe bien
        pSession.findRoom(req,res, req.query.room).fail(function(err){
            console.log("Find room Error : "+err);
            res.redirect('/rooms');
        }).done(function(room){
            //et on ajoute l'utilisateur à la partie
            //On passe le joueur en mode jeu
            console.log("Add player to the room");
            pSession.addPlayerRoom(req,res,room).fail(function(){
                res.redirect('/rooms');
            }).done(function(room){
                    console.log(room);
                    res.render('auth/play',{
                        user : req.session.user,
                        room : room
                    });
            });

        });



    }

}