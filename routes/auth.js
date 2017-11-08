var express = require('express');
var router = express.Router();
var passport = require('passport');
var jwt = require('jsonwebtoken');

router.post('/login', passport.authenticate('local-login', {
    failureRedirect : '/login',
    failureFlash : true }),
    function(req, res){
        if(!req.user){
            req.flash('loginMessage', 'Oops! Something went wrong.');
            return res.redirect('/login');
        }
        //TODO later check type of user an decide redirect
        res.redirect('/dashboard');
    });

router.post('/login_api', passport.authenticate('api-login'),
    function(req, res){
        if(!req.user){
            return res.send({token: null});
        }

        //TODO generate jwt token from user
        res.send({token: "1234567890"});
    });

module.exports = router;