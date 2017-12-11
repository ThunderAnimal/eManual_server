const authManager = require("./authManager");
const uploadUser = require("./uploadUser");
const MODEL_PATH = '../models/';
const productModel = require(MODEL_PATH + 'Product');

const isProductFromOwnCompany = function(productCompanyId, user){

    if(authManager.getCompanyId(user).toString() === productCompanyId.toString())
        return true;

    return false;
};

const sendForbiddenEditProduct = function(res){
    res.status(403).send({
        status: 403,
        message: "Forbidden! Only Product from own Company can be edit."
    });
};

const uploadFiles = function (files, done) {
    if (files) {
        uploadUser.uploadFiles(files, function (extUrl) {
            done(extUrl);
        });
    } else {
        done([]);
    }
};

const deleteFiles = function(fileUlrList ,done){
    if(!fileUlrList)
        return done();

    uploadUser.deleteFiles(getFileNames(fileUlrList), done);

};

const getFileNames = function(fileUrlList){
    let fileNames = [];
    for(let i = 0; i < fileUrlList.length; i++){

        fileNames.push(fileUrlList[i].split("/").pop());
    }
    return fileNames;
};


const getProductResourcesArray = (resource, resourceURLs, done) => {
    let productResourcesArray = [];
    for (let i = 0; i < resourceURLs.length; i++) {
        let tempResource = {
            description: resource[i].description,
            originalName: resource[i].originalname,
            dataType: resource[i].mimetype,
            url: resourceURLs[i]
        };

        productResourcesArray.push(tempResource);
    }

    done(productResourcesArray);
};

const mergeResourcesAndDescription = function(resources_list, resources_description){
    const mergedArray = [];

    if(!resources_list){
        return;
    }

    if(!resources_description){
        resources_description = [''];
    }

    if (!Array.isArray(resources_description)){
        resources_description = [resources_description];
    }

    for(let i = 0; i < resources_list.length; i++){
        const obj = resources_list[i];

        if(resources_description[i] === ''){
            obj.description = resources_list[i].originalname;
        }else{
            obj.description = resources_description[i];
        }

        mergedArray.push(obj);
    }

    return mergedArray;
};


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

