const express = require('express');
const router = express.Router();

const MODEL_PATH = '../app/models/';
const rep = require(MODEL_PATH + 'Representative');

const policy = require('../app/moduls/routePolicy');

const upload = require('../app/moduls/fileUpload');

const productManager = require('../app/moduls/ProductManager');
const categoryManager = require('../app/moduls/CategoryManager');
const consumerManager = require('../app/moduls/ConsumerManager');
const companyManager = require('../app/moduls/CompanyManager');
//import serviceProductManager module
const serviceProvicderManager = require('../app/moduls/ServiceProviderManager');

//API Company
router.get('/company/:id', companyManager.getOne);
router.get('/company/:id/service_provider', policy.isAuthorized, serviceProvicderManager.getListFromCompany);

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
router.post('/product', policy.isAuthorized, policy.onlyRepresentativeAllowed, upload.fields([{name: 'profilePicture'}, { name: 'image'}, { name: 'resources'}]), productManager.create);
router.put('/product/:id',policy.isAuthorized, policy.onlyRepresentativeAllowed, upload.fields([{name: 'profilePicture'}, { name: 'image'}, { name: 'resources'}]), productManager.update);
router.delete('/product/:id',policy.isAuthorized, policy.onlyRepresentativeAllowed, productManager.delete);

router.post('/product/:id/material', policy.isAuthorized, policy.onlyRepresentativeAllowed, upload.fields([{ name: 'image'}, { name: 'resources'}]), productManager.addMaterials);
router.delete('/product/:id/material', policy.isAuthorized, policy.onlyRepresentativeAllowed, productManager.deleteMaterials);

router.get('/product_search', productManager.getProductsSearch);


router.get('/product/:id/service_provider', policy.isAuthorized, serviceProvicderManager.getListFromProduct);

//API Categories
router.get('/categories', categoryManager.getAll);
router.get('/category/:id', categoryManager.getOne);


//API Consumers
router.put('/toggle_optin', policy.isAuthorized, policy.onlyCustomerAllowed, consumerManager.toggleOptIn); //Toggle subscribed or not subscribed
router.get('/get_subscription_status', policy.isAuthorized, policy.onlyCustomerAllowed, consumerManager.getSubscriptionStatus); //Sends info, whether subscribed or not
router.get('/selected_product',policy.isAuthorized,policy.onlyCustomerAllowed,consumerManager.getSelectedProduct);
router.put('/selected_product',policy.isAuthorized,policy.onlyCustomerAllowed,consumerManager.changeProducts);
router.get('/spam_address',policy.isAuthorized,policy.onlyCustomerAllowed,consumerManager.getSpamAddress);
router.put('/spam_address',policy.isAuthorized,policy.onlyCustomerAllowed,consumerManager.updateSpamAddress);
//router.get('/consumerProducts', policy.isAuthorized, policy.onlyCustomerAllowed, consumerManager.getConsumerProducts);

router.post('/consumer/contact/service_provider', policy.isAuthorized, policy.onlyCustomerAllowed, consumerManager.messagesToServiceProviders);

//Get recently created products:c
router.get('/dir_recent_products', productManager.getRecentlyCreatedProducts);

//API ServiceProvider
router.get('/service_providers', policy.isAuthorized, policy.onlyRepresentativeAllowed,serviceProvicderManager.getAllServiceProviders);
router.put('/service_providers', policy.isAuthorized, policy.onlyRepresentativeAllowed,serviceProvicderManager.addServiceProvider);
router.delete('/service_providers', policy.isAuthorized, policy.onlyRepresentativeAllowed,serviceProvicderManager.deleteServiceProvider);

router.post('/service_provider/message', policy.isAuthorized, policy.onlyServiceProviderAllowed,serviceProvicderManager.sendMessagesToConsumers);
router.get('/all_allowed_companies', policy.isAuthorized, policy.onlyServiceProviderAllowed, companyManager.listAllAuthorizedCompanies);

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

    productManager.getAllInCategories(req, cat_list, function (err, product_result) {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        }
        categoryManager.getAllFromProducts(product_result, function (cat_result) {
            //REMOVE CATEGORIES FROM CALL
            cat_result = cat_result.filter(function(value){
                return cat_list.indexOf(value._id.toString()) === -1;
            });

            res.status(200).send({productList: product_result, categoryList: cat_result});
        });
    });
});


module.exports = router;