/**
 * Created by Laurent on 22/01/14.
 */
exports.index = function(req, res){
    var usersConnected = [];
    req.sessionStore.all(function(err,sessions){
        for (var i=0; i<sessions.length; i++) {
            var session = JSON.parse(sessions[i]);
            if(session.user!=undefined)
                usersConnected.push(session);
        }
    });
    res.render('index',{
        user : req.session.user,
        usersConnected : usersConnected
    });
};