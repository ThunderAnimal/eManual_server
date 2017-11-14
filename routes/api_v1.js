var express = require('express');
var router = express.Router();
var rep = require('../app/models/Representative');
var policy = require('../app/moduls/routePolicy');
let context = {
    status:null,
};
var result = null;


router.get('/representatives', policy.onlyCompanyAllowed, function (req, res, next) {
    // //How to get the id from the company
    // console.log(req.user._id);
    // //TODO GET DATA FROM DATABASE
    //res.send({data: req.user.name});
    rep.Representative.find({"company": req.user._id},{name:1},function (err, data) {
        data.forEach(function(item){
            console.log(item.name);
        });
        result = data;
    }).then(function (resolve, reject) {
        if(!req.session.user){
            context.status = "You are not logged in.";
            res.render("./",context)
        }else{
            context.status = "Hello "+ req.session.user;
            res.render("./",context);
        }
    }).catch(function(){
        console.log("Catching some exception");
    });
});

router.post('/representatives/create', policy.onlyCompanyAllowed, function (req, res, next) {
    //How to get the id from the company
    console.log(req.body);

    var NewRep = new rep.Representative({
        login : req.body.login,
        password: req.body.password,
        name: req.body.name,
        company: req.user._id
    });

    NewRep.save().then(function () {
        res.redirect("/company/dashboard");
    });

});
module.exports = router;