strict mod !!!!!!

CALLBACK !!!
module.exports = {
    testConnectUser: function(username, password, callback){
        connection.connect();
        connection.query('SELECT * FROM pictionary.user', function(err, rows, fields) {
            if (err) throw err;
            console.log(rows[0].id);
            rep = rows[0].id;
            callback(rep);
        });
        connection.end();
    }
};

psql.testConnectUser(req.body.username, req.body.password, function(rep){
            console.log('--> POST : '+rep);
            res.render('login');
        });

        gerer erreur sql (pas de serveur)