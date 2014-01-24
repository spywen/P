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
    }
}
