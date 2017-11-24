const LocalStrategy   = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

const config = require("config");
const utils = require("./utils");

const authManager = require('./authManager');
const consumerManager = require('./ConsumerManager');

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

    passport.use('google-oauth', new GoogleStrategy({
            clientID: config.oauth.google.client_id,
            clientSecret: config.oauth.google.client_secret,
            callbackURL:  utils.getServerUrl(config.server.adresse, config.server.port) + "/auth/google/callback"
        },
        function(accessToken, refreshToken, profile, done) {
            consumerManager.findOrCreateGoogle(profile, accessToken, function(err, user){
                if(err)
                    return done(err, false);

                if(!user)
                   return done(null, false);

               return done(null, authManager.loginUser(user));
            });
        }
    ));

    passport.use('facebook-oauth', new FacebookStrategy({
            clientID: config.oauth.facebook.client_id,
            clientSecret: config.oauth.facebook.client_secret,
            callbackURL: utils.getServerUrl(config.server.adresse, config.server.port) + "/auth/facebook/callback",
            profileFields: ['id', 'emails', 'name', 'displayName', 'picture.type(large)']
        },
        function(accessToken, refreshToken, profile, done) {
            consumerManager.findOrCreateFacebook(profile, accessToken, function(err, user){
                if(err)
                    return done(err, false);

                if(!user)
                    return done(null, false);

                return done(null, authManager.loginUser(user));
            });
        }
    ));

};
