/**
 * Created by Laurent on 22/01/14.
 */
var
    obj = require('../serveur_scripts/objects.js'),
    psql = require('../serveur_scripts/psql.js'),
    pSession = require('../serveur_scripts/psession.js');
var strings = require('../serveur_scripts/strings.js');

exports.get = function(req, res){
    if(pSession.isConnected(req))
        res.redirect('/');
    else
        res.render('login',{
            user : req.session.user
        });
};

exports.post = function(req, res){
    var user = new obj.user();
    user.init(req.sessionID, req.body);
    //var userAlreadyConnected = false;

    psql.connectUser(user)
        .fail(function(err){
            res.render('login',{
                message : new obj.pmessage("danger",err)
            });
        }).done(function(user){
            req.sessionStore.all(function(err,sessions){
                for (var i=0; i<sessions.length; i++) {
                    var session = JSON.parse(sessions[i]);
                    if(session.user!=undefined){
                        if(session.user.id==user.id){
                            //userAlreadyConnected = true;
                            pSession.disconnectUser(req,session.user);
                        }
                    }
                }
                /*if(userAlreadyConnected){
                    console.log('Vérification : utilisateur déjà connecté ? OUI');
                    res.render('login',{
                        user : req.session.user,
                        message : new obj.pmessage("danger",strings.alreadyConnected)
                    });
                }else{*/
                    console.log('Connexion d\'un utilisateur : '+user);
                    pSession.connect(req,user);
                    res.redirect('/');
                /*}*/
            });
        });
}

exports.logout = function(req, res){
    pSession.disconnect(req,res);
}