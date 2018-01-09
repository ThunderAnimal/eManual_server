const express = require('express');
const router = express.Router();

const policy = require('../app/moduls/routePolicy');

const authManager = require('../app/moduls/authManager');

const getUserViewObj = function (user) {
    let profileUrl;
    let name;
    let image;

    if(authManager.isUserCompany(user)){
        profileUrl = "/company/dashboard";
        name = user.name;
    } else if(authManager.isUserRepresentative(user)){
        profileUrl = "/representatives/dashboard";
        name = user.name;
    } else if(authManager.isUserConsumer(user)){
        profileUrl = "/consumer";
        name = user.username;
        image = user.image;
    }else if(authManager.isUserServiceProvider(user)){
        profileUrl = "/service_provider";
        name = user.name;

    }

    return  {
        name: name,
        profileUrl: profileUrl,
        image: image
    }
};

// HOME PAGE (start page)
router.get('/', function(req, res) {
    res.render('index', {isLoggedIn: req.isAuthenticated(),
        user: getUserViewObj(req.user)
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
router.get('/representatives/updateProduct', policy.isLoggedIn, function (req,res) {
    const _id = req.query.id;

    if(!_id){
        const err = new Error("Missing Product-Id");
        err.status = 400;
        next(err);
    }else{
        res.render('updateProduct',
            {
                id: _id,
                name: req.user.name
            });
    }
});
router.get('/representatives/serviceprovider', policy.isLoggedIn, function(req,res){
    res.render('RepresentativeServiceProviders', {name: req.user.name});
});
//DASHBOARD - ServiceProvider Spam Email
router.get('/service_provider', policy.isLoggedIn, function (req,res) {
    res.render('SpamEmail', {user: getUserViewObj(req.user)});
});

//Consumer
router.get('/consumer', policy.isLoggedIn, function (req,res) {
    res.render('ConsumerPage', {user: req.user});
});

//Browse Category
router.get('/category',function (req,res) {
    res.render('categories', {isLoggedIn: req.isAuthenticated(),
        user: getUserViewObj(req.user)
    });
});

//PRDOUCTS
router.get('/product', function (req, res, next) {
    const _id = req.query.id;

    if(!_id){
        const err = new Error("Missing Product-Id");
        err.status = 400;
        next(err);
    }else{
        res.render('detailProduct',
            {
                id: _id,
                isLoggedIn: req.isAuthenticated(),
                user: getUserViewObj(req.user),
                isRepresantive: authManager.isUserRepresentative(req.user),
                isCustomer: authManager.isUserConsumer(req.user)
        });
    }
});

//SEARCH
router.get('/search', function (req, res, next) {
    res.render('search', {isLoggedIn: req.isAuthenticated(),
        user: getUserViewObj(req.user)
    });
});

//LOGIN PAGE
router.get('/login', function(req, res){
    req.session.redirect_url = req.query.redirect_url;
    res.render('login', {message: req.flash('loginMessage') });
});

//LOGOUT
router.get('/logout', function(req, res){
   req.logout();
   res.redirect('/');
});

module.exports = router;
