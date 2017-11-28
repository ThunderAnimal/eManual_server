var express = require('express');
var router = express.Router();

var policy = require('../app/moduls/routePolicy');

const authManager = require('../app/moduls/authManager');

// HOME PAGE (start page)
router.get('/', function(req, res) {

    let profileUrl;
    let name;
    let image;

    if(authManager.isUserCompany(req.user)){
        profileUrl = "/company/dashboard";
        name = req.user.name;
    } else if(authManager.isUserRepresentative(req.user)){
        profileUrl = "/representatives/dashboard";
        name = req.user.name;
    } else if(authManager.isUserConsumer(req.user)){
        profileUrl = "/consumer";
        name = req.user.username;
        image = req.user.image;
    }
    res.render('index', {isLoggedIn: req.isAuthenticated(),
                        user: {
                            name: name,
                            profileUrl: profileUrl,
                            image: image
                        }
        });
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
    res.render('ConsumerPage', {name: req.user.username});
});

//Browse Category
router.get('/category',function (req,res) {

    let profileUrl;
    let name;
    let image;

    if(authManager.isUserCompany(req.user)){
        profileUrl = "/company/dashboard";
        name = req.user.name;
    } else if(authManager.isUserRepresentative(req.user)){
        profileUrl = "/representatives/dashboard";
        name = req.user.name;
    } else if(authManager.isUserConsumer(req.user)){
        profileUrl = "/consumer";
        name = req.user.username;
        image = req.user.image;
    }

    res.render('categories', {isLoggedIn: req.isAuthenticated(),
        user: {
            name: name,
            profileUrl: profileUrl,
            image: image
        }
    });
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
