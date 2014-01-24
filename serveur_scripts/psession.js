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