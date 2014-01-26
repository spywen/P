/**
 * Created by Laurent on 14/01/14.
 */

const   path = require('path'),
        express = require('express'),
        app = express(),
        port = 8080;
var http = require('http');
var io = require('socket.io');
var events = require('events');
var  server = http.createServer(app)
    , io = io.listen(server);
var moment = require('moment');
/* routes */
var     routes = require('./routes'),
        login = require('./routes/login'),
        register = require('./routes/register'),
        auth_play = require('./routes/auth/play'),
        auth_rooms = require('./routes/auth/rooms');

var connect = require('express/node_modules/connect');
var cookie = require('express/node_modules/cookie');


var url       = require('url');
var fs        = require('fs');
//var events = require('events');
//var         sockets = require('socket.io').listen(app).of('/play');

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
    this.sessionStore = new express.session.MemoryStore({ reapInterval: 60000 * 10 });
    this.use(express.session({
        "secret": "pictionarySecretKey",
        "store":  this.sessionStore
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
    .get('/play', [pSession.requireLogin], auth_play.get)
    .get('/rooms', [pSession.requireLogin], auth_rooms.get)
    .post('/rooms', [pSession.requireLogin], auth_rooms.post)


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
    server.listen(port)
}


io.sockets.authorization(function (handshakeData, callback) {
    var cookies = cookie.parse(handshakeData.headers.cookie);
    var s = cookies['connect.sid']
    var sessionID = s.slice(2, s.lastIndexOf('.'))

    if (!sessionID) {
        callback('No session', false);
    } else {
        handshakeData.sessionID = sessionID;
        app.sessionStore.get(sessionID, function (err, session) {
            if (!err && session && session.user && session.user.username) {
                handshakeData.user = session.user;
                callback(null, true);
            } else {
                callback('User not authenticated', false);
            }
        });
    }
});

io.sockets.on('connection',function(socket){
    console.log("Connexion");

    socket.broadcast.emit('join', socket.handshake.user.username, strings.joinRoom, moment().format('HH:mm'));

    socket.on('disconnect', function () {
        socket.broadcast.emit('bye', socket.handshake.user.username, strings.leftRoom, moment().format('HH:mm'));
    });

    socket.on('write', function (message) {
        socket.broadcast.emit('message', socket.handshake.user.username, message, moment().format('HH:mm'));
    });

    socket.on('postDraw', function (events) {
        socket.broadcast.emit('getDraw', events);
    });

    socket.on('postSwipe', function () {
        console.log('swipe draw');
        socket.broadcast.emit('getSwipe');
    });
});