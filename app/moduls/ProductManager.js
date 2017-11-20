var authManager = require("./authManager");
var uploadUser = require("./uploadUser");
var productModel = require("../models/Product");

exports.getOne = function(req, res, next) {
    next(new Error('not implemented'));
};

exports.getAll = function(req, res, next){
    next(new Error('not implemented'));
};

exports.create = function(req, res, next){
    const companyId = authManager.getCompanyId(req.user);
    const files = req.files;
    const images = req.files.image;
    const resources = req.files.resoruces;
    const total = images.concat(resources);

    uploadUser(total ,function (extUrl) {

        console.log("hi");
        console.log(extUrl);

        var product = new productModel({
            productName : req.body.name,
            company_id: companyId,
            categories: req.body.categories,
            productImages: extUrl[0],
            productResources: extUrl[1]
        });

        product.save(function (err, result) {
            if(err){
                console.log(err);
                res.status(500).send({_error: true, err: err});
            }else{
                res.status(201).send(result);
            }
        });
    });
    /*
    console.log(companyId);
    console.log(req.files);
    console.log(req.body);


    //TODO Strore the uplaod files somwhere and save the link in the mongodb as well
    var dummyImgageRefList = [];
    var dummyResourcesRefList = [];
    if(images){
        for(var i = 0; i < images.length; i++){
            dummyImgageRefList.push(images[i].originalname);
        }
    }

    if(resources){
        for(var j = 0; j < resources.length; j++){
            dummyResourcesRefList.push(resources[j].originalname);
        }
    }
    */

};

exports.update = function(req, res, next){
    next(new Error('not implemented'));
};

exports.delete = function (req, res, next){
    next(new Error('not implemented'));
};