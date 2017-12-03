const express = require('express');
const router = express.Router();
const passport = require('passport');

const consumerManager = require('../app/moduls/ConsumerManager');
const authManager = require('../app/moduls/authManager');

router.post('/create',consumerManager.create);

router.post('/login', passport.authenticate('local-login', {
    failureRedirect : '/login',
    failureFlash : true }),
    function(req, res, next){
        if(!req.user){
            req.flash('loginMessage', 'Oops! Something went wrong.');
            return res.redirect('/login');
        }

        if(req.session.redirect_url){
            res.redirect(req.session.redirect_url);
            return;
        }

        if(authManager.isUserCompany(req.user)){
            res.redirect('/company/dashboard');
        }else if(authManager.isUserRepresentative(req.user)){
            res.redirect('/representatives/dashboard');
        }else if(authManager.isUserConsumer(req.user)){
            res.redirect('/consumer');
        }else{
            let err = new Error("Not Redirect after Login defined");
            err.status = 500;
            next(err);
        }
    });

router.post('/login_api', passport.authenticate('api-login'),
    function(req, res){
        if(!req.user){
            return res.send({token: null});
        }

        res.send({token: authManager.generateJWT(req.user)});
    });


router.get('/google', passport.authenticate('google-oauth', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google-oauth', {
    failureRedirect: '/login',
    failureFlash : true }),
    function(req, res) {
        if(!req.user){
            req.flash('loginMessage', 'Oops! Something went wrong.');
        }

        if(authManager.isUserConsumer(req.user)){
            res.redirect('/consumer');
        }else{
            let err = new Error("Not Redirect after Login defined");
            err.status = 500;
            next(err);
        }
    });

router.get('/facebook', passport.authenticate('facebook-oauth', { scope: ['email', 'public_profile'] }));

router.get('/facebook/callback', passport.authenticate('facebook-oauth', {
    failureRedirect: '/login',
    failureFlash : true}),
    function(req, res) {
        if(!req.user){
            req.flash('loginMessage', 'Oops! Something went wrong.');
        }

        if(authManager.isUserConsumer(req.user)){
            res.redirect('/consumer');
        }else{
            let err = new Error("Not Redirect after Login defined");
            err.status = 500;
            next(err);
        }
    });

module.exports = router;