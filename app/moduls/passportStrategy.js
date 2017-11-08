var LocalStrategy   = require('passport-local').Strategy;

module.exports = function(passport) {
    passport.use('local-login', new LocalStrategy({
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, done) { // callback with email and password from our form

            if(email !== "a@b.com")
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

            if(password !== "1234")
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

            /* only dummy usally check against db and get data from db*/
            var user = {
                id: 1,
                name: "max",
                lastname: "mustermann",
                email: "a@b.com",
                pw: "1234"
            };
            return done(null, user);
        }));

    passport.use('api-login', new LocalStrategy({
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true
        },
        function (req, email, password, done) {

            if(email !== "a@b.com")
                return done(null, false);

            if(password !== "1234")
                return done(null, false);

            /* only dummy usally check against db and get data from db*/
            var user = {
                id: 1,
                name: "max",
                lastname: "mustermann",
                email: "a@b.com",
                pw: "1234"
            };
            return done(null, user);

        }));

};
