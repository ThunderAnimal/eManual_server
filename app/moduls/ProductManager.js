const authManager = require("./authManager");
const mailManager = require("./MailManager");
const consumManager =  require('./ConsumerManager');
const uploadUser = require("./uploadUser");
const MODEL_PATH = '../models/';
const productModel = require(MODEL_PATH + 'Product');

const isProductFromOwnCompany = function(productCompanyId, user){

    return authManager.getCompanyId(user).toString() === productCompanyId.toString();

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

const fillProductFavorite = function(product_list, user, done){
    if(!user){
        return done(product_list);
    }

    if(!authManager.isUserConsumer(user)){
        return done(product_list);
    }

    consumManager.getUpdatedConsumerProducts(user._id, function (user_product_list) {
        for(let i = 0; i < user_product_list.length; i++){
            for(let k = 0; k < product_list.length; k++){
                if(user_product_list[i].toString() === product_list[k]._id.toString()){
                    product_list[k] = product_list[k].toJSON();
                    product_list[k].isFavorite = true;
                    break;
                }
            }
        }
        done(product_list);
    });
};

exports.getOne = function(req, res) {
    productModel.findOne({_id : req.params.id}, function(err, result) {
        if(err){
            console.log(err);
            res.status(500).send(err);
        }else{
            fillProductFavorite([result], req.user, function (product_result) {
                res.status(200).send(product_result[0]);
            });
        }
    });
};

exports.getCompanyIDbyProductID = (product_id, done) => {
    productModel.findOne({_id: product_id}).select('company_id -_id').exec((err, result) => {
        if(err){
            console.log("Error in getting companyID by productID ProductManager.js "+err);
            // res.status(500).send(err);
        }
        else{
            // console.log("kkhkjhkj "+ result.company_id);
            done(result.company_id);
        }
    });
};

exports.getCompanyProduct = function(req, res) {
    const companyID = authManager.getCompanyId(req.user);

    /*
     * Assumptions:
     *
     *              fieldName = 2 =>    Sort By Name
     *              fieldName = 3 =>    Sort By Favorites
     *
     *
     *              order     = 0 =>    Sort By Ascending Order
     *              order     = 1 =>    Sort By Descending Order
     *
     *              value of fieldName == null or invalid value => Send default Order.
     *              value of order     == null or invalid value => Assume Ascending Order.
     *              */

    const fieldName = Number(req.query.fieldName), order = Number(req.query.order);

    if (fieldName < 2 || fieldName > 3 || isNaN(fieldName)){
        productModel.find({
            company_id: companyID
        }, function(err, result) {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            } else {
                res.status(200).send(result);
            }
        });
        return;
    }

    switch (fieldName) {
        case 2:
            let findFromModel1 = (done) => {
                if (order <= 0 || order > 1 || order == null) {
                    productModel.find()
                        .sort({
                            productName: 'asc'
                        })
                        .exec((error, result) => {
                            if (error) {
                                console.log(error);
                                return res.status(500).send({
                                    _error: true,
                                    err: error
                                });
                            } else {
                                res.status(200).send(result);
                            }

                        });
                } else {
                    productModel.find()
                        .sort({
                            productName: 'desc'
                        })
                        .exec((error, result) => {
                            if (error) {
                                console.log(error);
                                return res.status(500).send({
                                    _error: true,
                                    err: error
                                });
                            } else {
                                res.status(200).send(result);
                            }

                        });
                }
            };
            findFromModel1();
            break;
        case 3:
            let findFromModel2 = (done) => {
                if (order <= 0 || order > 1 || order == null) {
                    productModel.find()
                        .sort({
                            favorites: 'asc'
                        })
                        .exec((error, result) => {
                            if (error) {
                                console.log(error);
                                return res.status(500).send({
                                    _error: true,
                                    err: error
                                });
                            } else {
                                res.status(200).send(result);
                            }

                        });
                } else {
                    productModel.find()
                        .sort({
                            favorites: 'desc'
                        })
                        .exec((error, result) => {
                            if (error) {
                                console.log(error);
                                return res.status(500).send({
                                    _error: true,
                                    err: error
                                });
                            } else {
                                res.status(200).send(result);
                            }

                        });
                }
            };
            findFromModel2();
            break;

    }
};

