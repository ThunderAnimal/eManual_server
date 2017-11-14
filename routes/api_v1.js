var express = require('express');
var router = express.Router();
var rep = require('../app/models/Representative');
var policy = require('../app/moduls/routePolicy');
var context;


router.route('/representatives', policy.onlyCompanyAllowed)
    .get( function (req, res, next) {
    // //How to get the id from the company
    // console.log(req.user._id);

    rep.find({"company": req.user._id},{name:1},function (err, data) {
        data.forEach(function(item){
            console.log(item.name);
        });
        context = data;
    }).then(function (resolve, reject) {
            res.send(context);
    }).catch(function(){
        console.log("Catching some exception");
    });
}).post(function (req, res, next) {
    //How to get the id from the company;
    var NewRep = new rep({
        login : req.body.login,
        password: req.body.password,
        name: req.body.name,
        company: req.user._id
    });

    NewRep.save().then(function (err,result) {
        if(err){
            res.send(err);
        }else {
            res.status(200).send(result);
        }
    });

});
module.exports = router;