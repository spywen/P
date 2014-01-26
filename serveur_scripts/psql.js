/**
 * Created by Laurent on 15/01/14.
 */
const       mysql      = require('mysql'),
            connexion = mysql.createConnection({
                host     : 'localhost',
                user     : 'root',
                password : ''
            });

var strings = require('./strings.js');


var _ = require('underscore.deferred');
var crypto = require('crypto'),
    hash = function (pass, salt) {
        var h = crypto.createHash('sha512');
        h.update(pass);
        h.update(salt);
        return h.digest('base64');
    };


module.exports = {
    connectUser: function(user){

        var dfd = new _.Deferred();
        var query = connexion.query('SELECT * FROM pictionary.user WHERE username = ? AND password = ?', [user.username,hash(user.password,user.username)], function(err, rows) {
            console.log(query.sql);
            if (err){
                console.log(err);
                dfd.fail(strings.error);
            }else{
                if(rows.length == 1){
                    user.password="security";
                    user.passwordHash = "security";
                    user.language = rows[0].language;
                    user.id = rows[0].id;

                    dfd.resolve(user);
                }else{
                    dfd.reject(strings.badCredential);
                }
            }
        });
        return dfd.promise();
    },
    userExist:function(user){
        var dfd = new _.Deferred();

        var query = connexion.query('SELECT * FROM pictionary.user WHERE username = ?', [user.username], function(err, rows) {
            console.log(query.sql);
            if (err){
                console.log('Error');
                dfd.reject(strings.error);
            }else{
                if(rows.length >= 1)
                    dfd.reject(strings.userAlreadyExist);
                else
                    dfd.resolve();
            }
        });
        return dfd.promise();
    },
    createUser:function(user){
        var dfd = new _.Deferred();
        user.passwordHash = hash(user.password,user.username);
        var query = connexion.query('INSERT INTO pictionary.user(username,password,language) VALUES(?,?,?)', [user.username,user.passwordHash,user.language], function(err, rows) {
            console.log(query.sql);
            if (err){
                console.log(err);
                dfd.reject(strings.error);
            }else{
                console.log("Id du nouvel utilisateur : "+rows.insertId);
                dfd.resolve(rows.insertId);
            }
        });
        return dfd.promise();
    },
    getLangues: function(){
        var dfd = new _.Deferred();
        var query = connexion.query('SELECT * FROM pictionary.langues ORDER BY titre', [], function(err, rows) {
            console.log(query.sql);
            if (err){
                console.log(err);
                dfd.fail(strings.error);
            }else{
                dfd.resolve(rows);
            }
        });
        return dfd.promise();
    }

};