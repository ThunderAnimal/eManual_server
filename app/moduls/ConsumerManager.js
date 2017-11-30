const consumerModel = require("../models/Consumer");
const productModel = require("../models/Product");


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

exports.changeProducts=function (req,res,next) {
    const product_id = req.body.product_id;
    const clientAdd= req.body.add;
    const clientDelete= req.body.delete;

    consumerModel.find({}, function (err, data) {
        if (err) {
            console.log(err);
        }
    });

    consumerModel.findOne({_id: req.user._id}, function (err, consumer) {
        if (clientAdd) {
            consumer.products.push(product_id);
            consumer.save();

            res.send("successfully added");

        } else if (clientDelete) {
            if (consumer.products.indexOf(product_id)!==-1){
                consumer.products.splice(consumer.products.indexOf(product_id),1)
            }

            consumer.save();
            res.send("success deleted");

        }
        else{
            res.status(400).send("no input")
        }
    });
}


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

exports.getSelectedProduct=function (req,res) {
    productModel.find({'_id' : {$in: req.user.products}},function (err, result) {
        if(err){
            console.log(err);
            res.status(500).send(err);
        }else{
            res.status(200).send(result);
        }
    });
};