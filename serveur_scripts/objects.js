/**
 * Created by Laurent on 15/01/14.
 */
module.exports = {
    pmessage: function(type, message){
        this.type = type;
        this.message = message;
    },
    perrorpage: function(title, message){
        this.title = title;
        this.message = message;
    },
    user: function(){
        this.id = "",
        this.username = "",
        this.password = "",
        this.confirmPassword = "",
        this.language = "",
        this.sessionId = "",
        this.play = false,
        this.passwordHash = "",
        this.game = null,
        this.init = function(sessionId, user){
            this.id = user.id;
            this.username = user.username;
            this.password = user.password;
            this.confirmPassword = user.confirmPassword,
            this.language = user.language;
            this.sessionId = sessionId;
            this.play = user.play;
            this.passwordHash = user.passwordHash;
        },
        this.checkConfirmPassword = function(){
            if(this.password==this.confirmPassword)
                return true;
            else
                return false;
        }
    },
    room: function(){
        this.init = function(id, room, owner){
            this.name = room.name;
            this.owner = owner;
            this.id = id;
        },
        this.owner = "",
        this.id = 0,
        this.name = "",
        this.players = [],
        this.default_properties = {
            maxPlayers : 4,
            minPlayers : 2,
            pointOffer : 10,
            durationGame : 600,//10 minutes en secondes
            durationHandler : 60
        },
        this.onAir = false,//False : en attente de joueur, True : en cours
        this.wordToGuess = "",
        this.checkName = function(name){
            if(name.length > 30 || name == '' || name=='undefined'){
                return false
            }
            return true;
        }
    },

    player: function(){
        this.init = function(user){
            this.username = user.username;
            this.id = user.id;
        },
        this.id = 0,
        this.username = "",
        this.points = 0,
        this.deviner = 0,
        this.faitDeviner = 0,
        this.averageTimeToDeviner = 0,
        this.averageTimeToFaireDeviner = 0
    }
}
