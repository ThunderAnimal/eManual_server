var LocalStrategy   = require('passport-local').Strategy;

var authManager = require('./authManager');

module.exports = function(passport) {
    passport.use('local-login', new LocalStrategy({
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, done) { // callback with email and password from our form
            authManager.findUser(email, function(user){
                if(!user)
                    return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

                if(!authManager.checkPassword(user, password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

                return done(null, authManager.loginUser(user));
            });
        }));

    passport.use('api-login', new LocalStrategy({
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true
        },
        function (req, email, password, done) {
            authManager.findUser(email, function(user){
                if(!user)
                    return done(null, false);

                if(!authManager.checkPassword(user, password))
                    return done(null, false);

                return done(null, authManager.loginUser(user));
            });
        }));

};
