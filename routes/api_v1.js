var express = require('express');
var router = express.Router();
var rep = require('../app/models/Representative');
var policy = require('../app/moduls/routePolicy');


//API representatives
router.route('/representatives')
    .all(policy.onlyCompanyAllowed)
    .get( function (req, res, next) {
        rep.find({"company": req.user._id},{name:1},function (err, data) {
            if(err){
                console.log(err);
            }
            res.send(data);
        }).catch(function(e){
            var err = new Error(e);
            err.status = 500;
            next(err);
        });
    })
    .post(function (req, res, next) {
        var NewRep = new rep({
            login: req.body.login,
            password: req.body.password,
            name: req.body.name,
            company: req.user._id
        });

        NewRep.save().then(function (err, result) {
            if (err) {
                res.send(err);
            } else {
                res.status(200).send(result);
            }
        });
    });

//API Products

module.exports = router;