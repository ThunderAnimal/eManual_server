var express = require('express');
var router = express.Router();

var policy = require('../app/moduls/routePolicy');

// HOME PAGE (start page)
router.get('/', function(req, res) {
    res.render('index', { title: 'Hey', message: req.flash('errorMessage')});
});

//DASHBOARD - Company
router.get('/company/dashboard', policy.isLoggedIn, function (req,res) {
    res.render('dashboard');
});

router.get('/company/createRep', policy.isLoggedIn, function (req,res) {
    res.render('createRep');
});

//DASHBOARD - Representatives
router.get('/representatives/dashboard', policy.isLoggedIn, function(req,res){
    res.render('RepresentativeDashboard', {name: req.user.name});
});
router.get('/representatives/createProduct', policy.isLoggedIn, function (req,res) {
    res.render('createProduct', {name: req.user.name});
});

//Consumer
router.get('/consumer', policy.isLoggedIn, function (req,res) {
    res.render('ConsumerPage');
});
//LOGIN PAGE
router.get('/login', function(req, res){
   res.render('login', {message: req.flash('loginMessage') });
});

//LOGOUT
router.get('/logout', function(req, res){
   req.logout();
   res.redirect('/');
});

module.exports = router;
