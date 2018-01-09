const MODEL_PATH = '../models/';
const serviceProviderModel = require(MODEL_PATH + 'ServiceProvider');
const companyModel = require(MODEL_PATH + 'Company');
const consumerModel = require(MODEL_PATH + 'Consumer');
const productModel =  require(MODEL_PATH + 'Product');

const authManager = require("./authManager");
const mailManager = require("./MailManager");

const fillServiceProviderAuthorization = function(service_list, user, done){
    if(!user){
        return done(service_list);
    }

    if(!(authManager.isUserRepresentative(user) || !authManager.isUserCompany(user))){
        return done(service_list);
    }

    const company_id = authManager.getCompanyId(user);

    companyModel.findById(company_id, function (err, company) {
        for(let i = 0; i < company.serviceProvider_id.length; i++){
            for(let k = 0; k < service_list.length; k++){
                if(company.serviceProvider_id[i].toString() === service_list[k]._id.toString()){
                    service_list[k] = service_list[k].toJSON();
                    service_list[k].isAuthorized = true;
                    break;
                }
            }
        }
        done(service_list);
    });
};


//to get all service provider
exports.getAllServiceProviders = function(req, res) {
    serviceProviderModel.find({}, function (err, result) {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            fillServiceProviderAuthorization(result, req.user, function (service_list) {
                res.status(200).send(service_list);
            })
        }

    });
};

exports.getListFromProduct = function(req, res){
    productModel.findOne({_id : req.params.id}, function(err, product) {
        if(err){
            console.log(err);
            res.status(500).send(err);
        }else{
            companyModel.findById(product.company_id)
                .populate('serviceProvider_id', 'name')
                .exec(function (err, company) {
                    if(err){
                        console.log(err);
                        res.status(500).send(err);
                    }else {
                        res.status(200).send(company.serviceProvider_id);
                    }
                });
        }
    });
};

exports.getListFromCompany = function (req, res) {
    companyModel.findById(req.params.id)
        .populate('serviceProvider_id', 'name')
        .exec(function (err, company) {
            if(err){
                console.log(err);
                res.status(500).send(err);
            }else {
                res.status(200).send(company.serviceProvider_id);
            }
        });
};

exports.addServiceProvider = function(req,res){
    const company_id = authManager.getCompanyId(req.user);
    const serviceProvider_id = req.body.spID;

    serviceProviderModel.findById(serviceProvider_id,function (err, sp) {
        sp.company_id.push(company_id);
        sp.save(function (err) {
            if(err){
                console.log(err);
                res.status(500).send(err);
            }else {
                companyModel.findById(company_id,function (err, c) {
                    c.serviceProvider_id.push(serviceProvider_id);
                    c.save(function (err) {
                        if(err){
                            console.log(err);
                            res.status(500).send(err);
                        }else {

                            res.status(200).send("success");
                        }
                    });
                });
            }
        });
    });


};

exports.deleteServiceProvider = function(req,res){
    const company_id = authManager.getCompanyId(req.user);
    const serviceProvider_id = req.body.spID;

    serviceProviderModel.findById(serviceProvider_id,function (err, sp) {
        sp.company_id.splice(sp.company_id.indexOf(company_id), 1);
        sp.save(function (err) {
            if(err){
                console.log(err);
                res.status(500).send(err);
            }else {
                companyModel.findById(company_id,function (err, c) {
                    c.serviceProvider_id.splice(c.serviceProvider_id.indexOf(serviceProvider_id), 1);
                    c.save(function (err) {
                        if(err){
                            console.log(err);
                            res.status(500).send(err);
                        }else {
                            res.status(200).send("success");
                        }
                    });
                })
            }
        });
    });


};

exports.sendMessagesToConsumers = function(req, res){
    const subject = req.body.subject;
    const message = req.body.message;
    let company_list = req.body.companies;

    if(!subject || !message || !company_list){
        return res.status(400).send({_error: true, error: "Wrong Parameters"});
    }

    if(!Array.isArray(company_list)){
        company_list = [company_list];
    }

    serviceProviderModel.findById(req.user._id, function (err, serviceProvider) {
        if(err){
            console.log(err);
            return res.status(500).send({_error: true, error: err});
        }

        //Check if the Service Provider has really access to these companys customers
        const checked_company_list = company_list.filter(function (value) {
            return serviceProvider.company_id.indexOf(value) === 1;
        });

        if(checked_company_list.length <= 0){
            return res.status(400).send({_error: true, error: "You are not allowed to send messages to these customers"});
        }

        companyModel.find({'_id': { $in : checked_company_list}}, function (err, companies) {
            if(err){
                console.log(err);
                return res.status(500).send({_error: true, error: err});
            }

            let user_list = [];
            for(let i = 0; i < companies.length; i++){
                user_list = user_list.concat(companies.isConsumerOptIn);
            }

            consumerModel.find({
                '_id': { $in : user_list},
                'optin': true
            }, function (err, consumers) {
                for(let i = 0; i < consumers.length; i++){
                    mailManager.sendMessage("info@manualpik.com", consumers[i].spamAddress, subject, message);
                }

                res.status(200).send({send: true, count: consumers.length});
            });
        });
    });
};