exports.getCompanyProduct = function(req, res){
    const companyID = authManager.getCompanyId(req.user);

    productModel.find({company_id: companyID}, function(err, result) {
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
        query_products = {"categories": {"$all" : cat_list}};
    }

    productModel.find(query_products, function (err, result) {
        done(err, result);
    });
};

exports.create = function (req, res) {
    const companyId = authManager.getCompanyId(req.user);
    const profilePicture = req.files.profilePicture;
    const images = req.files.image;
    let resources = req.files.resources;
    const resourcesDescription = req.body.resources_description;

    resources = mergeResourcesAndDescription(resources, resourcesDescription);

    uploadFiles(resources, function (resourceUrls) {
        getProductResourcesArray(resources, resourceUrls, (productResourcesArray) => {
            uploadFiles(profilePicture, function (profilePicURL) {
                uploadFiles(images, function (imageUrls) {
                    const product = new productModel({
                        productName: req.body.name,
                        profilePicture: profilePicURL[0],
                        company_id: companyId,
                        categories: req.body.categories,
                        productImages: imageUrls,
                        productResources: productResourcesArray
                    });

                    product.save(function (err, result) {
                        if (err) {
                            console.log(err);
                            res.status(500).send({_error: true, err: err});
                        } else {
                            res.status(201).send(result);
                        }
                    });
                });
            });
        });
    });
};

exports.update = function(req, res){
    const profilePicture = req.files.profilePicture;
    const productId = req.params.id;
    const images = req.files.image;
    let resources = req.files.resources;
    const resourcesDescription = req.body.resources_description;

    resources = mergeResourcesAndDescription(resources, resourcesDescription);

    if(!productId){
        return res.status(400).send({_error: true, err: "No Product ID"})
    }
    productModel.findById(productId, function (err, product) {
        if (err) {
            console.log(err);
            return res.status(500).send({_error: true, err: err});
        }

        if (!product) {
            return res.status(400).send({_error: true, err: "Product not found"});
        }

        if (!isProductFromOwnCompany(product.company_id, req.user))
            return sendForbiddenEditProduct(res);

        uploadFiles(resources, function (resourceUrls) {
            getProductResourcesArray(resources, resourceUrls, (productResourcesArray) => {
                uploadFiles(profilePicture, function (profilePicURL) {
                    uploadFiles(images, function (imageUrls) {
                        product.productName = req.body.name;

                        if(profilePicURL[0]){
                            const oldImageUrl =  product.profilePicture;
                            deleteFiles([oldImageUrl],function () {});
                            product.profilePicture = profilePicURL[0];
                        }

                        product.categories = req.body.categories;
                        product.productImages = product.productImages.concat(imageUrls);
                        product.productResources = product.productResources.concat(productResourcesArray);
                        product.save(function (err, result) {
                            if (err) {
                                console.log(err);
                                res.status(500).send({_error: true, err: err});
                            } else {
                                res.status(200).send(result);
                            }
                        });
                    });
                });
            });
        });
    });
};

exports.delete = function (req, res){
    const productId = req.params.id;

    if(!productId){
        return res.status(400).send({_error: true, err: "No Product ID"})
    }

    productModel.findById(productId, function (err, product) {
        if(err){
            console.log(err);
            return res.status(500).send({_error: true, err: err});
        }

        if(!isProductFromOwnCompany(product.company_id, req.user))
            return sendForbiddenEditProduct(res);

        productModel.findByIdAndRemove(productId, function (err, removed) {
            if(err){
                console.log(err);
                return res.status(500).send({_error: true, err: err});
            }

            if(!removed){
                return res.status(400).send({_error: true, err: "Product not found"});
            }

            deleteFiles(removed.productImages.concat(removed.productResources).push(removed.profilePicture),function(){

            });
            return res.sendStatus(204);
        });
    });
};

exports.deleteMaterials = function(req, res){
    const productId = req.params.id;
    const images = req.body['image_list[]'];
    const resources = req.body['resource_list[]'];

    let image_list = [];
    if (Array.isArray(images)){
        image_list = images;
    }else{
        if(images){
            image_list.push(images)
        }
    }

    let resources_list = [];
    if (Array.isArray(resources)){
        resources_list = resources;
    }else{
        if(resources){
            resources_list.push(resources)
        }
    }

    if(!productId){
        return res.status(400).send({_error: true, err: "No Product ID"})
    }


    productModel.findById(productId, function (err, product) {
        if(err){
            console.log(err);
            return res.status(500).send({_error: true, err: err});
        }

        if(!product){
            return res.status(400).send({_error: true, err: "Product not found"});
        }

        if(!isProductFromOwnCompany(product.company_id, req.user))
            return sendForbiddenEditProduct(res);

        deleteFiles(image_list,function(){
           deleteFiles(resources_list,function () {
               product.productImages = product.productImages.filter( function( obj){
                   if(!images)
                       return true;

                   return image_list.indexOf(obj) < 0;

               });
               product.productResources = product.productResources.filter( function( obj){
                   if(!resources)
                       return true;

                   return resources_list.indexOf(obj.url) < 0;

               });

               product.save(function (err, result) {
                   if(err){
                       console.log(err);
                       res.status(500).send({_error: true, err: err});
                   }else{
                       res.status(200).send(result);
                   }
               });


           });
        });

    });
};

exports.addMaterials = function(req, res){
    const productId = req.params.id;
    const images = req.files.image;
    const resources = req.files.resources;


    if(!productId){
        return res.status(400).send({_error: true, err: "No Product ID"})
    }

    productModel.findById(productId, function (err, product) {
        if (err) {
            console.log(err);
            return res.status(500).send({_error: true, err: err});
        }

        if (!product) {
            return res.status(400).send({_error: true, err: "Product not found"});
        }

        if (!isProductFromOwnCompany(product.company_id, req.user))
            return sendForbiddenEditProduct(res);

        uploadFiles(images, function (imageUrls) {
            uploadFiles(resources, function (resourceUrls) {
                getProductResourcesArray(resources, resourceUrls, (productResourcesArray) => {

                    product.productImages = product.productImages.concat(imageUrls);
                    product.productResources = product.productResources.concat(productResourcesArray);

                    product.save(function (err, result) {
                        if (err) {
                            console.log(err);
                            res.status(500).send({_error: true, err: err});
                        } else {
                            res.status(200).send(result);
                        }
                    });
                });
            });
        });
    });
};

exports.getRecentlyCreatedProducts =(req,res) => {
    const offset = req.body.offset;
    const quantity = req.body.quantity;
    // const offset = 0;
    // const quantity = 2;
    productModel.find({}, (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).send({_error: true, err: error});
        }
        //Simple bubble sort sorting
        for (let i=0; i<result.length; i++){
            for (let j=0; j<result.length-i-1; j++){
                if (result[j].createdAt < result[j+1].createdAt){
                    let temp = result[j];
                    result[j] = result[j+1];
                    result[j+1] = temp;
                }
            }
        }
        //Offset: if 0, start from 0, if 25, start from product number 25, if 33, start from product number 33 and so on
        //Note: Offset of 1st product is always '0'
        //Example:  If offset is 5 and quantity is 5, then client will get prod number 5, 6, 7, 8 & 9.
        if (offset < 0)
            res.status(500).send({_error: true, err: "Offset Negative"});
        else if (offset >= result.length)
            res.status(500).send({_error: true, err: "Offset beyond number of products"});
        else if (quantity <= 0)
            res.status(500).send({_error: true, err: "Quantity cannot be zero or less"});
        else if ((offset + quantity) > result.length){
            let returnList = [];
            for (let i = offset; i<result.length; i++){
                returnList.push(result[i]);
            }
            res.status(200).send(returnList);
        }
        else {
            // console.log("Hello");
            let returnList = [];
            for (let i=offset; i<offset+quantity; i++){
                returnList.push(result[i]);
            }
            res.status(200).send(returnList);
        }

    });
};