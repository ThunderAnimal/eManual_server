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

exports.findOrCreateGoogle = function(profile, accessToken, done){
    const email = profile.emails[0].value;
    const username = profile.name.givenName;
    const img = profile.photos[0].value;
    consumerModel.findOne({email : email}, function(err, result){
        if(!result){
            let consumer = new consumerModel({
                username: username,
                password: accessToken,
                email: email,
                image: img
            });
            consumer.save(done);
        }else{
            result.username = username;
            result.image = img;
            result.save(done);
        }
    });
};

exports.findOrCreateFacebook = function(profile, accessToken, done){
    const email = profile.emails[0].value;
    const username = profile.name.givenName;
    const img = profile.photos[0].value;
    consumerModel.findOne({email : email}, function(err, result){
        if(!result){
            let consumer = new consumerModel({
                username: username,
                password: accessToken,
                email: email,
                image: img
            });
            consumer.save(done);
        }else{
            result.username = username;
            result.image = img;
            result.save(done);
        }
    });
};