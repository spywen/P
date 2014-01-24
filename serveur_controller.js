/**
 * Created by Laurent on 14/01/14.
 */

const   path = require('path'),
        express = require('express'),
        app = express(),
        port = 8080;

/* routes */
var     routes = require('./routes'),
        login = require('./routes/login'),
        register = require('./routes/register'),
        auth_play = require('./routes/auth/play');


var http = require('http');

var url       = require('url');
var fs        = require('fs');
var events = require('events');
var         io = require('socket.io'),
            server = require('http').createServer(app);
            io = io.listen(server);
var Log = require('log')
    , stream = fs.createWriteStream(__dirname + '/file.log', { flags: 'a' })
    , log = new Log('debug', stream);
//        log.notice('a notice message FFFFFFFF');

/* Modules perso */
var
        pSession = require('./serveur_scripts/psession.js'),
        psql = require('./serveur_scripts/psql.js'),
        obj = require('./serveur_scripts/objects.js'),
        strings = require('./serveur_scripts/strings.js');



app.configure(function() {
    /*Permet d'appeler les pages EJS sans ".ejs"*/
    this.set('views', path.join(__dirname, 'views'));
    this.set('view engine', 'ejs');
    /*Déclaration du dossier static de ressource client*/
    this.use(express.static(__dirname, '/static'));
    this.use(express.cookieParser());
    this.use(express.session({
        "secret": "pictionarySecretKey",
        "store":  new express.session.MemoryStore({ reapInterval: 60000 * 10 })
    }));
    //Objet req.session.user : contiendra les informations de l'utilisateur connecté !
})
app.use(express.bodyParser());

/* ########################################## PAGES NON PROTEGEES #################################################### */

app
        /*---------------------------------------- index ----------------------------------------*/
    .get('/', routes.index)
    .get('/home',function(req,res){res.redirect('/');})
    .get('/index',function(req,res){res.redirect('/');})
    .get('/index.html',function(req,res){res.redirect('/');})
        /*---------------------------------------- login ----------------------------------------*/
    .get('/login', login.get)
    .post('/login', login.post)
    .get('/logout', login.logout)

    .get('/register', register.get)
    .post('/register', register.post)


/* ########################################## PAGES PROTEGEES #################################################### */

    /*---------------------------------------- play ----------------------------------------*/
    .get('/play',[pSession.requireLogin], auth_play.get)



    /*---------------------------------------- errors pages ----------------------------------------*/
    .use(function (req, res) {
        res.status(404);
        res.render("error",{
            errorPage : new obj.perrorpage(strings.title_404,strings.message_404)
        });
    })
    .use(function (err, req, res, next){
        console.error(err.stack);
        res.status(500);
        res.render("error",{
            errorPage : new obj.perrorpage(strings.title_500,strings.message_500)
        });
    });

if (!module.parent) {
    app.listen(port)
}



io.sockets.on('connection',function(socket){
    var socket_username = null;
    // User sends his username
    socket.on('user', function (username) {
        socket_username = username;
        sockets.emit('join', username, Date.now());
    });
    // When user leaves
    socket.on('disconnect', function () {
        if (socket_username) {
            sockets.emit('bye', socket_username, Date.now());
        }
    });
    // New message from client = "write" event
    socket.on('write', function (message) {
        if (socket_username) {
            sockets.emit('message', socket_username, message, Date.now());
        } else {
            socket.emit('error', 'Username is not set yet');
        }
    });
});