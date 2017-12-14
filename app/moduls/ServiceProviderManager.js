const MODEL_PATH = '../models/';
const serviceProviderModel = require(MODEL_PATH + 'ServiceProvider');

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

