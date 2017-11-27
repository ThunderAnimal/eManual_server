const authManager = require("./authManager");
const uploadUser = require("./uploadUser");
const productModel = require("../models/Product");

exports.getOne = function(req, res) {
    productModel.findOne({_id : req.params.id}, function(err, result) {
        if(err){
            console.log(err);
            res.status(500).send(err);
        }else{
            res.status(200).send(result);
        }
    });
};

exports.getAll = function(req, res){
    productModel.find({}, function(err, result) {
        if(err){
            console.log(err);
            res.status(500).send(err);
        }else{
            res.status(200).send(result);
        }
    });
};

exports.getAllInCategories = function(cat_list, done){
    let query_products;

    if(cat_list.length === 0){
        query_products = {};
    }else{
        query_products = {"categories": {"$in" : cat_list}};
    }

    productModel.find(query_products, function (err, result) {
        done(err, result);
    });
};


exports.create = function(req, res, next){

    const companyId = authManager.getCompanyId(req.user);
    const images = req.files.image;
    const resources = req.files.resources;


    const uplaodImgaes = function(images ,done){
        if(images){
            uploadUser(images, function (extUrl) {
                done(extUrl);
            });
        }else{
            done([]);
        }
    };

    const uploadResources = function(resources, done){
        if(resources){
            uploadUser(resources, function (extUrl) {
                done(extUrl);
            });
        }else{
            done([]);
        }
    };

    uplaodImgaes(images, function(imageUrls){
        uploadResources(resources, function(resourceUrls){
            const product = new productModel({
                productName : req.body.name,
                company_id: companyId,
                categories: req.body.categories,
                productImages: imageUrls,
                productResources: resourceUrls
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
    });
};

exports.update = function(req, res, next){
    next(new Error('not implemented'));
};

exports.delete = function (req, res, next){
    next(new Error('not implemented'));
};