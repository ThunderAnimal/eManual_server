const express = require('express');
const router = express.Router();

const rep = require('../app/models/Representative');
const consumerModel = require('../app/models/Consumer');

const policy = require('../app/moduls/routePolicy');

const upload = require('../app/moduls/fileUpload');

const productManager = require('../app/moduls/ProductManager');
const categoryManager = require('../app/moduls/CategoryManager');
const consumerManager = require('../app/moduls/ConsumerManager');
const fs = require('fs');


//API representatives
router.route('/representatives')
    .all(policy.isAuthorized, policy.onlyCompanyAllowed)
    .get( function (req, res, next) {
        rep.find({"company": req.user._id},{name:1},function (err, data) {
            if(err) {
                console.log(err);
                res.status(500).send(err);
            }
            res.status(200).send(data);
        });
    })
    .post(function (req, res, next) {
        const NewRep = new rep({
            login: req.body.login,
            password: req.body.password,
            name: req.body.name,
            company: req.user._id
        });

        NewRep.save().then(function (err, result) {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            } else {
                res.status(200).send(result);
            }
        });
    });

//API Products
router.get('/products', productManager.getAll);
router.get('/company_product',policy.isAuthorized,policy.onlyRepresentativeAllowed,productManager.getCompanyProduct);
router.get('/product/:id', productManager.getOne);
router.post('/product', policy.isAuthorized, policy.onlyRepresentativeAllowed, upload.fields([{ name: 'image'}, { name: 'resources'}]), productManager.create);
router.put('/product/:id',policy.isAuthorized, policy.onlyRepresentativeAllowed, upload.fields([{ name: 'image'}, { name: 'resources'}]), productManager.update);
router.delete('/product/:id',policy.isAuthorized, policy.onlyRepresentativeAllowed, productManager.delete);

router.post('/product/:id/material', policy.isAuthorized, policy.onlyRepresentativeAllowed, upload.fields([{ name: 'image'}, { name: 'resources'}]), productManager.addMaterials);
router.delete('/product/:id/material', policy.isAuthorized, policy.onlyRepresentativeAllowed, productManager.deleteMaterials);

//API Categories
router.get('/categories', categoryManager.getAll);
router.get('/category/:id', categoryManager.getOne);

router.get('/selected_product',policy.isAuthorized,policy.onlyCustomerAllowed,consumerManager.getSelectedProduct);
router.put('/selected_product',policy.isAuthorized,policy.onlyCustomerAllowed,consumerManager.changeProducts);
//router.get('/consumerProducts', policy.isAuthorized, policy.onlyCustomerAllowed, consumerManager.getConsumerProducts);


/*
Currently the top categories are:
1. Televisions
2. Bestsellers
3. Projectors
4. Home Entertainment Systems
5. Cameras
 */
router.get('/categories_top', categoryManager.getTopWithCounter);


//API Combined
router.get('/dir_products', function(req, res){
    let cat_list;

    if(!req.query.categorie_list){
        cat_list = [];
    }else{
        cat_list = req.query.categorie_list;
    }

    productManager.getAllInCategories(cat_list, function (err, product_result) {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        }
        categoryManager.getAllFromProducts(product_result, function (cat_result) {
            //REMOVE CATEGORIES FROM CALL
            cat_result = cat_result.filter(function(value){
                return cat_list.indexOf(value._id.toString()) === -1;
            });
            let finalProductList = [];
            let isFavorite = (product_entity, x, req, yes, no) => {
                let productID = product_entity._id;
                for (let i = 0; i < req.user.products.length; i++) {
                    if (req.user.products[i].toString() === productID.toString()) {
                        yes(x);
                        return;
                    }
                }
                no(x);
            };
            let sendData = (done) => {
                let isConsumer = () => {
                    for (let i=0; i<product_result.length; i++){
                        isFavorite(product_result[i], i, req, (i)=>{
                            let item = {
                                _id: product_result[i]._id,
                                productName: product_result[i].productName,
                                company_id: product_result[i].company_id,
                                productResources: product_result[i].productResources,
                                productImages: product_result[i].productImages,
                                categories: product_result[i].categories,
                                isFavorite: true
                            };
                            finalProductList.push(item);
                        }, (i)=>{
                            let item = {
                                _id: product_result[i]._id,
                                productName: product_result[i].productName,
                                company_id: product_result[i].company_id,
                                productResources: product_result[i].productResources,
                                productImages: product_result[i].productImages,
                                categories: product_result[i].categories,
                                isFavorite: false
                            };
                            finalProductList.push(item);
                        });
                    }
                    done();
                };

                let isNotConsumer = () => {
                    finalProductList = product_result;
                    done();
                };
                consumerManager.isRequestFromUser(req, isConsumer, isNotConsumer);

            };
            sendData(()=>{
                res.status(200).send({productList: finalProductList, categoryList: cat_result});
            });
        });
    });
});


module.exports = router;