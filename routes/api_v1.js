var express = require('express');
var router = express.Router();

var policy = require('../app/moduls/routePolicy');

router.get('/representives', policy.onlyCompanyAllowed, function (req, res, next) {
    //How to get the id from the company
    console.log(req.user._id);
    //TODO GET DATA FROM DATABASE
    res.send({data: req.user.name});
});

router.post('/representives/create', policy.onlyCompanyAllowed, function (req, res, next) {
    //How to get the id from the company
    console.log(req.user.id);

    //TODO GET DATA FROM DATABASE
    console.log("hi");
    res.send({name:"Bob"});
});
module.exports = router;