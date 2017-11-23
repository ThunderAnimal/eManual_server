const consumerModel = require("../models/Consumer");

exports.create = function (req, res, next) {

    var consumer = new consumerModel ({
        username: req.body.user,
        password: req.body.pass,
        email: req.body.email
    });

    consumer.save(function (err, result) {
        if(err){
            console.log(err);
            res.status(500).send({_error: true, err: err});
        }else{
            res.status(201).send(result);
        }
    });

};