var express = require('express');
var router = express.Router();
var passport = require('passport');

var authManager = require('../app/moduls/authManager');

router.post('/login', passport.authenticate('local-login', {
    failureRedirect : '/login',
    failureFlash : true }),
    function(req, res){
        if(!req.user){
            req.flash('loginMessage', 'Oops! Something went wrong.');
            return res.redirect('/login');
        }

        if(authManager.isUserCompany(req.user)){
            res.redirect('/company/dashboard');
        }else if(authManager.isUserRepresentative(req.user)){
            res.redirect('/representatives/dashboard');
        }else{
            //TODO define PAGE
            res.sendStatus(200);
        }

    });

router.post('/login_api', passport.authenticate('api-login'),
    function(req, res){
        if(!req.user){
            return res.send({token: null});
        }

        res.send({token: authManager.generateJWT(req.user)});
    });

module.exports = router;