exports.getAll = function(req, res){
    productModel.find({}, function(err, result) {
        if(err){
            console.log(err);
            res.status(500).send(err);
        }else{
            fillProductFavorite(result, req.user, function (product_result) {
                res.status(200).send(product_result);
            });
        }
    });
};

exports.getAllInCategories = function(req, cat_list, done){
    let query_products;

    if(cat_list.length === 0){
        query_products = {};
    }else{
        query_products = {"categories": {"$all" : cat_list}};
    }

    productModel.find(query_products, function (err, result) {
        fillProductFavorite(result, req.user, function (product_result) {
            done(err, product_result);
        });
    });
};

exports.create = function (req, res) {
    const companyId = authManager.getCompanyId(req.user);
    const profilePicture = req.files.profilePicture;
    const images = req.files.image;
    let description = req.body.description;
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
                        productDescription: description,
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
                            mailManager.sendNotificationNewProduct(result);
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
                        product.productDescription = req.body.description;
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

let findFromModel = (req, res, offset, quantity) => {
    productModel.find()
        .limit(Number(quantity))
        .skip(Number(offset))
        .sort({
            createdAt: 'desc'
        })
        .exec((error, result) => {
            if (error) {
                console.log(error);
                return res.status(500).send({_error: true, err: error});
            }
            else {
                fillProductFavorite(result, req.user, function (product_result) {
                    res.status(200).send(product_result);
                });
            }
        });
};

let findNumberOfProducts = (done) => {
    productModel.find({}, (error, result) => {
        if (error) {
            res.status(500).send({_error: true, err: error});
        }
        else {
            done(result.length);
        }
    });
};

exports.getRecentlyCreatedProducts = (req, res) => {
    const offset = req.query.offset;
    const quantity = req.query.quantity;

    //Offset: if 0, start from 0, if 25, start from product number 25, if 33, start from product number 33 and so on
    //Note: Offset of 1st product is always '0'
    //Example:  If offset is 5 and quantity is 5, then client will get prod number 5, 6, 7, 8 & 9.
    findNumberOfProducts((result) => {
        if (offset < 0)
            res.status(500).send({_error: true, err: "Offset Negative"});
        else if (offset >= result)
            res.status(500).send({_error: true, err: "Offset beyond number of products"});
        else if (quantity <= 0)
            res.status(500).send({_error: true, err: "Quantity cannot be zero or less"});
        else {
            findFromModel(req, res, offset, quantity);
        }
    });
};

exports.getProductsSearch = function (req, res) {
    const searchText = req.query.search;

    const handleError = function (err) {
        console.log(err);
        res.status(500).send({_error: true, error: err});
    };


    const startTime = new Date().getTime();

    //First find all Products where the title, manual description
    //or other text match
    productModel.find(
        {$text: {$search: searchText, $language: "en" }},
        {score: { $meta: "textScore" } })
        .sort( { score: { $meta: "textScore" } } )
        .exec(function(err,products){
            if(err){
                handleError(err);
                return
            }
            let exclude_list = [];
            for(let i = 0; i < products.length; i++){
                exclude_list.push(products[i]._id);
            }

            //Then find other documents over populate from brand, and categorie
            productModel.find({ '_id': { '$nin': exclude_list }})
                .populate({
                    path: 'company_id',
                    match: {
                        $text: {$search: searchText, $language: "en"}
                    }
                })
                .populate({
                    path: 'categories',
                    match: {
                        $text: {$search: searchText, $language: "en"}
                    }
                })
                .exec(function(err,productsPopulate){
                    if(err){
                        handleError(err);
                        return
                    }
                    productsPopulate = productsPopulate.filter(function(product) {
                        return product.company_id || product.categories.length > 0;
                    });

                    const endTime = new Date().getTime();

                    fillProductFavorite(products.concat(productsPopulate),req.user,function (product_list) {
                        res.status(200).send(product_list);
                    });

                    console.log("Search Results--------");
                    console.log("   Number of Products: " + (products.length + productsPopulate.length));
                    console.log("   Found by Product Name/Materials: " + products.length);
                    console.log("   Found by Population of Product - Company/Categorie: " + productsPopulate.length);
                    console.log("   Time needed for Search Engine: " + (endTime - startTime) + "ms");
                });
        });

};
