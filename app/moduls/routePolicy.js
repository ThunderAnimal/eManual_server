var jwt = require('jsonwebtoken');
var config = require("config");

var authManager = require('./authManager');

exports.allowAccessAllowOrigin = function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
};

exports.isAuthorized= function(req, res, next){
    if (req.isAuthenticated())
        return next();

    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if(!token){
        return res.status(401).send({
            status: 401,
            message: "Not Authorized. No token provided!"
        });
    }

    jwt.verify(token, config.server.secret, function (err, decoded) {
        if(err){
            return res.status(401).send({
                status: 401,
                message: "Not Authorized. Invalid Token!"
            });
        }else{
            authManager.verifyUser(decoded._id, decoded.model, decoded.login_at, function (user) {
               if(!user){
                   return res.status(401).send({
                       status: 401,
                       message: "Not Authorized. Old Token!"
                   });
               }
               req.user = user;
               return next();
            });
        }
    });
};

exports.onlyCompanyAllowed = function(req, res, next){
    if(authManager.isUserCompany(req.user))
        return next();

    return res.status(403).send({
        status: 403,
        message: "Forbidden! Only Company is allowed to access."
    });
};

exports.onlyRepresentativeAllowed = function(req, res, next){
    if(authManager.isUserRepresentative(req.user))
        return next();

    return res.status(403).send({
        status: 403,
        message: "Forbidden! Only Representative of a Company is allowed to access."
    });
};

exports.isLoggedIn = function(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    req.flash('errorMessage', 'Secure Area. Need to Login');
    res.redirect('/');
};