const MODEL_PATH = '../models/';
const MODUL_PATH = '../moduls/';
const consumerModel = require(MODEL_PATH + 'Consumer');
const productModel = require(MODEL_PATH + 'Product');
const companyManager = require(MODUL_PATH+'CompanyManager');
const productManager = require(MODUL_PATH+'ProductManager');

const serviceProviderModel = require(MODEL_PATH + 'ServiceProvider');
const mailManager = require('./MailManager');



exports.create = function (req, res, next) {

    let consumer = new consumerModel ({
        username: req.body.user,
        password: req.body.pass,
        email: req.body.email,
        spamAddress: req.body.email
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
                if (!bool) {
                    companyManager.changeCustomerOptIn(product_id, req.user._id, false, ()=> {
                        res.send("success deleted");
                    });

                }
                else {
                    companyManager.changeCustomerOptIn(product_id, req.user._id, true, ()=> {
                        res.send("success added");
                    });
                }
            });
        });
};

exports.isNoMoreProductFromThatCompany = (user_id, company_id, done) => {
    consumerModel.findOne({_id: user_id}, (error, consumer) => {
        if (error){
            console.log("Error: Cannot find the user_id in Consumer Model ConsumerManager.js "+error);
        }
        else {
            let companyArray = [];
            let flag = true;
            let countLength = consumer.products.length-1;


            function fillCompanyArray (count){
                if (!(count < 0)){
                    productManager.getCompanyIDbyProductID(consumer.products[count], (companyID) => {
                        companyArray.push(companyID);
                        let newCount = count -1;
                        fillCompanyArray(newCount);
                    });
                }
                else {
                    for (let i = 0; i<companyArray.length; i++){
                        console.log("LHS: "+companyArray[i].toString()+" RHS: "+company_id.toString());
                        if (companyArray[i].toString() === company_id.toString()){
                            flag = false;
                            break;
                        }
                    }
                    done(flag);
                }
            }
            fillCompanyArray(countLength);
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
                spamAddress:email,
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
                spamAddress:email,
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
    consumerModel.findById(userID, (err, data) => {
        if (err){
            console.log("Some Error Occured: "+err);
            done([]);
        }
        else {
            done(data.products);
        }
    });
};

exports.updateSpamAddress = (req,res) =>{
    consumerModel.findById(req.user._id,function(err, consumer) {
        if (err) {
            console.log(err);
            return res.status(500).send(err);
        }

        if (!consumer) {
            return res.sendStatus(401);
        }

        consumer.spamAddress = req.body.spamAddress;
        consumer.save(function (err, result) {
            if (err) {
                console.log(err);
                res.status(500).send({_error: true, err: err});
            } else {
                res.status(200).send(result);
            }
        });
    });
};

exports.getSpamAddress = (req, res) => {
    let consumerID = req.user._id;
    consumerModel.findOne({_id: consumerID}, (error, data) => {
        if (error) {
            console.log("Error in getting consumer object from consumer ID: consumermanager.js: " + error);
            res.status(500).send(error);
        }
        else {
            res.status(200).send(data.spamAddress);
        }
    });
};

/*
    Note:
    No request data needed. Just toggles the current subscription status. If subscribed, will unsubscribed, and vice-
    versa.

    Use the '/get_subscription_status' api to find out the current subscription status.
 */
exports.toggleOptIn = (req, res) => {
    let consumerID = req.user._id;
    let optin = req.body.optin;

    if (optin === false || optin === true) {
        return res.status(500).send({_error: true, err: "Wrong Parameter Sent!"});
    }

    consumerModel.findOne({_id: consumerID}, (error, data) => {
        if (error){
            console.log("Error in getting consumer object from consumer ID: consumermanager.js: "+error);
            return res.status(500).send(error);
        }

        data.optin = optin;
        data.save();
        res.status(200).send(data.optin);
    });
};

/*
    No request needed, just sends the current subscription status of the customer. True if subscribed.
 */
exports.getSubscriptionStatus = (req, res) => {
    let consumerID = req.user._id;
    consumerModel.findOne({_id: consumerID}, (error, data) => {
        if (error) {
            console.log("Error in getting consumer object from consumer ID: consumermanager.js: " + error);
            res.status(500).send(error);
        }
        else {
            res.status(200).send(data.optin);
        }
    });
};

exports.messagesToServiceProviders=function (req,res) {
    const subject = req.body.subject;
    const message = req.body.message;
    let serviceProviders_list = req.body.serviceProviders;
    if (!subject || !message || serviceProviders_list) {
        return res.status(400).send({_error: true, error: "Wrong Parameters"});
    }

    if (!Array.isArray(serviceProviders_list)) {
        serviceProviders_list = [serviceProviders_list];
    }
    serviceProviderModel.find({
        '_id': {$in: serviceProviders_list},
    }, function (err, serviceProviders) {
        if (err) {
            console.log(err);
            return res.status(500).send({_error: true, error: err});
        }

        for (let i = 0; i < serviceProviders.length; i++) {
            mailManager.sendMessage("info@manualpik.com", serviceProviders.login, subject, message);
        }

        res.status(200).send({send: true, count: serviceProviders.length});
    });
};