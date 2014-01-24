/**
 * Created by Laurent on 23/01/14.
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
        psql.getLangues().done(function(langues){
            res.render('register',{
                langues : langues
            });
        }).fail(function(err){
            res.render('register',{
                langues : langues,
                message : new obj.pmessage("danger",err)
            });
        });
}

exports.post = function(req, res){
    var user = new obj.user();
    user.init(req.sessionID, req.body);
    console.log(user);

    psql.userExist(user).fail(function(err){
        console.log(err);
        psql.getLangues().done(function(langues){
            res.render('register',{
                langues : langues,
                message : new obj.pmessage("danger",err)
            });
        });
    }).done(function(){
        if(user.checkConfirmPassword()){
            psql.createUser(user)
                .fail(function(err){
                    console.log(err);
                    psql.getLangues().done(function(langues){
                        res.render('register',{
                            langues : langues,
                            message : new obj.pmessage("danger",err)
                        });
                    });
                })
                .done(function(insertId){
                    user.id = insertId;
                    //var userSession = new obj.user.init(req.sessionID, user);
                    console.log(user);
                    pSession.connect(req,user);
                    res.redirect('/');
                });
        }else{
            psql.getLangues().done(function(langues){
                res.render('register',{
                    langues : langues,
                    message : new obj.pmessage("danger",strings.badConfirmPassword)
                });
            });
        }
    });
}
