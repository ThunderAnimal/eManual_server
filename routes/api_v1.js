var express = require('express');
var router = express.Router();
var rep = require('../app/models/Representative');
var policy = require('../app/moduls/routePolicy');

var upload = require('../app/moduls/fileUpload');

var categoryModel = require('../app/models/Category');
var productModel = require('../app/models/Product');
var consumerManager = require('../app/moduls/ConsumerManager');
var productManager = require('../app/moduls/ProductManager');

//API representatives
router.route('/representatives')
    .all(policy.onlyCompanyAllowed)
    .get( function (req, res, next) {

        rep.find({"company": req.user._id},{name:1},function (err, data) {
            if(err){
                console.log(err);
            }
            res.send(data);
        }).catch(function(e){
            var err = new Error(e);
            err.status = 500;
            next(err);
        });
    })
    .post(function (req, res, next) {
        var NewRep = new rep({
            login: req.body.login,
            password: req.body.password,
            name: req.body.name,
            company: req.user._id
        });

        NewRep.save().then(function (err, result) {
            if (err) {
                res.send(err);
            } else {
                res.status(200).send(result);
            }
        });
    });

//API Customer


//API Products
router.get('/products', productManager.getAll);
router.get('/product/:_id', productManager.getOne);
router.post('/product', policy.isAuthorized, policy.onlyRepresentativeAllowed, upload.fields([{ name: 'image'}, { name: 'resources'}]), productManager.create);
router.put('/product/:_id', policy.onlyRepresentativeAllowed, productManager.update);
router.delete('/product/:_id', policy.onlyRepresentativeAllowed, productManager.delete);



router.get('/categories', function(req, res){


    function addCategoryCounterArray(categoriesList){

        let returnList = [];
        let found = false;
        for (let i=0; i<categoriesList.length; i++){
            found = false;
            for (let j=0; j<returnList.length; j++){
                if (returnList[j]._id.toString() === categoriesList[i].toString()){
                    returnList[j].count +=1;
                    found = true;
                    break;
                }
            }
            if(!found){
                returnList.push({
                    _id: categoriesList[i],
                    count: 1
                });
            }
        }

        return returnList;
    }

    function addCategoryNames(categorieList, done){

        let returnList = [];
        const helperAddCategoryNames = function (counter) {
            if(counter === categorieList.length){
                done(returnList);
                return;
            }

            categoryModel.findOne({"_id": categorieList[counter]._id}, function (err, cat) {
                if (err) {
                    console.log(err);
                    counter += 1;
                    helperAddCategoryNames(counter);
                }else{
                    returnList.push({
                        _id: cat._id,
                        name: cat.name,
                        count: categorieList[counter].count
                    });
                    counter += 1;
                    helperAddCategoryNames(counter);
                }
            });
        };

        helperAddCategoryNames(0);
    }

    let categoriesList = [];
    let cat_collection = [];
    let query_products;

    let cat_list = req.body.categorie_list;
    cat_list = ['5a1ab6230680f03fe02259da'];
    if(!cat_list){
        query_products = {};
    }else{
        query_products = {"categories": {"$in" : cat_list}};
    }


    productModel.find(query_products, function (err, product_result) {
        if (err) {
            console.log(err);
            const err = new Error(err);
            err.status = 500;
            next(err);
        }

        for (let i = 0; i < product_result.length; i++) {
            for (let j = 0; j < product_result[i].categories.length; j++) {
                cat_collection.push(product_result[i].categories[j]);
            }
        }
        console.log(product_result);

        console.log(cat_collection);

        categoriesList = addCategoryCounterArray(cat_collection);

        console.log(categoriesList);

        for(let k = 0; k < categoriesList.length; k++){
            for(let j = 0; j < cat_list.length; j++) {
                if (categoriesList[k]._id.toString() === cat_list[j].toString()) {
                    console.log(k);
                    categoriesList.splice(k, 1);
                }
            }
        }

        console.log(categoriesList);

        addCategoryNames(categoriesList, function (cat_result) {
            res.send({productList: product_result, categoryList: cat_result});
        });
    }).catch(function (e) {
        const err = new Error(e);
        err.status = 500;
        next(err);
    });
});

/*
Currently the top categories are:
1. Televisions
2. Bestsellers
3. Projectors
4. Home Entertainment Systems
5. Cameras
 */
router.get('/categories_top', function(req, res){
    let topCatList = [
        "Televisions",
        "Bestsellers",
        "Projectors",
        "Home Entertainment Systems",
        "Cameras"
    ];



    function addCategoryNames(done){

        let finalCatArray = [];
        const helperAddCategoryNames = function (counter) {
            if(counter === topCatList.length){
                done(finalCatArray);
                return;
            }

            categoryModel.findOne({"name": topCatList[counter]}, function (err, cat) {
                if (err) {
                    console.log(err);
                    counter += 1;
                    helperAddCategoryNames(counter);
                }else{
                    finalCatArray.push({
                        _id: cat._id,
                        name: cat.name,
                        count: 0
                    });
                    counter += 1;
                    helperAddCategoryNames(counter);
                }
            });
        };

        helperAddCategoryNames(0);
    }

    addCategoryNames(function(finalCatArray, done){
        productModel.find({}, function(err, data){
            if (err){
                console.log("Error!!");
                res.status(500).send(err);
            }
            for (let i=0; i<finalCatArray.length; i++){
                for (let j=0; j<data.length; j++){
                    for (let k=0; k<data[j].categories.length; k++){
                        if (finalCatArray[i]._id.toString() === data[j].categories[k].toString()){
                            finalCatArray[i].count+=1;
                            break;
                        }
                    }
                }
            }
            res.status(200).send(finalCatArray);
        })
    });
});

module.exports = router;