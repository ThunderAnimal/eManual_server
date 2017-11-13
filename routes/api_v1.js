var express = require('express');
var router = express.Router();
var rep = require('../app/models/Representative');
var policy = require('../app/moduls/routePolicy');

router.get('/representatives', policy.onlyCompanyAllowed, function (req, res, next) {
    //How to get the id from the company
    console.log(req.user._id);
    //TODO GET DATA FROM DATABASE
    res.send({data: req.user.name});
});

router.post('/representatives/create', policy.onlyCompanyAllowed, function (req, res, next) {
    //How to get the id from the company
    console.log(req.body);

    var NewRep = new rep({
        login : req.body.login,
        password: req.body.password,
        name: req.body.name,
        company: req.user._id
    });

    //TODO
    //is rest-api so should send back an success or error
    //and the client sould handle the redirect or showing error
    NewRep.save().then(function () {
        res.redirect("/company/dashboard");
    });

});
module.exports = router;