/**
 * Created by Laurent on 24/01/14.
 */

exports.get = function(req, res){
    res.render('auth/play',{
        user : req.session.user
    });
}