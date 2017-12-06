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

let uploadProfilePicture = (profilePicture, done) => {
    if (profilePicture) {
        uploadUser.uploadFiles(profilePicture, (extUrl) => {
            done(extUrl);
        });
    }
    else {
        done([]);
    }
};

let getProductResourcesArray = (req, resourceURLs, done) => {
    let productResourcesArray = [];
    for (let i = 0; i < resourceURLs.length; i++) {
        let tempResource = {
            description: req.body.productResources[i].description,
            originalName: req.body.productResources[i].originalName,
            dataType: req.body.productResources[i].dataType,
            url: resourceURLs[i]
        };

        productResourcesArray.push(tempResource);
    }

    done(productResourcesArray);
};

//TODO enable comments.
exports.create = function (req, res) {

    const companyId = authManager.getCompanyId(req.user);
    const profilePicture = req.files.profilePicture;
    const images = req.files.image;
    const resources = req.files.resources;

    const uploadImages = function (images, done) {
        if (images) {
            uploadUser.uploadFiles(images, function (extUrl) {
                done(extUrl);
            });
        } else {
            done([]);
        }
    };

    const uploadResources = function (resources, done) {
        if (resources) {
            uploadUser.uploadFiles(resources, function (extUrl) {
                done(extUrl);
            });
        } else {
            done([]);
        }
    };

    uploadResources(resources, function (resourceUrls) {
        getProductResourcesArray(req, resourceUrls, (productResourcesArray) => {
            uploadProfilePicture(profilePicture, function (profilePicURL) {
                uploadImages(images, function (imageUrls) {

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
    console.log(req.body);
    //const default_image = req.files.default_image;
    const profilePicture = req.files.profilePicture;
    const productId = req.params.id;
    const images = req.files.image;
    const resources = req.files.resources;


    const uploadImages = function(images ,done){
        if(images){
            uploadUser.uploadFiles(images, function (extUrl) {
                done(extUrl);
            });
        }else{
            done([]);
        }
    };

    const uploadResources = function(resources, done){
        if(resources){
            uploadUser.uploadFiles(resources, function (extUrl) {
                done(extUrl);
            });
        }else{
            done([]);
        }
    };

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

        uploadResources(resources, function (resourceUrls) {
            getProductResourcesArray(req, resourceUrls, (productResourcesArray) => {
                uploadProfilePicture(profilePicture, function (profilePicURL) {
                    uploadImages(images, function (imageUrls) {
                        product.productName = req.body.name;
                        product.profilePicture = profilePicURL[0];
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

    const getFileNames = function(fileList){
        let fileNames = [];
        for(let i = 0; i < fileList.length; i++){
            fileNames.push(fileList[i].split("/").pop());
        }
        return fileNames;
    };
    const deleteMaterials = function(materials ,done){
        if(!materials)
            return done();

        uploadUser.deleteFiles(getFileNames(materials), done);

    };

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

            deleteMaterials(removed.productImages.concat(removed.productResources),function(){

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

    const getFileNames = function(fileList){
        let fileNames = [];
        for(let i = 0; i < fileList.length; i++){

            fileNames.push(fileList[i].split("/").pop());
        }
        return fileNames;
    };
    const deleteImgaes = function(images ,done){
        if(!images)
            return done();

        uploadUser.deleteFiles(getFileNames(images), done);

    };

    const deleteResources = function(resources, done){
        if(!resources)
            return done();

        uploadUser.deleteFiles(getFileNames(resources), done);
    };


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

        deleteImgaes(image_list,function(){
           deleteResources(resources_list,function () {
               product.productImages = product.productImages.filter( function( obj){
                   if(!images)
                       return true;

                   return image_list.indexOf(obj) < 0;

               });
               product.productResources = product.productResources.filter( function( obj){
                   if(!resources)
                       return true;

                   return resources_list.indexOf(obj) < 0;

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


    const uplaodImgaes = function(images ,done){
        if(images){
            uploadUser.uploadFiles(images, function (extUrl) {
                done(extUrl);
            });
        }else{
            done([]);
        }
    };

    const uploadResources = function(resources, done){
        if(resources){
            uploadUser.uploadFiles(resources, function (extUrl) {
                done(extUrl);
            });
        }else{
            done([]);
        }
    };

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

        uplaodImgaes(images, function (imageUrls) {
            uploadResources(resources, function (resourceUrls) {
                getProductResourcesArray(req, resourceUrls, (productResourcesArray) => {

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