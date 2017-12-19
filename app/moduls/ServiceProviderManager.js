const MODEL_PATH = '../models/';
const serviceProviderModel = require(MODEL_PATH + 'ServiceProvider');
const companyModel = require(MODEL_PATH + 'Company');

//to get all service provider
exports.getAllServiceProviders = function(req, res, next) {
    serviceProviderModel.find({}, function (err, result) {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            res.status(200).send(result);
        }

    });
};

exports.sendMessagesToConsumers = function(req, res){
    const subject = req.body.subject;
    const message = req.body.message;
    let company_list = req.body.companies;

    if(!subject || !message || company_list){
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

            //TODO Get all Users from companies, filter duplicates, send mails
            res.status(200).send({send: true, count: 0});
        });
    });
};

