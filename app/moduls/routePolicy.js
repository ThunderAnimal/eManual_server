var jwt = require('jsonwebtoken');
var config = require("config");

exports.allowAccessAllowOrigin = function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
};

exports.ensureSecure = function(req, res, next){
        if(req.secure){
            return next();
        }
        res.redirect('https://' + req.hostname + req.url);
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
            //TODO Check the DB if is the user exists
            /*userManager.isLastLoginCorrect(new Date(decoded.login_at), decoded._id, function (ok) {
                if(!ok){
                    return res.status(401).send({
                        status: 401,
                        message: "Not Authorized. Old Token!"
                    });
                } else{
                    req.user = decoded;
                    return next();
                }
            });*/
            return next();
        }
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