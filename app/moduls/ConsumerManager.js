const MODEL_PATH = '../models/';
const consumerModel = require(MODEL_PATH + 'Consumer');
const productModel = require(MODEL_PATH + 'Product');


exports.create = function (req, res, next) {

    let consumer = new consumerModel ({
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
    const clientAdd = req.body.add;
    const clientDelete = req.body.delete;

    consumerModel.find({}, function (err, data) {
        if (err) {
            console.log(err);
        }
    });
    let updateConsumerModel = function (userId, done) {
        consumerModel.findOne({_id: userId}, function (err, consumer) {
            if (clientAdd) {
                consumer.products.push(product_id);
                consumer.save();


                // res.send("successfully added");
                done(true);
            } else if (clientDelete) {
                if (consumer.products.indexOf(product_id) !== -1) {
                    consumer.products.splice(consumer.products.indexOf(product_id), 1)
                }

                consumer.save();
                // res.send("success deleted");
                done(false);

            }
            else {
                res.status(400).send("no input")
            }
        });

    };

    let addOrRemoveFavorite = function (bool, done) {
        productModel.findById(product_id, function (err, productObject) {
            if (err) {
                console.log(err);
                return res.status(500).send(err);
            }

            if (bool) {
                productObject.favorites++;
                productObject.save(function () {
                    done(true);
                })
            }
            else{
                productObject.favorites--;
                productObject.save(function () {
                    done(false);
                })

            }
        });
    };


        updateConsumerModel(req.user._id, function (bool) {
            addOrRemoveFavorite(bool, function (bool) {
                if (!bool)
                    res.send("success deleted");
                else
                    res.send("successfully added");
            });
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

exports.getSelectedProduct=function (req,res) {
    consumerModel.findById(req.user._id,function(err, consumer){
        if(err){
            console.log(err);
            return res.status(500).send(err);
        }

        if(!consumer){
            return res.sendStatus(401);
        }

        productModel.find({'_id' : {$in: consumer.products}},function (err, result) {
            if(err){
                console.log(err);
                res.status(500).send(err);
            }else{
                res.status(200).send(result);
            }
        });
    });

};

exports.getUpdatedConsumerProducts =  (userID, done) => {
    consumerModel.findOne({"_id": userID}, (err, data) => {
        if (err)
            console.log("Some Error Occured: "+err);
        else {
            done(data.products);
        }

    });
};